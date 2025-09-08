import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MessagesScreen.css';

import { useAuth } from '../hooks/useAuth';
import { searchUsersByDisplayName, UserLite, getUsersLiteByIds } from '../services/firestore';
import { listenUserChats, getChatSummaries, ChatSummary, createChat } from '../services/realtime';

const MessagesScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<ChatSummary[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<UserLite[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserLite[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  const [userCache, setUserCache] = useState<Record<string, UserLite>>({});

  const getInitial = (text?: string) => (text && text.trim().length > 0 ? text.trim()[0].toUpperCase() : '?');

  useEffect(() => {
    if (!user) {
      setSummaries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenUserChats(user.uid, async (userChats) => {
      try {
        const chatIds = userChats ? Object.keys(userChats) : [];
        if (chatIds.length === 0) {
          setSummaries([]);
          setLoading(false);
          return;
        }
        const list = await getChatSummaries(chatIds);
        setSummaries(list);
        setLoading(false);
      } catch (e: any) {
        setError(e?.message || 'Erreur lors de la récupération des chats');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Résoudre les noms des directs (autre membre)
  useEffect(() => {
    const run = async () => {
      if (!user) return;
      const directOthers: string[] = [];
      for (const s of summaries) {
        if (s.type === 'direct') {
          const memberIds = Object.keys((s as any).memberIds || {});
          const other = memberIds.find(id => id !== user.uid);
          if (other && !userCache[other]) directOthers.push(other);
        }
      }
      if (directOthers.length > 0) {
        const map = await getUsersLiteByIds(directOthers);
        setUserCache(prev => ({ ...prev, ...map }));
      }
    };
    run();
  }, [summaries, user]);

  const groupChats = useMemo(() => summaries.filter(s => s.type === 'group'), [summaries]);
  const individualChats = useMemo(() => summaries.filter(s => s.type === 'direct'), [summaries]);

  const getDirectDisplayName = (s: ChatSummary): string => {
    const memberIds = Object.keys((s as any).memberIds || {});
    const other = user ? memberIds.find(id => id !== user.uid) : undefined;
    if (other && userCache[other]?.displayName) return userCache[other].displayName;
    return s.name || 'Discussion';
  };

  const resetModal = () => {
    setChatType('direct');
    setGroupName('');
    setSearchTerm('');
    setResults([]);
    setSelectedUsers([]);
    setCreating(false);
  };

  const handleNewMessage = () => {
    if (!user) {
      setError('Vous devez être connecté pour créer une discussion.');
      return;
    }
    resetModal();
    setShowModal(true);
  };

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const list = await searchUsersByDisplayName(searchTerm.trim(), 8);
        if (!active) return;
        const filtered = list.filter(u => u.id !== user?.uid && !selectedUsers.find(su => su.id === u.id));
        setResults(filtered);
      } catch (e) {
        // ignore
      } finally {
        if (active) setSearchLoading(false);
      }
    };
    run();
    return () => { active = false; };
  }, [searchTerm, user, selectedUsers]);

  const addSelected = (u: UserLite) => {
    if (chatType === 'direct') {
      setSelectedUsers([u]);
      setResults([]);
      setSearchTerm('');
      return;
    }
    if (!selectedUsers.find(s => s.id === u.id)) {
      setSelectedUsers([...selectedUsers, u]);
      setResults(results.filter(r => r.id !== u.id));
      setSearchTerm('');
    }
  };

  const removeSelected = (id: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== id));
  };

  const handleCreateChat = async () => {
    if (!user || creating) return;
    setCreating(true);
    setError(null);
    try {
      if (chatType === 'direct') {
        if (selectedUsers.length !== 1) {
          setError('Sélectionnez exactement 1 utilisateur.');
          setCreating(false);
          return;
        }
        const memberIds = Array.from(new Set([user.uid, selectedUsers[0].id]));
        const id = await createChat({ type: 'direct', memberIds, creatorId: user.uid });
        setShowModal(false);
        navigate(`/messages/${id}`);
      } else {
        const memberIds = Array.from(new Set([user.uid, ...selectedUsers.map(u => u.id)]));
        if (memberIds.length < 2) {
          setError('Le groupe doit contenir au moins 2 membres.');
          setCreating(false);
          return;
        }
        const id = await createChat({ type: 'group', name: groupName.trim() || 'Nouveau groupe', memberIds, creatorId: user.uid });
        setShowModal(false);
        navigate(`/messages/${id}`);
      }
    } catch (e: any) {
      setError(e?.message || "Impossible de créer la discussion");
    } finally {
      setCreating(false);
    }
  };

  const openChat = (id: string) => {
    navigate(`/messages/${id}`);
  };

  return (
    <div className="messages-screen">
      {/* Header avec titre et bouton + */}
      <div className="messages-header">
        <h1>Messages</h1>
        <button className="new-message-btn" onClick={handleNewMessage}>
          <span className="plus-icon">+</span>
        </button>
      </div>

      {/* Contenu principal scrollable */}
      <div className="messages-content">
        {error && (
          <div className="chat-section">
            <div className="section-title">Erreur</div>
            <div className="chat-list">
              <div className="chat-item">{error}</div>
            </div>
          </div>
        )}

        {!error && loading && (
          <div className="chat-section">
            <div className="section-title">Chargement...</div>
            <div className="chat-list">
              <div className="chat-item">Veuillez patienter</div>
            </div>
          </div>
        )}

        {!error && !loading && summaries.length === 0 && (
          <div className="chat-section">
            <div className="section-title">Aucune conversation</div>
            <div className="chat-list">
              <div className="chat-item">Créez une nouvelle discussion avec le bouton +</div>
            </div>
          </div>
        )}

        {!error && !loading && summaries.length > 0 && (
          <>
            {/* Section Groupes */}
            <div className="chat-section">
              <h2 className="section-title">Groupes</h2>
              <div className="chat-list">
                {groupChats.map((group) => (
                  <div key={group.id} className="chat-item group-chat" onClick={() => openChat(group.id)}>
                    <div className="chat-avatar group-avatar">
                      {getInitial(group.name)}
                    </div>
                    <div className="chat-info">
                      <div className="chat-name">{group.name || 'Groupe'}</div>
                      <div className="chat-last-message">{group.lastMessage || ''}</div>
                    </div>
                  </div>
                ))}
                {groupChats.length === 0 && (
                  <div className="chat-item">Aucun groupe</div>
                )}
              </div>
            </div>

            {/* Section Messages individuels */}
            <div className="chat-section">
              <h2 className="section-title">Messages</h2>
              <div className="chat-list">
                {individualChats.map((chat) => {
                  const name = getDirectDisplayName(chat);
                  return (
                    <div key={chat.id} className="chat-item individual-chat" onClick={() => openChat(chat.id)}>
                      <div className="chat-avatar individual-avatar">
                        {getInitial(name)}
                      </div>
                      <div className="chat-info">
                        <div className="chat-name">{name}</div>
                        <div className="chat-last-message">{chat.lastMessage || ''}</div>
                      </div>
                    </div>
                  );
                })}
                {individualChats.length === 0 && (
                  <div className="chat-item">Aucune discussion</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title">Nouvelle discussion</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <label className="modal-label">Type</label>
                <div className="modal-segmented">
                  <button
                    className={chatType === 'direct' ? 'segmented active' : 'segmented'}
                    onClick={() => setChatType('direct')}
                  >Direct</button>
                  <button
                    className={chatType === 'group' ? 'segmented active' : 'segmented'}
                    onClick={() => setChatType('group')}
                  >Groupe</button>
                </div>
              </div>

              {chatType === 'group' && (
                <div className="modal-row">
                  <label className="modal-label">Nom du groupe</label>
                  <input
                    className="modal-input"
                    placeholder="Ex: Match de foot"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
              )}

              <div className="modal-row">
                <label className="modal-label">Rechercher des utilisateurs</label>
                <input
                  className="modal-input"
                  placeholder="Tapez un nom (min 2 caractères)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchLoading && <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Recherche...</div>}
                {results.length > 0 && (
                  <div className="autocomplete-list">
                    {results.map(u => (
                      <button key={u.id} className="autocomplete-item" onClick={() => addSelected(u)}>
                        <span className="autocomplete-avatar">{u.displayName?.[0]?.toUpperCase() || '?'}</span>
                        <span className="autocomplete-name">{u.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedUsers.length > 0 && (
                <div className="modal-row">
                  <label className="modal-label">Sélection</label>
                  <div className="selected-users">
                    {selectedUsers.map(u => (
                      <div key={u.id} className="selected-chip">
                        <span className="chip-avatar">{u.displayName?.[0]?.toUpperCase() || '?'}</span>
                        <span className="chip-name">{u.displayName}</span>
                        <button className="chip-remove" onClick={() => removeSelected(u.id)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={() => setShowModal(false)} disabled={creating}>Annuler</button>
              <button className="modal-button primary" onClick={handleCreateChat} disabled={creating} aria-busy={creating}>
                {creating ? 'Création…' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesScreen;
