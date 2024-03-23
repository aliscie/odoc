import {normalize_files_contents} from "../data_processing/normalize/normalize_contents";
import {agent} from "../backend_connect/main";
import {normalize_files} from "../data_processing/normalize/normalize_files";
import {AuthClient} from "@dfinity/auth-client";
import {FriendsActions} from "./friends";
import {FileNode, InitialData, StoredContract, User} from "../../declarations/user_canister/user_canister.did";
import {actor} from "../App";
import {normalize_contracts} from "../data_processing/normalize/normalize_contracts";
import {getCurrentFile} from "./utls";

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

    current_file: null,
    is_files_saved: true,
    files: [],
    files_content: {},
    friends: [{friends: [], friend_requests: []}],
    // TODO remove friends and make it like this.
    //     friends: [],
    //     friend_requests: [],
    changes: {files: {}, contents: {}, contracts: {}, delete_contracts: []},
    notifications: [],
    profile_history: null,
};


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
        initialState["files"] = data.Ok.Files;
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
                files: [...state.files, action.data],
            };

        case 'UPDATE':
            return {
                ...state,
                files: state.files.map(file =>
                    file.id === action.id ? {...file, ...action.file} : file
                ),
            };

        case 'NOTIFY':
            let is_in = false;
            state.notifications = state.notifications.map((n) => {
                if (n.id == action.new_notification.id) {
                    is_in = true
                    return action.new_notification
                }
                return n
            })
            if (!is_in) {
                return {
                    ...state,
                    notifications: [...state.notifications, action.new_notification],
                }
            } else {
                return {...state}
            }

        case 'UPDATE_NOTIFY':
            return {
                ...state,
                notifications: action.new_list,
            }
        case 'REMOVE':
            return {
                ...state,
                files: state.files.filter(file => file.id !== action.id),
            };

        case 'CURRENT_FILE':
            localStorage.setItem("current_file", JSON.stringify({...action.file}));
            return {
                ...state,
                current_file: action.file,
            }

        case 'CHANGE_FILE_PARENT': {
            const fileIndex = state.files.findIndex(file => file.id === action.id);
            if (fileIndex === -1) return state; // File not found, early return

            // Assuming the existence of the parent is already validated or is null (root level)
            const updatedFile = {...state.files[fileIndex], parent: action.parent};
            state.files[fileIndex] = updatedFile;

            // Tracking the change
            state.changes.files[action.id] = {...state.changes.files[action.id], parent: action.parent};

            // Adjust parents' children list
            // Remove from old parent
            if (updatedFile.parent) {
                const oldParentIndex = state.files.findIndex(file => file.children.includes(action.id));
                if (oldParentIndex !== -1) {
                    state.files[oldParentIndex].children = state.files[oldParentIndex].children.filter(childId => childId !== action.id);
                    // Track this change too if necessary
                    // Note: Depending on your logic, you might or might not want to track changes to the children list directly
                }
            }

            // Add to new parent
            if (action.parent) {
                const newParentIndex = state.files.findIndex(file => file.id === action.parent);
                if (newParentIndex !== -1 && !state.files[newParentIndex].children.includes(action.id)) {
                    state.files[newParentIndex].children = [...state.files[newParentIndex].children, action.id];
                    // Similarly, decide if you need to track changes to the new parent's children list
                }
            }

            return {
                ...state,
                files: [...state.files], // Ensure we're triggering a state update
                changes: {
                    ...state.changes,
                    files: {...state.changes.files}, // Ensure changes are captured
                },
            };
        }


        case 'UPDATE_CONTENT':
            // Assuming action.id is the file ID and action.content is the new content
            return {
                ...state,
                files: state.files.map(file =>
                    file.id === action.id ? {...file, content: action.content} : file
                ),
            };


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
                state.contracts[action.contract.CustomContract.id].promises = action.contract.CustomContract.promises;
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
            if (action.friends) {
                return {
                    ...state,
                    friends: [action.friends],
                };
            } else if (action.friend_request) {
                return {
                    ...state,
                    friends: [{
                        friends: [...friends.friends],
                        friend_requests: [...friends.friend_requests, action.friend_request]
                    }],
                }
            }
            return {...state}


        case 'ADD_FRIEND':
            friends.friends.push(action.friend);
            return {
                ...state,
                friends: [friends],
            };

        case 'UPDATE_FILE_TITLE':
            state.files = state.files.map((file: FileNode) => {
                if (file.id == action.id) {
                    file.name = action.title
                }
                return file
            })
            // state.files[action.id].name = action.title;
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
