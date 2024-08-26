import { configureStore } from "@reduxjs/toolkit";
import { uiReducer } from "../reducers/uiReducer";
import { filesReducer } from "../reducers/filesReducer";
import { chatsReducer } from "../reducers/chatsReducer";
import { notificationReducer } from "../reducers/notificationReducer";

const store = configureStore({
  reducer: {
    uiState: uiReducer,
    filesState: filesReducer,
    chatsState: chatsReducer,
    notificationState: notificationReducer,
  },
});

export default store;
