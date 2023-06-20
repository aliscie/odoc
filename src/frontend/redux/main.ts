import {combineReducers, createStore} from "redux";
import {MainActions, uiReducer} from "./uil";
import {FilesActions, filesReducer} from "./files";

type ReduxTypes = MainActions | FilesActions;
export const handleRedux = (type: ReduxTypes, data?: any) => ({
    type,
    ...data
});

// const store = createStore(uiReducer);
// const filesStore = createStore(filesReducer);

const store = createStore(combineReducers({
    uiReducer,
    filesReducer
}));

export default store;