import { FilesActions } from '../types/filesTypes';
import { FileNode, StoredContract, UserProfile, Notification, Friend, WorkSpace, FileIndexing } from "../../../declarations/backend/backend.did";

export const addFile = (new_file: FileNode): FilesActions => ({
    type: 'ADD_FILE',
    new_file
});

export const removeFile = (id: string): FilesActions => ({
    type: 'REMOVE',
    id
});

export const updateFile = (id: string, file: Partial<FileNode>): FilesActions => ({
    type: 'UPDATE',
    id,
    file
});

export const getCurrentFile = (): FilesActions => ({
    type: 'GET'
});

export const getAllFiles = (): FilesActions => ({
    type: 'GET_ALL'
});

export const setCurrentFile = (file: FileNode): FilesActions => ({
    type: 'CURRENT_FILE',
    file
});

export const updateContent = (id: string, content: any): FilesActions => ({
    type: 'UPDATE_CONTENT',
    id,
    content
});

export const filesSaved = (content: any): FilesActions => ({
    type: 'FILES_SAVED',
    content
});

export const addContent = (id: string, content: any): FilesActions => ({
    type: 'ADD_CONTENT',
    id,
    content
});

export const updateFileTitle = (id: string, title: string): FilesActions => ({
    type: 'UPDATE_FILE_TITLE',
    id,
    title
});

// export const addContract = (contract: StoredContract): FilesActions => ({
//     type: 'ADD_CONTRACT',
//     contract
// });

export const updateContract = (contract: StoredContract): FilesActions => ({
    type: 'UPDATE_CONTRACT',
    contract
});

export const contentChanges = (id: string, changes: any): FilesActions => ({
    type: 'CONTENT_CHANGES',
    id,
    changes
});

export const contractChanges = (changes: StoredContract): FilesActions => ({
    type: 'CONTRACT_CHANGES',
    changes
});

export const resolveChanges = (): FilesActions => ({
    type: 'RESOLVE_CHANGES'
});

export const setCurrentUserHistory = (profile_history: UserProfile): FilesActions => ({
    type: 'CURRENT_USER_HISTORY',
    profile_history
});

export const removeContract = (id: string): FilesActions => ({
    type: 'REMOVE_CONTRACT',
    id
});

export const updateBalance = (balance: number): FilesActions => ({
    type: 'UPDATE_BALANCE',
    balance
});

export const updateProfile = (profile: Partial<UserProfile>): FilesActions => ({
    type: 'UPDATE_PROFILE',
    profile
});

export const changeFileParent = (position: number, id: string, parent: string[], index: number): FilesActions => ({
    type: 'CHANGE_FILE_PARENT',
    position,
    id,
    parent,
    index
});

export const notify = (new_notification: Notification): FilesActions => ({
    type: 'NOTIFY',
    new_notification
});

export const updateNotificationList = (new_list: Notification[]): FilesActions => ({
    type: 'UPDATE_NOT_LIST',
    new_list
});

export const deleteNotify = (id: string): FilesActions => ({
    type: 'DELETE_NOTIFY',
    id
});

export const updateNote = (id: string): FilesActions => ({
    type: 'UPDATE_NOTE',
    id
});

export const updateFriend = (id: string): FilesActions => ({
    type: 'UPDATE_FRIEND',
    id
});

export const confirmFriend = (friend: Friend): FilesActions => ({
    type: 'CONFIRM_FRIEND',
    friend
});

export const setTopDialog = (open: boolean, content: any, title: string): FilesActions => ({
    type: 'TOP_DIALOG',
    open,
    content,
    title
});

export const addWorkspace = (new_workspace: WorkSpace): FilesActions => ({
    type: 'ADD_WORKSPACE',
    new_workspace
});

export const updateAnonymous = (anonymous: boolean): FilesActions => ({
    type: 'UPDATE_ANONYMOUS',
    anonymous,
});

