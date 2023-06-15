import {backend} from "../backend_connect/main";

export type FilesActions = "ADD" | "REMOVE" | "UPDATE" | "GET" | "GET_ALL";
const initialState = {
    files: (await backend.get_files())[0].reduce((acc, file) => (acc[file[1].id] = file[1], acc), {}),

};


export function filesReducer(state = initialState, action: any) {
    switch (action.type) {
        case 'ADD':
            return {
                ...state,
                files: {...state.files, [action.data.id]: action.data},
            };
        case 'REMOVE':
            let file_id = action.id;
            let files = {...state.files};
            delete files[file_id];
            return {
                ...state,
                files: files,
            }
        default:
            return state;
    }
}
