import { configureStore } from '@reduxjs/toolkit';
import { uiReducer } from '../reducers/uiReducer';
import { filesReducer } from '../reducers/filesReducer';
import { chatsReducer } from '../reducers/chatsReducer';


const store = configureStore({
    reducer: {
        uiState: uiReducer,
        filesState: filesReducer,
        chatsState: chatsReducer,
    },
});

export default store;
