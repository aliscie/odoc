import {Chat} from "../../declarations/user_canister/user_canister.did";
import {Principal} from "@dfinity/principal";

export type CHAT_ACTIONS =
    "RECEIVE_MESSAGE"
    | "OPEN_CHAT"
    | "SET_CHATS"
    | "SEND_MESSAGE"
    | "SOMEONE_BLOCKED_YOU";

type InitialState = {
    current_chat_id: string | false,
    chats: Array<Chat>,
    current_user: Principal
}

export const initialChatsState: InitialState = {
    current_chat_id: false,
    current_user: Principal.fromText("2vxsx-fae"),
    chats: [],

};


export function chatsReducer(state = initialChatsState, action: any) {

    switch (action.type) {
        case 'OPEN_CHAT':
            state.current_chat_id = action.current_chat_id
            state.current_user = action.current_user
            break

        case 'SET_CHATS':
            state.chats = action.chats
            break

        case 'SEND_MESSAGE':
            console.log({
              action
            })
            state.chats = state.chats && state.chats.map((chat: Chat) => {
                if (chat.id == action.message.chat_id) {
                    chat.messages.push(action.message)
                }
                return chat
            });
            break
        default:
            console.error("chatsReducer Unknown action type: ", action.type);
    }
    return {...state}
}
