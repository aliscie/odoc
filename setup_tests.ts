import {afterAll, beforeAll, vi} from "vitest";
import '@testing-library/jest-dom/vitest'
import dotenv from "dotenv";

import {resolve} from "node:path";
import {createIdentity, PocketIc} from "@hadronous/pic";
import {idlFactory,} from "./src/declarations/user_canister";
import {_SERVICE} from ".dfx/local/canisters/user_canister/service.did";
import {Identity} from "@dfinity/agent";

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
    global.actor = fixture.actor
    global.is_global_set = true

    let login_as = async (user: Identity) => {
        fixture.actor.setIdentity(user);
        // global.actor = fixture.actor
        return fixture.actor
    }
    global.login_as = login_as
});
afterAll(async () => {
    await global.pic.tearDown();
    delete global.lol
    delete global.pic
    delete global.actor
    delete global.login_as
});

