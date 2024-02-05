import {afterAll, beforeAll, vi} from "vitest";
import '@testing-library/jest-dom/vitest'
import dotenv from "dotenv";

import {resolve} from "node:path";
import {createIdentity, PocketIc} from "@hadronous/pic";
import {idlFactory,} from "./src/declarations/user_canister";
import {_SERVICE} from ".dfx/local/canisters/user_canister/service.did";
import {Identity} from "@dfinity/agent";
import {RegisterUser, User} from "./src/declarations/user_canister/user_canister.did";
import {randomString} from "./src/frontend/data_processing/data_samples";


// import { vi } from 'vitest'
// globalThis.jest = vi
vi.stubGlobal('matchMedia', () => ({
    addEventListener: () => {
    },
}));

// type Arguments = {
//     icrc3_args: InitArgs__1;
//     icrc30_args: InitArgs;
//     icrc7_args: InitArgs__3;
// };
const defaultInitArgs: any = {
    icrc30_args: [],
    icrc3_args: [],
    icrc7_args: [],
};

const WASM_PATH = resolve(
    __dirname,
    "target",
    "wasm32-unknown-unknown",
    "release",
    "user_canister.wasm"
);

// interface DeployOptions {
//     initArgs?: any;
//     deployer?: Principal;
// }


beforeAll(async () => {

    const alice: Identity = createIdentity("1");

    let pic = await PocketIc.create();
    const fixture = await pic.setupCanister<_SERVICE>(idlFactory, WASM_PATH, undefined, undefined, undefined);
    fixture.actor.setIdentity(alice);
    global.pic = pic
    global.user = alice
    global.actor = fixture.actor
    global.is_global_set = true

    let login_as = async (user: Identity) => {
        fixture.actor.setIdentity(user);
        // global.actor = fixture.actor
        return fixture.actor
    }

    let register = async () => {
        let input: RegisterUser = {
            'name': ["name1"],
            'description': ["Somthing"],
            'photo': [[]],
        };
        // register user 1
        let res: undefined | { Ok: User } | { Err: string } = await global.actor.register(input);
    }


    let new_user = async (login: boolean = false, name = randomString()) => {
        const new_user: Identity = createIdentity(randomString());

        let pic = await PocketIc.create();
        const fixture = await pic.setupCanister<_SERVICE>(idlFactory, WASM_PATH, undefined, undefined, undefined);
        fixture.actor.setIdentity(new_user);
        let input: RegisterUser = {
            'name': [name],
            'description': ["Somthing"],
            'photo': [[]],
        };
        let res: undefined | { Ok: User } | { Err: string } = await global.actor.register(input);
        if (!login) {
            fixture.actor.setIdentity(alice);
        }
        return new_user
    }


    global.login_as = login_as
    global.register = register
    global.new_user = new_user
});
afterAll(async () => {
    await global.pic.tearDown();
    delete global.lol
    delete global.pic
    delete global.actor
    delete global.login_as
    delete global.user
});

