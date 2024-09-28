import {
  ChatActions,
  ChatState,
  initialChatsState,
  OPEN_CHAT,
  SET_CHATS,
  SEND_MESSAGE,
  UPDATE_MESSAGE,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  SET_CHATS_NOTIFICATIONS,
  DELETE_CHAT,
  UPDATE_CHAT, ADD_CHAT, ADD_CHATS_NOTIFICATIONS,
} from "../types/chatsTypes";
import {
  FEChat,
  Message,
  UserFE,
} from "../../../declarations/backend/backend.did";
import message from "../../components/ChatNotifications/message";

export function chatsReducer(
  state: ChatState = initialChatsState,
  action: ChatActions,
): ChatState {
  switch (action.type) {
    case OPEN_CHAT: {
      const { current_chat_id, current_user } = action;
      return {
        ...state,
        current_chat_id,
        current_user,
      };
    }

    case ADD_CHAT: {
      return {
        ...state,
        chats: [...state.chats, action.chat],
      };
    }

    case SET_CHATS: {
      return {
        ...state,
        chats: action.chats,
      };
    }
    case UPDATE_CHAT: {
      const { chat } = action;

      return {
        ...state,
        chats: state.chats.map((c) => {
          if (c.id === chat.id) {
            return chat;
          }
          return c;
        }),
      };
    }
    case DELETE_CHAT: {
      const { chat_id } = action;
      let current_chat_id = state.current_chat_id;
      if (state.current_chat_id === chat_id) {
        current_chat_id = "none";
      }
      return {
        ...state,
        chats: state.chats.filter((chat: FEChat) => chat.id !== chat_id),
        current_chat_id,
      };
    }

    case SEND_MESSAGE: {
      let chats_notifications = state.chats_notifications.map((note) => {
        if (note.chat_id === action.message.chat_id) {
          return action.message;
        }
        return note;
      });
      let chat = state.chats.find(
        (chat: FEChat) => chat.id === action.message.chat_id,
      );

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
          chats_notifications,
        };
      }

      return {
        ...state,
        chats_notifications,
        chats: state.chats.map((_chat: FEChat) =>
          _chat.id === chat.id
            ? { ...chat, messages: [...chat.messages, action.message] }
            : _chat,
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
                  message.id === action.message.id ? action.message : message,
                ),
              }
            : chat,
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
            : chat,
        ),
        chats_notifications: [
          ...state.chats_notifications.filter(
            (m: Message) => m.chat_id !== action.message.chat_id,
          ),
          action.message,
        ],
      };
    }

    case UPDATE_NOTIFICATION: {
      return {
        ...state,
        chats_notifications: state.chats_notifications.map((m: Message) =>
          m.chat_id === action.message.chat_id ? action.message : m,
        ),
      };
    }

    case SET_CHATS_NOTIFICATIONS: {
      return {
        ...state,
        chats_notifications: action.messages,
      };
    }


    case ADD_CHATS_NOTIFICATIONS: {
      return {
        ...state,
        chats_notifications: [...state.chats_notifications, action.message],
      };
    }

    default:
      return state;
  }
}
