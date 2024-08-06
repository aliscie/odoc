import { combineReducers } from 'redux';

import { uiReducer } from './uiReducer';
import { filesReducer } from './filesReducer';
import { chatsReducer } from './chatsReducer';

const rootReducer = combineReducers({
    ui: uiReducer,
    files: filesReducer,
    chats: chatsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
