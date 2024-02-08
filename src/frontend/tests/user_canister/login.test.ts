import {_SERVICE, RegisterUser, User} from "../../../declarations/user_canister/user_canister.did";
import {AnonymousIdentity, Identity} from "@dfinity/agent";


test("Test render login", async () => {


    let input: RegisterUser = {
        'name': ["string"],
        'description': ["Somthing"],
        'photo': [[]],
    };


    let res = await global.actor.register(input);
    console.log({res})

    let input2: RegisterUser = {
        'name': ["user2"],
        'description': ["Somthing"],
        'photo': [[]],
    };
    let res2: { Ok: User } | { Err: string } = await global.actor.register(input2);
    // expect(res2.Ok.name === input.name[0]).toBeTruthy();


    // const user2 = createIdentity("2");
    let anonymous: Identity = new AnonymousIdentity();
    let anonymous_actor: _SERVICE = await global.actor.setIdentity(anonymous)
    let res3 = await global.actor.register(input2);
    expect(res3.Err).toBe('Anonymous users are not allowed to register.')
});
