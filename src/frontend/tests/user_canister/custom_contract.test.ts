import {StoredContract, User, UserHistory} from "../../../declarations/user_canister/user_canister.did";
import {randomString} from "../../data_processing/data_samples";
import {assert} from "vitest";
import {newContract} from "./data_samples";

// TODO Tests
//     1. in the formula.exec.payment.sender == caller()
//     That mean only the caller() can set him self as a sender in formula
//     2. on save execute formula even if formula.exe.payment != caller()
//     3. in promise.sender == caller() (caller can not save a promise with sender != caller())


test("Test custom contract", async () => {
    let newUser = await global.newUser();
    let res = await global.actor.deposit_usdt(100);
    promise.receiver = newUser.getPrincipal()
    promise.sender = global.user.getPrincipal()
    const {custom_contract, promise} = newContract();
    custom_contract.promises = [promise];
    custom_contract.creator = global.user.getPrincipal();
    expect("Ok" in res).toBeTruthy();
    // console.log({newUser, me: global.user});

    let to_store: StoredContract = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);

    // --------------------- Confirm the promise ---------------------  \\
    global.actor.setIdentity(newUser)
    let notifications: Array<Notification> = await global.actor.get_notifications();
    let payment = notifications[0].content.CPaymentContract[0];
    let contract_id = custom_contract.id;
    expect(payment.contract_id).toEqual(contract_id);
    res = await global.actor.confirmed_c_payment(payment);
    expect(res).toEqual({Ok: null});


    // ---------------------  cancel the promise --------------------- \\
    global.actor.setIdentity(global.user)

    res = await global.actor.get_initial_data();
    res.Ok.Contracts.forEach((value, key) => {
        expect(value[1].CustomContract.promises[0].status).toEqual({Confirmed: null});
    });


    custom_contract.promises[0].status = {Canceled: null};
    let to_store3: StoredContract = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store3], []);
    let notifications2: Array<Notification> = await global.actor.get_notifications();
    // logger({notifications2}) // TODO assert this You can't canceled confirmed payment in notifications2
    res = await global.actor.get_initial_data();
    res.Ok.Contracts.forEach((value, key) => {
        expect(value[1].CustomContract.promises[0].status).toEqual({Confirmed: null});
    });


    // Release the promise
    global.actor.setIdentity(global.user)
    custom_contract.promises[0].status = {Released: null};
    to_store = {
        "CustomContract": custom_contract
    }

    res = await global.actor.multi_updates([], [], [to_store], []);
    assert("Ok" in res)

    // ---------------------------- assert the promise was moved to payments ---------------------------- \\
    res = await global.actor.get_initial_data();
    res.Ok.Contracts.forEach((value, key) => {
        expect(value[1].CustomContract.promises).toEqual([]);
        expect(value[1].CustomContract.payments[0].status).toEqual({Released: null});
    });


    let profile_history = await global.actor.get_user_profile(global.user.getPrincipal());
    expect(profile_history.Ok[1].total_rate).toBeGreaterThan(0);
    // logger({profile_history});
});


async function userConfirm(user, g) {
    g.actor.setIdentity(user)
    let notifications: Array<Notification> = await global.actor.get_notifications();
    await Promise.all(notifications.map(async (value) => {
        let payment = value.content.CPaymentContract[0];
        let contract_id = custom_contract.id;
        expect(payment.contract_id).toEqual(contract_id);
        let res = await global.actor.confirmed_c_payment(payment);
        expect(res).toEqual({Ok: null});
    }));
}


test("Test actions rating", async () => {
    let contract_id: string = randomString();

    // -------- init the test -------- \\
    let res;
    let newUser;
    let promises = [];

    // ------ testing the rating ------ \\
    const {custom_contract, promise} = newContract();

    async function userObject(user) {
        global.actor.setIdentity(user)
        let notifications: Array<Notification> = await global.actor.get_notifications();
        await Promise.all(notifications.map(async (value) => {
            let payment = value.content.CPaymentContract[0];
            let contract_id = custom_contract.id;
            expect(payment.contract_id).toEqual(contract_id);
            let res = await global.actor.object_on_cancel(payment, 'I don\'t like it');
            expect(res).toEqual({Ok: null});
        }));
    }


    res = await global.actor.deposit_usdt(2000);
    promise.amount = 120;
    promise.sender = global.user.getPrincipal();
    promise.status = {None: null};

    /// ---------- dummy promises ---------- \\
    let newUser1 = await global.newUser();
    newUser = newUser1.getPrincipal();
    promises.push(...[1, 2, 3, 4].map((value) => {
        return {
            ...promise,
            id: randomString(),
            receiver: newUser,
        }
    }))

    let newUser2 = await global.newUser();
    newUser = newUser2.getPrincipal();
    promises.push(...[1, 2, 3, 4].map((value) => {
        return {
            ...promise,
            id: randomString(),
            receiver: newUser,
        }
    }))

    let newUser3 = await global.newUser();
    newUser = newUser3.getPrincipal();
    promises.push(...[1, 2, 3, 4].map((value) => {
        return {
            ...promise,
            id: randomString(),
            receiver: newUser,
        }
    }))


    let newUser4 = await global.newUser();
    newUser = newUser4.getPrincipal();
    promises.push(...[3].map((value) => {
        return {
            ...promise,
            id: randomString(),
            receiver: newUser,
        }
    }))

    let newUser5 = await global.newUser();
    newUser = newUser5.getPrincipal();
    promises.push(...[3].map((value) => {
        return {
            ...promise,
            id: randomString(),
            receiver: newUser,
        }
    }))


    promise.status = {Released: null};
    let promises_3 = await Promise.all([1, 2, 3].map(async (value) => {
        newUser = await global.newUser();
        newUser = newUser.getPrincipal();
        return {
            ...promise,
            id: randomString(),
            receiver: newUser,
        }
    }));

    promises.push(...promises_3);
    /// ---------- test case ---------- \\
    custom_contract.creator = global.user.getPrincipal();
    let to_store = {
        "CustomContract": {...custom_contract, promises}
    };

    res = await global.actor.multi_updates([], [], [to_store], []);
    expect(res).toEqual({Ok: "Updates applied successfully."});

    //  ---------------- Confirm the promises ---------------- \\
    await userObject(newUser2)
    await userObject(newUser3)
    await userObject(newUser4)
    await userObject(newUser5) // TODO I should get 4 objections but in the backend (user_canister) it shows 3 fix this
    global.actor.setIdentity(global.user)

    //
    /// ---------------------------- assert the promise was moved to payments ---------------------------- \\
    //

    let profile_history: { Ok: [User, UserHistory] } | { Err: string } = await global.actor.get_user_profile(global.user.getPrincipal());
    expect(profile_history.Ok[1].users_interacted).toEqual(3);
    expect(profile_history.Ok[1].spent).toEqual(360,);
    expect(profile_history.Ok[1].actions_rate).toEqual(3)


    // ---------------- release the promises ---------------- \\
    promises = promises.map((value) => {
        return {
            ...value,
            status: {Released: null}
        }
    });
    to_store = {
        "CustomContract": {...custom_contract, promises}
    };
    res = await global.actor.multi_updates([], [], [to_store], []);
    profile_history = await global.actor.get_user_profile(global.user.getPrincipal());
    expect(profile_history.Ok[1].users_interacted).toEqual(8);
    // expect(profile_history.Ok[1].spent).toEqual(1920); // TODO You can't spent 2040 whitel the depsoit was only 2000
    expect(profile_history.Ok[1].actions_rate).toEqual(5)
});
