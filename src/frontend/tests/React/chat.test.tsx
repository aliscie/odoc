import configureStore from 'redux-mock-store';
import {Provider} from "react-redux";
import {render} from "@testing-library/react";
import * as React from "react";
import {StrictMode} from "react";
import redux_sample from "./redux_example.json";
import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory} from "../../../declarations/user_canister";
import {Principal} from "@dfinity/principal";
import {_SERVICE, RegisterUser} from "../../../declarations/user_canister/user_canister.did";
import {AuthClient} from "@dfinity/auth-client";
import {canisterId as identityCanisterId} from "../../../declarations/internet_identity";
import {canisterId} from "../../../declarations/user_canister";
import {createActor} from "../../../declarations/user_canister/index";
import {PocketIc} from '@hadronous/pic';
import {resolve} from 'node:path';
import dotenv from 'dotenv';
//
const mockStore = configureStore([]);


test('Test chat logic', () => {
    const store = mockStore(redux_sample);
    render(
        <StrictMode>
            <Provider store={store}>
                {/*<ChatsPage/>*/}
            </Provider>
        </StrictMode>
    )


});

const WASM_PATH = resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "target",
    "wasm32-unknown-unknown",
    "release",
    "user_canister.wasm"
);

test("Should contain a candid interface", async () => {
    const result = dotenv.config()
    // console.log({result, POCKET_IC_BIN: process.env.POCKET_IC_BIN})

    // let pic = await PocketIc.create()
    // const fixture = await pic.setupCanister<_SERVICE>(
    //     idlFactory,
    //     WASM_PATH,
    // );
    // let actor = fixture.actor;
    let input: RegisterUser = {
        'name': ["string"],
        'description': [],
        'photo': [],
    };
    // await identify()
    const caller = Principal.anonymous()

    const user_canister_test = await createActor(canisterId, {
        agentOptions: {host: "http://127.0.0.1:8080", fetch},
        // agent: context.getAgent(caller)
    });


    let register_res = await user_canister_test.register(input)
    console.log({register_res})

});
