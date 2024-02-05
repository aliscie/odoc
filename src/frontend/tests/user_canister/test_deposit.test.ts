import {InitialData, RegisterUser} from "../../../declarations/user_canister/user_canister.did";


test("Test deposit", async () => {
    let input: RegisterUser = {
        'name': ["name1"],
        'description': ["Somthing"],
        'photo': [[]],
    };
    // register user 1
    let res = await global.actor.register(input);
    expect("Ok" in res).toBeTruthy();

    // deposit_usdt
    let res2 = await global.actor.deposit_usdt(Number(100));
    expect("Ok" in res2).toBeTruthy();


    let res3: { Ok: InitialData } | { Err: string } = await global.actor.get_initial_data();
    let balance = res3.Ok.Wallet.balance;
    expect(balance == 100).toBeTruthy();

    // withdraw_usdt
    let res4 = await global.actor.withdraw_usdt(Number(100));


    let res5: { Ok: InitialData } | { Err: string } = await global.actor.get_initial_data();
    balance = res5.Ok.Wallet.balance;
    expect(balance == 0).toBeTruthy();
});
