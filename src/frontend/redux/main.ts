import {combineReducers, createStore} from "redux";
import {MainActions, uiReducer} from "./uil";
import {FilesActions, filesReducer} from "./files";
import {FriendsActions} from "./friends";
import {CHAT_ACTIONS, chatsReducer} from "./chats_reducer";

type ReduxTypes = MainActions | FilesActions | FriendsActions | CHAT_ACTIONS;
export const handleRedux = (type: ReduxTypes, data?: any) => ({
    type,
    ...data
});

// const store = createStore(uiReducer);
// const filesStore = createStore(filesReducer);

const store = createStore(combineReducers({
    uiReducer,
    filesReducer,
    chatsReducer,
    // friendsReducer
}));

export default store;