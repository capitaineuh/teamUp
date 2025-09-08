import { ref, onValue, push, set, get, child, update } from 'firebase/database';

import { rtdb } from '../config/firebase';

export interface ChatSummary {
  id: string;
  type: 'group' | 'direct';
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface CreateChatInput {
  type: 'group' | 'direct';
  name?: string; // requis pour group
  memberIds: string[]; // pour direct, longueur 2
  creatorId: string; // uid du créateur (auth.uid)
}

const paths = {
  userChats: (userId: string) => `userChats/${userId}`, // { chatId: true }
  chats: `chats`, // chats/{chatId}
  chatMessages: (chatId: string) => `messages/${chatId}`, // messages/{chatId}/{messageId}
};

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: any;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.error(`[realtime] timeout after ${ms}ms`, label);
      reject(new Error(`Timeout ${label}`));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export function listenUserChats(userId: string, callback: (chats: Record<string, boolean> | null) => void) {
  const userChatsRef = ref(rtdb, paths.userChats(userId));
  return onValue(userChatsRef, (snapshot) => {
    callback(snapshot.val());
  });
}

export async function getChat(chatId: string): Promise<ChatSummary | null> {
  const snap = await get(child(ref(rtdb), `${paths.chats}/${chatId}`));
  const value = snap.val();
  if (!value) return null;
  return { id: chatId, ...value } as ChatSummary;
}

export async function getChatSummaries(chatIds: string[]): Promise<ChatSummary[]> {
  const result: ChatSummary[] = [];
  for (const chatId of chatIds) {
    const snap = await get(child(ref(rtdb), `${paths.chats}/${chatId}`));
    const value = snap.val();
    if (value) {
      result.push({ id: chatId, ...value });
    }
  }
  // Tri par lastMessageTime décroissant
  return result.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
}

export function listenChatMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
  const messagesRef = ref(rtdb, paths.chatMessages(chatId));
  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() as Record<string, Omit<ChatMessage, 'id'>> | null;
    if (!data) {
      callback([]);
      return;
    }
    const list: ChatMessage[] = Object.entries(data).map(([id, msg]) => ({ id, ...(msg as any) }));
    list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    callback(list);
  });
}

export async function createChat(input: CreateChatInput): Promise<string> {
  // eslint-disable-next-line no-console
  console.warn('[realtime] createChat start', { type: input.type, creatorId: input.creatorId, members: input.memberIds });
  const chatRef = push(ref(rtdb, paths.chats));
  const chatId = chatRef.key as string;
  const payload = {
    type: input.type,
    name: input.type === 'group' ? input.name || 'Nouveau groupe' : '',
    avatar: '',
    lastMessage: '',
    lastMessageTime: 0,
    memberIds: input.memberIds.reduce<Record<string, boolean>>((acc, id) => {
      acc[id] = true;
      return acc;
    }, {}),
    createdAt: Date.now(),
  };
  try {
    // eslint-disable-next-line no-console
    console.warn('[realtime] write chat payload', { chatId });
    await withTimeout(set(chatRef, payload), 8000, 'set(chats)');
    // Indexer uniquement le créateur (conforme aux règles)
    // eslint-disable-next-line no-console
    console.warn('[realtime] index userChats', { userId: input.creatorId, chatId });
    await withTimeout(set(ref(rtdb, `${paths.userChats(input.creatorId)}/${chatId}`), true), 8000, 'set(userChats)');
    // eslint-disable-next-line no-console
    console.warn('[realtime] createChat success', { chatId });
    return chatId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[realtime] createChat error', err);
    throw err;
  }
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<void> {
  const messageRef = push(ref(rtdb, paths.chatMessages(chatId)));
  const messagePayload = {
    chatId,
    senderId,
    text,
    timestamp: Date.now(),
  };
  await set(messageRef, messagePayload);
  // Mettre à jour résumé du chat
  await update(ref(rtdb, `${paths.chats}/${chatId}`), {
    lastMessage: text,
    lastMessageTime: Date.now(),
  });
}
