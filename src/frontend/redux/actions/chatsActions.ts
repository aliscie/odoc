// chatActions.ts
import {
  OPEN_CHAT,
  SET_CHATS,
  SEND_MESSAGE,
  UPDATE_MESSAGE,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  SET_CHATS_NOTIFICATIONS,
} from '../types/chatsTypes';
import { FEChat, Message } from '../../../declarations/backend/backend.did';
import { Principal } from "@dfinity/principal";

export const openChat = (current_chat_id: string, current_user: Principal) => ({
  type: OPEN_CHAT,
  current_chat_id,
  current_user,
} as const);

export const setChats = (chats: FEChat[]) => ({
  type: SET_CHATS,
  chats,
} as const);

export const sendMessage = (message: Message) => ({
  type: SEND_MESSAGE,
  message,
} as const);

export const updateMessage = (message: Message) => ({
  type: UPDATE_MESSAGE,
  message,
} as const);

export const addNotification = (message: Message) => ({
  type: ADD_NOTIFICATION,
  message,
} as const);

export const setChatsNotifications = (messages: Message[]) => ({
  type: SET_CHATS_NOTIFICATIONS,
  messages,
} as const);

export const updateNotification = (message: Message) => ({
  type: UPDATE_NOTIFICATION,
  message,
} as const);
