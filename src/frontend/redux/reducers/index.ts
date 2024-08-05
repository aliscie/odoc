// reducers/index.ts
import { combineReducers } from 'redux';

import { uiReducer } from './uiReducer';
import { filesReducer } from './filesReducer';
import { chatsReducer } from './chatsReducer';
// Import other reducers here

const rootReducer = combineReducers({
    ui: uiReducer,
    files: filesReducer,
    chats: chatsReducer,
    // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
