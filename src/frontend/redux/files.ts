import {normalize_files_contents} from "../data_processing/normalize/normalize_contents";
import {agent} from "../backend_connect/main";
import {AuthClient} from "@dfinity/auth-client";
import {FriendsActions} from "./friends";
import {
    FileIndexing,
    FileNode,
    Friend,
    InitialData,
    SharesContract,
    StoredContract,
    UserProfile,
    WorkSpace
} from "../../declarations/backend/backend.did";
import {actor} from "../App";
import {normalize_contracts} from "../data_processing/normalize/normalize_contracts";
import {getCurrentFile} from "./utls";
import {Principal} from "@dfinity/principal";
import {logger} from "../dev_utils/log_data";

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
    | "UPDATE_NOT_LIST"
    | "DELETE_NOTIFY"
    | "UPDATE_NOTE"
    | "CONFIRM_FRIEND"
    | "TOP_DIALOG"
    | "ADD_WORKSPACE"
    | FriendsActions;


export var initialState = {

    current_file: null,
    is_files_saved: true,
    files: [],
    files_content: {},
    friends: [],
    changes: {files: [], contents: {}, contracts: {}, delete_contracts: [], files_indexing: []},
    notifications: [],
    profile_history: null,
    top_dialog: {open: false, content: null, title: null},
    workspaces: [],
};


export async function get_initial_data() {

    let isLoggedIn = await agent.is_logged() // TODO avoid repetition `isLoggedIn` is already used in ui.ts
    let data: undefined | { Ok: InitialData } | { Err: string } = actor && await actor.get_initial_data();

    initialState["Anonymous"] = data.Err == "Anonymous user." && isLoggedIn;
    initialState["isLoggedIn"] = data.Err != "Anonymous user." && isLoggedIn

    data = actor && await actor.get_initial_data();


    const authClient = await AuthClient.create();
    const userPrincipal = authClient.getIdentity().getPrincipal().toString();
    if ("Ok" in data) {
        let profile_history: any | { Ok: UserProfile } | { Err: string } = actor && await actor.get_user_profile(Principal.fromText(data.Ok.Profile.id));
        let workspaces: undefined | Array<WorkSpace> = actor && await actor.get_work_spaces();

        initialState["files"] = data.Ok.Files;
        initialState["denormalized_files_content"] = data.Ok.FilesContents; //[] | [Array<[string, Array<[string, ContentNode]>]>]
        initialState["files_content"] = normalize_files_contents(data.Ok.FilesContents[0]);
        initialState["contracts"] = normalize_contracts(data.Ok.Contracts);
        initialState["current_file"] = getCurrentFile(initialState["files"]);
        initialState['profile_history'] = profile_history.Ok && profile_history.Ok;
        initialState['workspaces'] = workspaces || [];


        initialState["profile"] = data.Ok.Profile;
        initialState["users"] = data.Ok.DiscoverUsers;
        initialState["id"] = userPrincipal;
        initialState["friends"] = data.Ok.Friends;
        initialState["all_friends"] = data.Ok.Friends.map((f: Friend) => {
            return f.sender.id != data.Ok.Profile.id ? f.sender : f.receiver
        });
        initialState["wallet"] = data.Ok.Wallet;
        let notifications: undefined | Array<Notification> = actor && await actor.get_user_notifications();
        initialState["notifications"] = notifications

    }
}


export function filesReducer(state: any = initialState, action: any) {
    let friends = {...state.friends};
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
            state.changes.files = [...state.changes.files, action.new_file]
            state.files = [...state.files, action.new_file]
            return {
                ...state,
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

        case 'UPDATE_NOT_LIST':
            return {
                ...state,
                notifications: action.new_list,
            }

        case 'UPDATE_NOTE':
            return {
                ...state,
                notifications: state.notifications.map((n: Notification) => {
                    if (n.id == action.id) {
                        return {...n, ...action}
                    }
                    return n
                })
            }


        case 'DELETE_NOTIFY':
            return {
                ...state,
                notifications: state.notifications.filter((n) => n.id !== action.id)
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

            const index = action.index;
            const childIndex = state.files.findIndex(file => file.id === action.id);
            const parentIndex = state.files.findIndex(file => file.id === action.parent[0]);
            const child: FileNode = state.files[childIndex];
            const parent: FileNode | undefined = state.files[parentIndex];
            const oldParentIndex = state.files.findIndex(file => file.id === child.parent[0]);
            const oldParent = state.files[oldParentIndex]

            if (action.position == "middle" && index !== 0) {
                state.files = state.files.map((file: FileNode, index: number) => {
                    if (index == parentIndex) {
                        file.children = [...file.children, child.id]
                        state.changes.files.push(file)
                    }
                    if (index == childIndex) {
                        file.parent = parent ? [parent.id] : []
                        state.changes.files.push(file)
                    }
                    return file
                });
            } else {
                if (state.files[oldParentIndex]) {
                    state.files[oldParentIndex].children = oldParent.children.filter(id => id !== action.id)
                    state.files[childIndex].parent = []
                    // state.changes.files.push(oldParent)
                }

                const newArray = [...state.files];
                const [removed] = newArray.splice(childIndex, 1);
                newArray.splice(index, 0, removed);
                state.files = newArray;

                let files_indexing: FileIndexing = {
                    id: child.id,
                    parent: action.parent[0] ? [String(action.parent[0])] : [],
                    new_index: BigInt(index)
                }
                state.changes.files_indexing.push(files_indexing)
            }


            return {
                ...state,
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
            state.changes.delete_contracts.push(action.id)
            return {
                ...state,
            }

        case 'FILES_SAVED':
            state.files_content[action.id] = action.content;
            return {
                ...state,
                is_files_saved: true
            }
        case "TOP_DIALOG":
            return {
                ...state,
                top_dialog: action
            }

        // case 'FILES_CHANGED':
        //     return {
        //         ...state,
        //         is_files_saved: false
        //     }
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
            // for each contract check promises if .status === {Released:null} remove it from cusom_contract.promises and appened it to cusom_contract.payments
            let contracts: Array<StoredContract> = Object.values(state.changes.contracts);
            // state.contracts =

            contracts = contracts.map((contract: StoredContract) => {
                if (contract.CustomContract) {
                    let promises = contract.CustomContract.promises;
                    let payments = contract.CustomContract.payments;
                    promises = promises.filter((promise: any) => {

                        if (Object.keys(promise.status)[0] === 'Released') {
                            console.log({promise})
                            payments.push(promise);
                            return false
                        }
                        return true
                    })
                    contract.CustomContract.promises = promises;
                    contract.CustomContract.payments = payments;
                }
                return contract
            });
            let converted_contracts: Array<[string, StoredContract]> = contracts.map((c) => {
                let id;
                if ('SharesContract' in c) {
                    id = c.SharesContract.contract_id;
                } else if ('CustomContract' in c) {
                    id = c.CustomContract.id;
                } else {
                    // handle the case when none of the types match
                    // you might want to provide a default value or throw an error
                }
                return [id, c]
            });
            return {
                ...state,
                changes: {files: {}, contents: {}, contracts: {}},
                contracts: normalize_contracts(converted_contracts)
            }

        case 'UPDATE_FRIEND':
            friends = state.friends.map((f: Friend) => {
                if (f.receiver.id == action.receiver) {
                    f.confirmed = true
                }
                return f
            });
            return {...state, friends}


        case 'ADD_FRIEND':
            state.friends.push(action.friend);
            return {
                ...state,
            };

        case 'CONFIRM_FRIEND':
            friends = state.friends.map((f: Friend) => {
                if (f.sender.id == action.friend.sender.id && f.receiver.id == action.friend.receiver.id) {
                    f.confirmed = true;
                }
                return f;
            })
            return {
                ...state,
                friends
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
            friends = state.friends.filter((f) => {
                let sender = f.sender.id;
                let receiver = f.receiver.id
                // TODO REMOVE THIS UNESSERY CHECKING
                if (typeof sender != 'string') {
                    sender = sender.toText();
                }
                if (typeof receiver != 'string') {
                    receiver = receiver.toText();
                }
                return sender !== action.id && receiver !== action.id
            });
            return {
                ...state,
                friends: friends,
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


        case 'ADD_WORKSPACE':
            state.workspaces = [...state.workspaces, action.new_workspace]
            return {
                ...state,
            };

        default:
            return state;
    }
}
