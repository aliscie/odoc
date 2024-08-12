import { FilesActions, InitialState, initialState } from '../types/filesTypes';

export function filesReducer(state: InitialState = initialState, action: FilesActions): InitialState {
    // let friends = { ...state.friends };
    // let friend_id = action.id;

    switch (action.type) {
        case 'ADD_CONTENT':
            return {
                ...state,
                files_content: { ...state.files_content, [action.id]: action.content }
            };

        case 'ADD_FILE':
            return {
                ...state,
                files: [...state.files, action.new_file],
                changes: { ...state.changes, files: [...state.changes.files, action.new_file] }
            };

        case 'UPDATE':
            return {
                ...state,
                files: state.files.map(file => file.id === action.id ? { ...file, ...action.file } : file)
            };

        case 'NOTIFY':
            let is_in = false;
            const updatedNotifications = state.notifications.map((n) => {
                if (n.id === action.new_notification.id) {
                    is_in = true;
                    return action.new_notification;
                }
                return n;
            });
            return {
                ...state,
                notifications: is_in ? updatedNotifications : [...state.notifications, action.new_notification]
            };

        case 'UPDATE_NOT_LIST':
            return {
                ...state,
                notifications: action.new_list
            };

        case 'UPDATE_NOTE':
            return {
                ...state,
                notifications: state.notifications.map(n => n.id === action.id ? { ...n, ...action } : n)
            };

        case 'DELETE_NOTIFY':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.id)
            };

        case 'REMOVE':
            return {
                ...state,
                files: state.files.filter(file => file.id !== action.id)
            };

        case 'CURRENT_FILE':
            localStorage.setItem("current_file", JSON.stringify({ ...action.file }));
            return {
                ...state,
                current_file: action.file
            };

        case 'CHANGE_FILE_PARENT': {
            const { position, id, parent, index } = action;
            let file = state.files.find(f => f.id === id)!;

            state.files = state.files.filter(f => f.id !== id);

            const oldParentIndex = state.files.findIndex(f => f.id === file.parent[0]);
            if (oldParentIndex !== -1) {
                state.files[oldParentIndex].children = state.files[oldParentIndex].children.filter(childId => childId !== id);
            }

            const newParentIndex = state.files.findIndex(f => f.id === parent[0]);
            file.parent = parent;

            if (newParentIndex !== -1) {
                if (index !== -1) {
                    state.files[newParentIndex].children.splice(index, 0, id);
                } else {
                    state.files[newParentIndex].children.push(id);
                }
            }

            if (index !== -1) {
                state.files = [...state.files.slice(0, index), file, ...state.files.slice(index)];
            } else {
                state.files.push(file);
            }

            let change: FileIndexing = {
                id,
                new_index: BigInt(index),
                parent
            };

            state.changes.files_indexing.push(change);
            state.changes.files.push(file);
            return { ...state };
        }

        case 'UPDATE_CONTENT':
            return {
                ...state,
                files: state.files.map(file => file.id === action.id ? { ...file, content: action.content } : file)
            };

        case 'ADD_CONTRACT':
            return {
                ...state,
                contracts: {
                    ...state.contracts,
                    [action.contract.contract_id || action.contract.id]: action.contract
                }
            };

        case 'UPDATE_CONTRACT':
            return {
                ...state,
                contracts: {
                    ...state.contracts,
                    [action.contract.contract_id || action.contract.id]: action.contract
                }
            };

        case 'CONTRACT_CHANGES':
            state.changes.contracts[action.changes.contract_id || action.changes.id] = action.changes;
            return { ...state };

        case 'UPDATE_FILE_TITLE':
            return {
                ...state,
                files: state.files.map(file => file.id === action.id ? { ...file, title: action.title } : file)
            };

        case 'UPDATE_BALANCE':
            return {
                ...state,
                wallet: { ...state.wallet, balance: action.balance }
            };

        case 'FILES_SAVED':
            return {
                ...state,
                is_files_saved: action.content,
                changes: { ...state.changes, files: [] }
            };

        case 'UPDATE_PROFILE':
            return {
                ...state,
                profile: { ...state.profile, ...action.profile }
            };

        case 'UPDATE_FRIEND':
            return {
                ...state,
                friends: state.friends.map(friend => friend.id === action.id ? { ...friend, ...action } : friend)
            };

        case 'CURRENT_USER_HISTORY':
            return {
                ...state,
                profile_history: action.profile_history
            };

        
        case 'REMOVE_CONTRACT':
            delete state.contracts[action.id]
            state.changes.delete_contracts.push(action.id)
            return {
                ...state,
            };
        
        case 'UPDATE_ANONYMOUS':
            return {
                ...state,
                anonymous: action.anonymous,
            };

        default:
        return state;
    }
}
