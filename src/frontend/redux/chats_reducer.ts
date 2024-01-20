import {FEChat, Message, UserFE} from "../../declarations/user_canister/user_canister.did";
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
    // const {profile} = useSelector((state: any) => state.filesReducer);
    switch (action.type) {
        case 'OPEN_CHAT':
            state.current_chat_id = action.current_chat_id
            state.current_user = action.current_user
            break

        case 'SET_CHATS':
            state.chats = action.chats
            break

        case 'SEND_MESSAGE':
            let chat: FEChat | undefined = state.chats.find((chat: FEChat) => chat.id == action.message.chat_id)
            if (!chat) {
                let admin: UserFE = {
                    id: state.current_user.toString(),
                    name: "other"
                }
                chat = {
                    'creator': {
                        id: "profile.id",
                        name: "profile.name"
                    },
                    'members': [],
                    'name': "",
                    'admins': [admin],
                    id: action.message.chat_id,
                    messages: [action.message],
                }
                state.chats.push(chat)
                state.current_chat_id = action.message.chat_id
                break
            }
            chat.messages.push(action.message)
            state.chats = state.chats.map((_chat: FEChat) => {
                if (chat && _chat.id == chat.id) {
                    return chat
                }
                return _chat
            });
            break

        case 'UPDATE_MESSAGE':
            state.chats = state.chats && state.chats.map((chat: FEChat) => {
                if (chat.id == action.message.chat_id) {
                    chat.messages = chat.messages.map((message: Message) => {
                        if (message.id == action.message.id) {
                            message = action.message
                        }
                        return message
                    })
                }
                return chat
            })
            break

        case 'ADD_NOTIFICATION':
            state.chats_notifications = state.chats_notifications.filter((m: Message) => m.chat_id != action.message.chat_id)
            state.chats_notifications.push(action.message)
            break
        case 'UPDATE_NOTIFICATION':
            state.chats_notifications = state.chats_notifications.map((m: Message) => {
                if (m.chat_id == action.message.chat_id) {
                    return action.message
                }
                return m
            })
            break

        case 'SET_CHATS_NOTIFICATIONS':
            state.chats_notifications = action.messages
            break
        default:
            console.error("chatsReducer Unknown action type: ", action.type);
    }
    return {...state}
}
