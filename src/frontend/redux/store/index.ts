import { configureStore } from "@reduxjs/toolkit";
import { uiReducer } from "../reducers/uiReducer";
import { filesReducer } from "../reducers/filesReducer";
import { chatsReducer } from "../reducers/chatsReducer";
import { notificationReducer } from "../reducers/notificationReducer";
import { RootState } from "../../tests/React/testsWrapper";

// const store = configureStore({
//     reducer: {
//         uiState: uiReducer,
//         filesState: filesReducer,
//         chatsState: chatsReducer,
//         notificationState: notificationReducer,
//     },
//     middleware: getDefaultMiddleware =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         }),
// });
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      uiState: uiReducer,
      filesState: filesReducer,
      chatsState: chatsReducer,
      notificationState: notificationReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}
const store = setupStore();

export default store;
