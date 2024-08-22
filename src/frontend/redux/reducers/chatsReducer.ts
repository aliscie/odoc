import { ChatActions, ChatState, initialChatsState, OPEN_CHAT, SET_CHATS, SEND_MESSAGE, UPDATE_MESSAGE, ADD_NOTIFICATION, UPDATE_NOTIFICATION, SET_CHATS_NOTIFICATIONS } from '../types/chatsTypes';
import { FEChat, Message, UserFE } from '../../../declarations/backend/backend.did';

export function chatsReducer(state: ChatState = initialChatsState, action: ChatActions): ChatState {
  switch (action.type) {
    case OPEN_CHAT: {
      const { current_chat_id, current_user } = action;
      return {
        ...state,
        current_chat_id,
        current_user,
      };
    }

    case SET_CHATS: {
      return {
        ...state,
        chats: action.chats,
      };
    }

    case SEND_MESSAGE: {
      let chat = state.chats.find((chat: FEChat) => chat.id === action.message.chat_id);

      if (!chat) {
        let admin: UserFE = {
          id: state.current_user.toString(),
          name: "other",
        };
        chat = {
          creator: {
            id: "profile.id",
            name: "profile.name",
          },
          members: [],
          name: "",
          admins: [admin],
          id: action.message.chat_id,
          messages: [action.message],
        };
        return {
          ...state,
          chats: [...state.chats, chat],
          current_chat_id: action.message.chat_id,
        };
      }

      return {
        ...state,
        chats: state.chats.map((_chat: FEChat) =>
          _chat.id === chat.id ? { ...chat, messages: [...chat.messages, action.message] } : _chat
        ),
      };
    }

    case UPDATE_MESSAGE: {
      return {
        ...state,
        chats: state.chats.map((chat: FEChat) =>
          chat.id === action.message.chat_id
            ? {
                ...chat,
                messages: chat.messages.map((message: Message) =>
                  message.id === action.message.id ? action.message : message
                ),
              }
            : chat
        ),
      };
    }

    case ADD_NOTIFICATION: {
      return {
        ...state,
        chats: state.chats.map((chat: FEChat) =>
          chat.id === action.message.chat_id
            ? {
                ...chat,
                messages: [...chat.messages, action.message],
              }
            : chat
        ),
        chats_notifications: [
          ...state.chats_notifications.filter((m: Message) => m.chat_id !== action.message.chat_id),
          action.message,
        ],
      };
    }

    case UPDATE_NOTIFICATION: {
      return {
        ...state,
        chats_notifications: state.chats_notifications.map((m: Message) =>
          m.chat_id === action.message.chat_id ? action.message : m
        ),
      };
    }

    case SET_CHATS_NOTIFICATIONS: {
      return {
        ...state,
        chats_notifications: action.messages,
      };
    }

    default:
      return state;
  }
}