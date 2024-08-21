// chatTypesAndActionTypes.ts
import { FEChat, Message } from '../../../declarations/backend/backend.did';
import { Principal } from "@dfinity/principal";
import { BaseAction } from '../actions/chatsActions';

// Action Type Constants
export const OPEN_CHAT = 'OPEN_CHAT';
export const SET_CHATS = 'SET_CHATS';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION';
export const SET_CHATS_NOTIFICATIONS = 'SET_CHATS_NOTIFICATIONS';

// Define specific action types
export type OpenChatAction = BaseAction<{ current_chat_id: string; current_user: Principal }>;
export type SetChatsAction = BaseAction<{ chats: FEChat[] }>;
export type SendMessageAction = BaseAction<{ message: Message }>;
export type UpdateMessageAction = BaseAction<{ message: Message }>;
export type AddNotificationAction = BaseAction<{ message: Message }>;
export type UpdateNotificationAction = BaseAction<{ message: Message }>;
export type SetChatsNotificationsAction = BaseAction<{ messages: Message[] }>;


// Action Types
export type ChatActions =
    | { type: typeof OPEN_CHAT; current_chat_id: string; current_user: Principal }
    | { type: typeof SET_CHATS; chats: FEChat[] }
    | { type: typeof SEND_MESSAGE; message: Message }
    | { type: typeof UPDATE_MESSAGE; message: Message }
    | { type: typeof ADD_NOTIFICATION; message: Message }
    | { type: typeof UPDATE_NOTIFICATION; message: Message }
    | { type: typeof SET_CHATS_NOTIFICATIONS; messages: Message[] };

// State Types
export type ChatState = {
    current_chat_id: string | false,
    chats: Array<FEChat>,
    current_user: Principal,
    chats_notifications: Array<Message>,
};

// Initial State
export const initialChatsState: ChatState = {
    current_chat_id: false,
    current_user: Principal.fromText("2vxsx-fae"),
    chats: [],
    chats_notifications: [],
};
