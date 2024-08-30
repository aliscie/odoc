import {FilesActions, InitialState, initialState} from "../types/filesTypes";
import {
    FileIndexing,
    FileNode,
    StoredContract,
} from "../../../declarations/backend/backend.did";
import {deserializeContents} from "../../DataProcessing/deserlize/deserializeContents";
import {deserializeContracts} from "../../DataProcessing/deserlize/deserializeContracts";

export function filesReducer(
    state: InitialState = initialState,
    action: FilesActions,
): InitialState {
    function changeFile(newFile: FileNode) {
        if (state.changes.files.find((file) => file.id === newFile.id)) {
            state.changes.files = state.changes.files.map((file) =>
                file.id === file.id ? newFile : file,
            );
        } else {
            state.changes.files.push(newFile);
        }
        return {...state};
    }

    switch (action.type) {
        case "INIT_FILES_STATE":
            return {
                ...state,
                files: action.data.Files,
                wallet: action.data.Wallet,
                files_content: deserializeContents(action.data.FilesContents[0]),
                contracts: deserializeContracts(action.data.Contracts),
                profile: action.data.Profile,
                friends: action.data.Friends,
                inited: true
                // friends: action.data.Friends.map(friend => friend.id === action.id ? {...friend, ...action} : friend)
            };

        case "ADD_CONTENT":
            return {
                ...state,
                files_content: {...state.files_content, [action.id]: action.content},
            };

        // case 'INIT_CONTENTS':
        //     return {
        //         ...state,
        //         files_content: action.files_content
        //     };

        case "ADD_FILE":
            return {
                ...state,
                files: [...state.files, action.new_file],
                changes: {
                    ...state.changes,
                    files: [...state.changes.files, action.new_file],
                },
            };

        case "UPDATE":
            return {
                ...state,
                files: state.files.map((file) =>
                    file.id === action.id ? {...file, ...action.file} : file,
                ),
            };

        case "REMOVE":
            return {
                ...state,
                files: state.files.filter((file) => file.id !== action.id),
            };

        case "CURRENT_FILE":
            localStorage.setItem("current_file", JSON.stringify({...action.file}));
            return {
                ...state,
                current_file: action.file,
            };

        case "CHANGE_FILE_PARENT": {
            const {position, id, parent, index} = action;
            let file = state.files.find((f) => f.id === id)!;

            state.files = state.files.filter((f) => f.id !== id);

            const oldParentIndex = state.files.findIndex(
                (f) => f.id === file.parent[0],
            );
            if (oldParentIndex !== -1) {
                state.files[oldParentIndex].children = state.files[
                    oldParentIndex
                    ].children.filter((childId) => childId !== id);
            }

            const newParentIndex = state.files.findIndex((f) => f.id === parent[0]);
            file.parent = parent;

            if (newParentIndex !== -1) {
                if (index !== -1) {
                    state.files[newParentIndex].children.splice(index, 0, id);
                } else {
                    state.files[newParentIndex].children.push(id);
                }
            }

            if (index !== -1) {
                state.files = [
                    ...state.files.slice(0, index),
                    file,
                    ...state.files.slice(index),
                ];
            } else {
                state.files.push(file);
            }

            let change: FileIndexing = {
                id,
                new_index: BigInt(index),
                parent,
            };

            state.changes.files_indexing.push(change);
            state.changes.files.push(file);
            return {...state};
        }
        // case 'INIT_CONTRACTS':
        //     return {
        //         ...state,
        //         contracts: action.contracts
        //     }
        case "UPDATE_CONTENT":
            return {
                ...state,
                changes: {
                    ...state.changes,
                    contents: {...state.changes.contents, [action.id]: action.content},
                },
                files_content: {...state.files_content, [action.id]: action.content},
                files: state.files.map((file) =>
                    file.id === action.id ? {...file, content: action.content} : file,
                ),
            };

        case "ADD_CONTRACT": {
            const {contract} = action;
            const id = contract.id;
            let stored_custom: StoredContract = {CustomContract: action.contract};
            return {
                ...state,
                changes: {
                    ...state.changes,
                    contracts: {
                        ...state.changes.contracts,
                        [id]: {...stored_custom},
                    },
                },
                contracts: {
                    ...state.contracts,
                    [id]: contract,
                },
            };
        }

        // case "UPDATE_CONTRACT":
        //   return {
        //     ...state,
        //     changes: {
        //       ...state.changes,
        //       contracts: {
        //         ...state.changes.contracts,
        //         [action.contract.id]: {
        //           ...state.changes.contracts[action.contract.id],
        //           CustomContract: action.contract,
        //         },
        //       },
        //     },
        //     contracts: {
        //       ...state.contracts,
        //       [action.contract.id]: action.contract,
        //     },
        //   };

        case "UPDATE_CONTRACT":
            return {
                ...state,
                contracts: state.contracts.map((contract) =>
                    contract.id === action.contract.id
                        ? {...contract, name: action.contract.name}
                        : contract,
                ),
            };

        case "RESOLVE_CHANGES":
            state.changes = {
                files: [],
                contents: {},
                contracts: {},
                delete_contracts: [],
                files_indexing: [],
            };
            return {...state};

        // case 'CONTRACT_CHANGES':
        //
        //     state.changes.contracts[action.changes.contract_id || action.changes.id] = action.changes;
        //     return {...state};

        case "UPDATE_FILE_TITLE":
            let newFile = state.files.find((file) => file.id === action.id)!;
            newFile.name = action.title;
            state = changeFile(newFile);
            return <InitialState>{
                ...state,
                files: state.files.map((file) =>
                    file.id === action.id ? {...file, title: action.title} : file,
                ),
                current_file: {...state.current_file, title: action.title},
            };

        case "UPDATE_BALANCE":
            return {
                ...state,
                wallet: {...state.wallet, balance: action.balance},
            };

        case "UPDATE_PROFILE":
            return {
                ...state,
                profile: {...state.profile, ...action.profile},
            };
        // TODO firndRecuer
        case "UPDATE_FRIEND":
            return {
                ...state,
                friends: state.friends.map((friend) =>
                    friend.id === action.id ? {...friend, ...action} : friend,
                ),
            };

        // TODO profile reducer
        case "CURRENT_USER_HISTORY":
            return {
                ...state,
                profile_history: action.profile_history,
            };

        case "REMOVE_CONTRACT":
            delete state.contracts[action.id];
            state.changes.delete_contracts.push(action.id);
            return {
                ...state,
            };

        default:
            return state;
    }
}
