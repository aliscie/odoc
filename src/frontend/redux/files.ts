import {backend} from "../backend_connect/main";
import {convertDataStructure} from "../data_processing/file_content_processing";

export type FilesActions =
    "ADD"
    | "REMOVE"
    | "UPDATE"
    | "GET"
    | "GET_ALL"
    | "UPDATE"
    | "CURRENT_FILE"
    | "UPDATE_CONTENT"
    | "FILES_SAVED"
    | "FILES_CHANGED";

const initialState = {
    files: await get_files(),
    files_content: await getFilesContents(),
    current_file: {id: null, name: null},
    is_files_saved: true,
};


async function getFilesContents() {
    let data = {};
    let files = await backend.get_all_files_content()
    files.map((file) => {
        let content = {};

        file[1].map((item) => {
            let x = {id: item[0], value: item[1]};
            content[item[0]] = x;
        })
        data[file[0]] = content;
    });
    for (let [key, value] of Object.entries(data)) {
        data[key] = convertDataStructure(value);
    }

    return data
}


async function get_files() {
    let files = await backend.get_files();
    if (files.length == 0) {
        return {}
    }
    ;
    return files[0].reduce((acc, file) => (acc[file[1].id] = file[1], acc), {})
}


export function filesReducer(state = initialState, action: { type: FilesActions, id?: any, file?: any, name: any, content?: any }) {
    switch (action.type) {
        case 'ADD':
            return {
                ...state,
                files: {...state.files, [action.data.id]: action.data},
            };
        case 'UPDATE':
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
        case 'CURRENT_FILE':
            return {
                ...state,
                current_file: {id: action.id, name: action.name},
            }
        case 'UPDATE_CONTENT':
            state.files_content[action.id] = action.content;
            return {
                ...state,
            }
        case 'FILES_SAVED':
            state.files_content[action.id] = action.content;
            return {
                ...state,
                is_files_saved: true
            }
        case 'FILES_CHANGED':
            return {
                ...state,
                is_files_saved: false
            }
        default:
            return state;
    }
}
