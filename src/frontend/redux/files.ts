import {normalize_files_contents} from "../data_processing/normalize/normalize_contents";
import {agent, backend} from "../backend_connect/main";
import {normalize_files} from "../data_processing/normalize/normalize_files";
import {AuthClient} from "@dfinity/auth-client";
import {FriendsActions} from "./friends";
import {normalize_contracts} from "../data_processing/normalize/normalize_contracts";

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
    | "FILES_CHANGED"
    | "ADD_CONTENT"
    | "UPDATE_FILE_TITLE"
    | "ADD_CONTRACT"
    | "UPDATE_CONTRACT"
    | FriendsActions;

export var initialState = {
    current_file: {id: null, name: null},
    is_files_saved: true,
    files: {},
    files_content: {},
    friends: [{friends: [], friend_requests: []}],
};


async function get_initial_data() {
    let isLoggedIn = await agent.is_logged() // TODO avoid repetition `isLoggedIn` is already used in ui.ts
    let data = await backend.get_initial_data();
    if (data.Err == "Anonymous user." && isLoggedIn) {
        initialState["Anonymous"] = true;
        return false;
    }
    data = await backend.get_initial_data();

    const authClient = await AuthClient.create();
    const userPrincipal = authClient.getIdentity().getPrincipal().toString();
    let all_friends = []
    if (data.Ok && data.Ok.Friends) {
        let friend_requests = data.Ok.Friends[0] && data.Ok.Friends[0].friend_requests || []
        let confirmed_friends = data.Ok.Friends[0] && data.Ok.Friends[0].friends || []
        all_friends = [...friend_requests.map((i: any) => i), ...confirmed_friends.map((i: any) => i)]
    }

    if (data.Ok) {
        initialState["files"] = normalize_files(data.Ok.Files);
        initialState["files_content"] = normalize_files_contents(data.Ok.FilesContents);
        initialState["contracts"] = normalize_contracts(data.Ok.Contracts);
        initialState["profile"] = data.Ok.Profile;
        initialState["users"] = data.Ok.DiscoverUsers;
        initialState["id"] = userPrincipal;
        initialState["friends"] = data.Ok.Friends;
        initialState["all_friends"] = all_friends;

    }
}


await get_initial_data()


export function filesReducer(state = initialState, action: { data: any, type: FilesActions, id?: any, file?: any, name: any, content?: any }) {
    let friends = {...state.friends[0]};
    let friend_id = action.id;

    switch (action.type) {
        case 'ADD_CONTENT':
            let files_content = state.files_content
            files_content[action.id] = action.content;
            return {
                ...state,
                files_content: files_content,
            };

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
        case 'ADD_CONTRACT':
            state.contracts[action.id] = action.contract;
            return {
                ...state,
            }

        case 'UPDATE_CONTRACT':
            state.contracts[action.id] = action.contract;
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
        case 'ADD_FRIEND':
            friends.friends.push(action.friend);
            return {
                ...state,
                friends: [friends],
            };

        case 'UPDATE_FILE_TITLE':
            state.files[action.id].name = action.title;
            return {
                ...state,
            }


        case 'REMOVE_FRIEND':
            friends.friends = friends.friends.filter((friend) => friend.id !== friend_id);
            friends.friends = friends.friends.length > 0 ? friends.friends : [];
            return {
                ...state,
                friends: [friends],
            };


        case 'ADD_FRIEND_REQUEST':
            friends.friend_requests.push(action.friend);
            return {
                ...state,
                friends: [friends],
            };

        case 'REMOVE_FRIEND_REQUEST':
            friends.friend_requests = friends.friend_requests.filter((request) => request.id !== friend_id);
            friends.friend_requests = friends.friend_requests.length > 0 ? friends.friend_requests : [];
            return {
                ...state,
                friends: [friends],
            };


        default:
            return state;
    }
}
