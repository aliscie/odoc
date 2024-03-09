import {normalize_files_contents} from "../data_processing/normalize/normalize_contents";
import {agent} from "../backend_connect/main";
import {normalize_files} from "../data_processing/normalize/normalize_files";
import {AuthClient} from "@dfinity/auth-client";
import {FriendsActions} from "./friends";
import {
    FileNode,
    InitialData,
    Notification,
    StoredContract,
    User
} from "../../declarations/user_canister/user_canister.did";
import {actor} from "../App";
import {normalize_contracts} from "../data_processing/normalize/normalize_contracts";

// import {logout} from "../backend_connect/ic_agent";
// await logout();
// localStorage.clear()

export type FilesActions =
    "ADD_FILE"
    | "REMOVE"
    | "UPDATE"
    | "GET"
    | "GET_ALL"
    | "CURRENT_FILE"
    | "UPDATE_CONTENT"
    | "FILES_SAVED"
    | "ADD_CONTENT"
    | "UPDATE_FILE_TITLE"
    | "ADD_CONTRACT"
    | "UPDATE_CONTRACT"
    | "FILE_CHANGES"
    | "CONTENT_CHANGES"
    | "CONTRACT_CHANGES"
    | "RESOLVE_CHANGES"
    | "CURRENT_USER_HISTORY"
    | "REMOVE_CONTRACT"
    | "UPDATE_BALANCE"
    | "UPDATE_PROFILE"
    | "CHANGE_FILE_PARENT"
    | "NOTIFY"
    | "UPDATE_FRIEND"
    | "UPDATE_NOTIFY"
    | FriendsActions;


export var initialState = {

    current_file: {id: null, name: null},
    is_files_saved: true,
    files: {},
    files_content: {},
    friends: [{friends: [], friend_requests: []}],
    changes: {files: {}, contents: {}, contracts: {}, delete_contracts: []},
    notifications: [],
    profile_history: null,
};


function getCurrentFile(data: any) {
    let file = {id: null, name: null};
    let dummy_file: FileNode | String = {id: "", name: "", share_id: [], children: [], parent: []}
    dummy_file = JSON.stringify(dummy_file);

    let stored_file = JSON.parse(localStorage.getItem("current_file") || dummy_file)
    if (data[stored_file.id]) {
        file = stored_file;
    }
    return file;
}


export async function get_initial_data() {
    let isLoggedIn = await agent.is_logged() // TODO avoid repetition `isLoggedIn` is already used in ui.ts
    let data: undefined | { Ok: InitialData } | { Err: string } = actor && await actor.get_initial_data();

    initialState["Anonymous"] = data.Err == "Anonymous user." && isLoggedIn;
    initialState["isLoggedIn"] = data.Err != "Anonymous user." && isLoggedIn

    data = actor && await actor.get_initial_data();

    const authClient = await AuthClient.create();
    const userPrincipal = authClient.getIdentity().getPrincipal().toString();
    let all_friends = []

    if ("Ok" in data && data.Ok.Friends) {
        let friend_requests = data.Ok.Friends[0] && data.Ok.Friends[0].friend_requests || []
        let confirmed_friends = data.Ok.Friends[0] && data.Ok.Friends[0].friends || []
        all_friends = [...friend_requests.map((i: User) => i), ...confirmed_friends.map((i: any) => i)]
    }

    const uniqueUsersSet = new Set<string>();


    if ("Ok" in data) {
        all_friends.forEach((item) => {
            item.receiver.id !== data.Ok.Profile.id && uniqueUsersSet.add(item.receiver);
            item.sender.id !== data.Ok.Profile.id && uniqueUsersSet.add(item.sender);
        });
        initialState["files"] = normalize_files(data.Ok.Files);
        initialState["denormalized_files_content"] = data.Ok.FilesContents; //[] | [Array<[string, Array<[string, ContentNode]>]>]
        initialState["files_content"] = normalize_files_contents(data.Ok.FilesContents[0]);
        initialState["contracts"] = normalize_contracts(data.Ok.Contracts);
        initialState["current_file"] = getCurrentFile(initialState["files"]);

        initialState["profile"] = data.Ok.Profile;
        initialState["users"] = data.Ok.DiscoverUsers;
        initialState["id"] = userPrincipal;
        initialState["friends"] = data.Ok.Friends;
        initialState["all_friends"] = Array.from(uniqueUsersSet);
        initialState["wallet"] = data.Ok.Wallet;

    }
}


export function filesReducer(state: any = initialState, action: any) {
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

        case 'ADD_FILE':
            return {
                ...state,
                files: {...state.files, [action.data.id]: action.data},
            };
        case 'UPDATE':
            return {
                ...state,
                files: {...state.files, [action.id]: action.file},
            }
        case 'NOTIFY':
            return {
                ...state,
                notifications: [...state.notifications, action.new_notification],
            }
        case 'UPDATE_NOTIFY':
            return {
                ...state,
                notifications: action.new_list,
            }
        case 'REMOVE':
            let file_id = action.id;
            let files = {...state.files};
            delete state.files_content[file_id];
            delete files[file_id];
            return {
                ...state,
                files: files,
            }
        case 'CURRENT_FILE':
            localStorage.setItem("current_file", JSON.stringify({...action.file}));
            return {
                ...state,
                current_file: action.file,
            }

        case 'CHANGE_FILE_PARENT':
            state.files[action.id] = {...state.files[action.id], parent: action.parent}
            state.changes.files[action.id] = {...state.files[action.id], parent: [action.parent]};

            if (!state.files[action.parent].children.includes(action.id)) {
                state.files[action.parent].children.push(action.id)
                state.changes.files[action.parent] = state.files[action.parent];
            }


            return {
                ...state,
            }

        case 'UPDATE_CONTENT':
            state.files_content[action.id] = action.content;
            return {
                ...state,
            }
        case 'ADD_CONTRACT':
            if (action.contract.contract_id) {
                state.contracts[action.contract.contract_id] = action.contract;
            } else {
                state.contracts[action.contract.id] = action.contract;
            }

            return {
                ...state,
            }

        case 'UPDATE_CONTRACT':

            if (action.contract.CustomContract) {
                state.contracts[action.contract.CustomContract.id].CustomContract = action.contract;
                state.contracts[action.contract.CustomContract.id].contracts = action.contract.CustomContract.contracts;
            } else {
                state.contracts[action.contract.contract_id] = {...state.contracts[action.contract.contract_id], ...action.contract}
            }


            return {
                ...state,
            }
        case 'REMOVE_CONTRACT':
            delete state.contracts[action.id]
            delete state.changes.delete_contracts.push(action.id)
            return {
                ...state,
            }

        case 'FILES_SAVED':
            state.files_content[action.id] = action.content;
            return {
                ...state,
                is_files_saved: true
            }
        // case 'FILES_CHANGED':
        //     return {
        //         ...state,
        //         is_files_saved: false
        //     }
        case 'FILE_CHANGES':
            state.changes.files[action.changes.id] = action.changes;
            return {
                ...state,
            }
        // case 'DELETE_CONTRACT':
        //     state.changes.delete_contracts.push(action.id);
        //     return {
        //         ...state,
        //     }

        case 'CONTENT_CHANGES':
            state.changes.contents[action.id] = action.changes;
            return {
                ...state,
            }

        case 'CONTRACT_CHANGES':


            let changes: StoredContract = action.changes;
            let id;
            // console.log({xxx: changes.SharesContract})
            if ('SharesContract' in changes) {
                id = changes.SharesContract.contract_id;
            } else if ('CustomContract' in changes) {
                id = changes.CustomContract.id;
            } else {
                // handle the case when none of the types match
                // you might want to provide a default value or throw an error
            }
            state.changes.contracts[id] = action.changes;

            return {
                ...state,
            }
        case 'RESOLVE_CHANGES':
            state.changes = {files: {}, contents: {}, contracts: {}}
            return {
                ...state,
            }

        case 'UPDATE_FRIEND':
            return {
                ...state,
                friends: [action.friends],
            };

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


        case 'UPDATE_BALANCE':
            state.wallet.balance = action.balance;
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

        case 'UPDATE_PROFILE':
            state.profile = {...state.profile, ...action.profile}
            return {
                ...state,
            };

        case 'CURRENT_USER_HISTORY':
            state.profile_history = action.profile_history
            return {
                ...state,
            };

        default:
            return state;
    }
}
