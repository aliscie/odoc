import {FEChat, Message, UserFE} from "../../declarations/backend/backend.did";
import {Principal} from "@dfinity/principal";
import {useSelector} from "react-redux";

export type CHAT_ACTIONS =
    "RECEIVE_MESSAGE"
    | "OPEN_CHAT"
    | "SET_CHATS"
    | "SEND_MESSAGE"
    | "SOMEONE_BLOCKED_YOU"
    | "ADD_NOTIFICATION"
    | "SET_CHATS_NOTIFICATIONS"
    | "UPDATE_MESSAGE"
    | "UPDATE_NOTIFICATION"

type InitialState = {
    current_chat_id: string | false,
    chats: Array<FEChat>,
    current_user: Principal
    chats_notifications: Array<Message>,
}

export const initialChatsState: InitialState = {
    current_chat_id: false,
    current_user: Principal.fromText("2vxsx-fae"),
    chats: [],
    chats_notifications: [],

};

export function chatsReducer(state = initialChatsState, action: any) {
    switch (action.type) {
        case 'OPEN_CHAT':
            return {
                ...state,
                current_chat_id: action.current_chat_id,
                current_user: action.current_user,
            };

        case 'SET_CHATS':
            return {
                ...state,
                chats: action.chats,
            };

        case 'SEND_MESSAGE':
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

            chat.messages.push(action.message);
            return {
                ...state,
                chats: state.chats.map((_chat: FEChat) => (_chat.id === chat.id ? chat : _chat)),
            };

        case 'UPDATE_MESSAGE':
            return {
                ...state,
                chats: (state.chats || []).map((chat: FEChat) => {
                    if (chat.id === action.message.chat_id) {
                        return {
                            ...chat,
                            messages: (chat.messages || []).map((message: Message) =>
                                message.id === action.message.id ? action.message : message
                            ),
                        };
                    }
                    return chat;
                }),
            };

        case 'ADD_NOTIFICATION':
            state.chats = state.chats.map((chat: FEChat) => {
                if (action.message.chat_id == chat.id) {
                    chat.messages.push(action.message)
                }
                return chat
            })
            return {
                ...state,
                chats_notifications: [...state.chats_notifications.filter((m: Message) => m.chat_id !== action.message.chat_id), action.message],
            };

        case 'UPDATE_NOTIFICATION':
            return {
                ...state,
                chats_notifications: state.chats_notifications.map((m: Message) =>
                    m.chat_id === action.message.chat_id ? action.message : m
                ),
            };

        case 'SET_CHATS_NOTIFICATIONS':
            return {
                ...state,
                chats_notifications: action.messages,
            };

        default:
            // console.error("chatsReducer Unknown action type: ", action.type);
            // console.log("chatsReducer Unknown action type: ");
            return state;
    }
}
