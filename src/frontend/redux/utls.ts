import {FileNode} from "../../declarations/user_canister/user_canister.did";

export function getCurrentFile(files: Array<FileNode>): FileNode | null {
    let current_file = localStorage.getItem("current_file");
    if (!current_file) {
        return null;
    }
    let stored_file: FileNode = JSON.parse(current_file);
    if (files.find((file) => file.id === stored_file.id)) {
        return stored_file;
    }
    return null
}