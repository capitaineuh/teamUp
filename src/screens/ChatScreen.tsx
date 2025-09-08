import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './MessagesScreen.css';
import { useAuth } from '../hooks/useAuth';
import { getUsersLiteByIds } from '../services/firestore';
import { listenChatMessages, sendMessage, ChatMessage, getChat, ChatSummary } from '../services/realtime';

const formatTime = (ms: number) => {
  const d = new Date(ms || Date.now());
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatScreen = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [chat, setChat] = useState<ChatSummary | null>(null);
  const [members, setMembers] = useState<Record<string, { id: string; displayName: string }>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!chatId) return;
      const c = await getChat(chatId);
      if (!active) return;
      setChat(c);
      // Charger noms membres (pour direct)
      const ids = Object.keys((c as any)?.memberIds || {});
      if (ids.length > 0) {
        const map = await getUsersLiteByIds(ids);
        if (!active) return;
        setMembers(map);
      }
    };
    load();
    return () => { active = false; };
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    const unsub = listenChatMessages(chatId, setMessages);
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const title = useMemo(() => {
    if (!chat) return 'Discussion';
    if (chat.type === 'group') return chat.name || 'Groupe';
    // direct: afficher le nom de l'autre
    const myId = user?.uid;
    const otherId = Object.keys((chat as any).memberIds || {}).find(id => id !== myId);
    return (otherId && members[otherId]?.displayName) || chat.name || 'Discussion';
  }, [chat, members, user?.uid]);

  const canSend = useMemo(() => !!user && !!chatId && input.trim().length > 0, [user, chatId, input]);

  const handleSend = async () => {
    if (!user || !chatId) return;
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendMessage(chatId, user.uid, text);
  };

  return (
    <div className="messages-screen">
      <div className="messages-header">
        <h1>{title}</h1>
        <button className="new-message-btn" onClick={() => navigate(-1)}>←</button>
      </div>

      <div className="messages-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="chat-list" style={{ flex: 1 }}>
          {messages.map((m) => {
            const mine = m.senderId === user?.uid;
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    background: mine ? '#000' : '#f2f2f2',
                    color: mine ? '#fff' : '#000',
                    borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '0.6rem 0.8rem',
                    margin: '0.25rem 0 0.1rem 0',
                    lineHeight: 1.4,
                    fontSize: '0.95rem'
                  }}
                >
                  {m.text}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, margin: mine ? '0 0.25rem 0 0' : '0 0 0 0.25rem' }}>
                  {formatTime(m.timestamp)}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: '0.75rem', borderTop: '1px solid #eee', background: '#fff', display: 'flex', gap: '0.5rem' }}>
        <input
          className="modal-input"
          placeholder="Votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && canSend) handleSend(); }}
          style={{ flex: 1 }}
        />
        <button className="modal-button primary" onClick={handleSend} disabled={!canSend}>Envoyer</button>
      </div>
    </div>
  );
};

export default ChatScreen;
