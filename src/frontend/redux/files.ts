import {backend} from "../backend_connect/main";

export type FilesActions = "ADD" | "REMOVE" | "UPDATE" | "GET" | "GET_ALL" | "UPDATE";

async function get_files() {
    let files = await backend.get_files();
    console.log();
    if (files.length == 0) {
        return {}
    }
    ;
    return files[0].reduce((acc, file) => (acc[file[1].id] = file[1], acc), {})
}

const initialState = {
    files: await get_files(),

};


export function filesReducer(state = initialState, action: any) {
    switch (action.type) {
        case 'ADD':
            return {
                ...state,
                files: {...state.files, [action.data.id]: action.data},
            };
        case 'UPDATE':
            console.log("before", action)
            return {
                ...state,
                files: {...state.files, [action.id]: action.file},
            }
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
