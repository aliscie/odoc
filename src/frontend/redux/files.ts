import { normalize_files_contents } from "../data_processing/normalize/normalize_contents";
import { agent } from "../backend_connect/main";
import { AuthClient } from "@dfinity/auth-client";
import { FriendsActions } from "./friends";
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
import { actor } from "../App";
import { normalize_contracts } from "../data_processing/normalize/normalize_contracts";
import { getCurrentFile } from "./utils";
import { Principal } from "@dfinity/principal";

export type FilesActions =
    | { type: "ADD_FILE"; new_file: FileNode }
    | { type: "REMOVE"; id: string }
    | { type: "UPDATE"; id: string; file: Partial<FileNode> }
    | { type: "GET" }
    | { type: "GET_ALL" }
    | { type: "CURRENT_FILE"; file: FileNode }
    | { type: "UPDATE_CONTENT"; id: string; content: any }
    | { type: "FILES_SAVED"; id: string; content: any }
    | { type: "ADD_CONTENT"; id: string; content: any }
    | { type: "UPDATE_FILE_TITLE"; id: string; title: string }
    | { type: "ADD_CONTRACT"; contract: StoredContract }
    | { type: "UPDATE_CONTRACT"; contract: StoredContract }
    | { type: "CONTENT_CHANGES"; id: string; changes: any }
    | { type: "CONTRACT_CHANGES"; changes: StoredContract }
    | { type: "RESOLVE_CHANGES" }
    | { type: "CURRENT_USER_HISTORY"; profile_history: UserProfile }
    | { type: "REMOVE_CONTRACT"; id: string }
    | { type: "UPDATE_BALANCE"; balance: number }
    | { type: "UPDATE_PROFILE"; profile: Partial<UserProfile> }
    | { type: "CHANGE_FILE_PARENT"; position: number; id: string; parent: string[]; index: number }
    | { type: "NOTIFY"; new_notification: Notification }
    | { type: "UPDATE_FRIEND"; id: string }
    | { type: "UPDATE_NOT_LIST"; new_list: Notification[] }
    | { type: "DELETE_NOTIFY"; id: string }
    | { type: "UPDATE_NOTE"; id: string }
    | { type: "CONFIRM_FRIEND"; friend: Friend }
    | { type: "TOP_DIALOG"; open: boolean; content: any; title: string }
    | { type: "ADD_WORKSPACE"; new_workspace: WorkSpace }
    | FriendsActions;

export interface InitialState {
    current_file: FileNode | null;
    is_files_saved: boolean;
    files: FileNode[];
    files_content: Record<string, any>;
    friends: Friend[];
    changes: {
        files: FileNode[];
        contents: Record<string, any>;
        contracts: Record<string, StoredContract>;
        delete_contracts: string[];
        files_indexing: FileIndexing[];
    };
    notifications: Notification[];
    profile_history: UserProfile | null;
    top_dialog: { open: boolean; content: any; title: string | null };
    workspaces: WorkSpace[];
    contracts: Record<string, StoredContract>;
    all_friends: Friend[];
    all_users: any[];
    [key: string]: any;
}

export const initialState: InitialState = {
    current_file: null,
    is_files_saved: true,
    files: [],
    files_content: {},
    friends: [],
    changes: { files: [], contents: {}, contracts: {}, delete_contracts: [], files_indexing: [] },
    notifications: [],
    profile_history: null,
    top_dialog: { open: false, content: null, title: null },
    workspaces: [],
    contracts: {},
    all_friends: [],
    all_users: [],
};

export async function get_initial_data() {
    let isLoggedIn = await agent.is_logged();
    let data: undefined | { Ok: InitialData } | { Err: string } = actor && await actor.get_initial_data();

    initialState["Anonymous"] = data?.Err === "Anonymous user." && isLoggedIn;
    initialState["isLoggedIn"] = data?.Err !== "Anonymous user." && isLoggedIn;

    const authClient = await AuthClient.create();
    const userPrincipal = authClient.getIdentity().getPrincipal().toString();

    if (data && "Ok" in data) {
        let profile_history = actor && await actor.get_user_profile(Principal.fromText(data.Ok.Profile.id));
        let workspaces = actor && await actor.get_work_spaces();

        initialState["files"] = data.Ok.Files;
        initialState["denormalized_files_content"] = data.Ok.FilesContents;
        initialState["files_content"] = normalize_files_contents(data.Ok.FilesContents[0]);
        initialState["contracts"] = normalize_contracts(data.Ok.Contracts);
        initialState["current_file"] = getCurrentFile(initialState["files"]);
        initialState["profile_history"] = profile_history?.Ok || null;
        initialState["workspaces"] = workspaces || [];
        initialState["profile"] = data.Ok.Profile;
        initialState["users"] = data.Ok.DiscoverUsers;
        initialState["id"] = userPrincipal;
        initialState["friends"] = data.Ok.Friends;
        initialState["all_friends"] = data.Ok.Friends.map((f: Friend) => f.sender.id !== data.Ok.Profile.id ? f.sender : f.receiver);
        initialState["wallet"] = data.Ok.Wallet;
        let notifications = actor && await actor.get_user_notifications();
        initialState["notifications"] = notifications || [];
    }
}

export function filesReducer(state: InitialState = initialState, action: FilesActions): InitialState {
    let friends = { ...state.friends };
    let friend_id = action.id;

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
            delete state.contracts[action.id];
            return { ...state };

        case 'TOP_DIALOG':
            return {
                ...state,
                top_dialog: { open: action.open, content: action.content, title: action.title }
            };

        case 'RESOLVE_CHANGES':
            state.changes = {
                files: [],
                contents: {},
                contracts: {},
                delete_contracts: [],
                files_indexing: []
            };
            return { ...state };

        case 'CONFIRM_FRIEND':
            friends[friend_id] = { ...friends[friend_id], ...action.friend };
            return {
                ...state,
                friends: friends
            };

        case 'ADD_WORKSPACE':
            return {
                ...state,
                workspaces: [...state.workspaces, action.new_workspace]
            };

        default:
            return state;
    }
}
