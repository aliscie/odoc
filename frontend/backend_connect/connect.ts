import {actor} from "./ic_agent";

type Platform = "WEB" | "DESKTOP" | "MOBILE";

let PLATFORM: Platform = (process.env.PLATFORM as Platform) || "WEB";

console.log({PLATFORM});

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

