import {actor} from "./ic_agent";

type Platform = "WEB" | "DESKTOP" | "MOBILE";

let PLATFORM: Platform = (process.env.PLATFORM as Platform) || "WEB";


export async function get_files() {
    switch (PLATFORM) {
        case "WEB":
            return await actor.get_all_files();
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}

/**
 * Creates a new file with the specified name and parent.
 * @param {string} name - The name of the file.
 * @param {number} parent - The ID of the parent.
 *                          Note: Parent is represented as a number.
 * @returns {Promise<any>} - A Promise that resolves to the created file.
 */
export async function create_file(name: string, parent?: Nat) { // In the UI, this named "create page"
    switch (PLATFORM) {
        case "WEB":
            return await actor.create_new_file(name, []);
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}


export async function delete_file(file_id: any) {
    switch (PLATFORM) {
        case "WEB":
            return await actor.delete_file(file_id);
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}

export async function rename_file(id: any, name: any) {
    switch (PLATFORM) {
        case "WEB":
            return await actor.rename_file(id, name);
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}

export async function get_all_files_content() {
    switch (PLATFORM) {
        case "WEB":
            let res = await actor.get_all_files_content();
            console.log({res})
            return res
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}

export async function multi_update(updates: any) {
    switch (PLATFORM) {
        case "WEB":
            return await actor.multi_files_content_updates(updates);
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}

export async function create_agreement(name: string) {
    switch (PLATFORM) {
        case "WEB":
            return await actor.create_agreement(name);
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}


export async function get_initial_data() {
    switch (PLATFORM) {
        case "WEB":
            return await actor.get_initial_data();
        case "DESKTOP":
            return null;
        case "MOBILE":
            return null;
    }
}




