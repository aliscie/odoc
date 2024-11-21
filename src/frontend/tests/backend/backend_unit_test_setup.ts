import { afterAll, beforeAll, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { resolve } from "node:path";
import { createIdentity, PocketIc } from "@hadronous/pic";
import { idlFactory } from "../../../declarations/backend";
import { _SERVICE } from "../../../declarations/backend/backend.did";
import { Identity } from "@dfinity/agent";
import { RegisterUser, User } from "../../../declarations/backend/backend.did";
import { randomString } from "../../DataProcessing/dataSamples";

vi.stubGlobal("matchMedia", () => ({
  addEventListener: () => {},
}));

const WASM_PATH = resolve(
  __dirname,
  "target",
  "wasm32-unknown-unknown",
  "release",
  "backend.wasm",
);

const setupTestEnvironment = async () => {
  const url = import.meta.env.VITE_IC_HOST;
  const alice = createIdentity("1");
  const pic = await PocketIc.create(url);
  const fixture = await pic.setupCanister<_SERVICE>(idlFactory, WASM_PATH);
  fixture.actor.setIdentity(alice);

  global.pic = pic;
  global.user = alice;
  global.actor = fixture.actor;
  global.is_global_set = true;

  const loginAs = async (user: Identity) => {
    fixture.actor.setIdentity(user);
    return fixture.actor;
  };

  const register = async () => {
    const input: RegisterUser = {
      name: ["name1"],
      description: ["Something"],
      photo: [[]],
    };
    await global.actor.register(input);
  };
  await register();

  const newUser = async (login: boolean = false, name = randomString()) => {
    const newUser: Identity = createIdentity(randomString());
    global.actor.setIdentity(newUser);

    const newInput: RegisterUser = {
      name: [name],
      description: ["Something"],
      photo: [[]],
    };

    const result: undefined | { Ok: User } | { Err: string } =
      await global.actor.register(newInput);

    if (!login) {
      global.actor.setIdentity(alice);
    }
    return newUser;
  };

  global.loginAs = loginAs;
  global.register = register;
  global.newUser = newUser;
};

beforeAll(setupTestEnvironment);

afterAll(async () => {
  // await global.pic.tearDown();
  // delete global.lol;
  // delete global.pic;
  // delete global.actor;
  // delete global.loginAs;
  // delete global.user;
});
