import {
    CContract,
    CPayment,
    CustomContract, Formula,
    InitialData,
    RegisterUser, StoredContract, User, UserHistoryFE
} from "../../../declarations/user_canister/user_canister.did";
import {actor} from "../../App";
import {randomString} from "../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";
import {logger} from "../../dev_utils/log_data";
import {assert} from "vitest";

// TODO Tests
//     1. in the formula.exec.payment.sender == caller()
//     That mean only the caller() can set him self as a sender in formula
//     2. on save execute formula even if formula.exe.payment != caller()
//     3. in promise.sender == caller() (caller can not save a promise with sender != caller())


let custom_contract_sample = {
    "id": "nydjdf",
    "name": "Custom contract",
    "creator": {"__principal__": "wcr75-y4cmz-2l36l-wvzye-ylfif-6ryor-irsen-v74ap-rz6bf-j7st6-jqe"},
    "date_created": 0,
    "payments": [],
    "promises": [{
        "amount": 10,
        "id": "yfeu6n",
        "sender": {"__principal__": "wcr75-y4cmz-2l36l-wvzye-ylfif-6ryor-irsen-v74ap-rz6bf-j7st6-jqe"},
        "receiver": {"__principal__": "wcr75-y4cmz-2l36l-wvzye-ylfif-6ryor-irsen-v74ap-rz6bf-j7st6-jqe"},
        "status": {"None": null},
        "date_created": 0,
        "date_released": 0
    }],
    "contracts": [],
    "formulas": [],
    "date_updated": 0
};

let to_save = [{'CustomContract': custom_contract_sample}]
test("Test custom contract", async () => {
    let new_user = await global.new_user();
    let res = await global.actor.deposit_usdt(100);

    expect("Ok" in res).toBeTruthy();
    // console.log({new_user, me: global.user});
    let promis: CPayment = {
        contract_id: "",
        id: randomString(),
        date_created: Number(0),
        date_released: Number(0),
        sender: global.user.getPrincipal(),
        released: true,
        status: {'None': null},
        amount: Number(50),
        receiver: new_user.getPrincipal(),
    }
    let custom_contract: CustomContract = {
        id: randomString(),
        creator: global.user.getPrincipal(),
        'date_created': 0,
        'payments': [],
        'name': 'string',
        'formulas': [],
        'contracts': [],
        'date_updated': 0,
        'promises': [promis],

    }
    let to_store: StoredContract = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);

    // Confirm the promise
    global.actor.setIdentity(new_user)
    let notifications: Array<Notification> = await global.actor.get_notifications();
    let payment = notifications[0].content.CPaymentContract[0];
    let contract_id = custom_contract.id;
    assert(payment.contract_id === contract_id)
    res = await global.actor.confirmed_c_payment(payment);
    assert("Ok" in res)
    let profile_history: { Ok: [User, UserHistoryFE] } | { Err: string } = await global.actor.get_user_profile(global.user.getPrincipal());
    assert(profile_history.Ok[1].total_rate == 0)

    // cancel the promise
    global.actor.setIdentity(global.user)
    custom_contract.promises[0].status = {Canceled: null};
    let to_store3: StoredContract = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store3], []);
    let notifications2: Array<Notification> = await global.actor.get_notifications();
    logger(notifications2) // TODO assert this You can't canceled confirmed payment in notifications2
    res = await global.actor.get_initial_data();
    res.Ok.Contracts.forEach((value, key) => {
        // console.log({x: value[1].CustomContract})
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
    profile_history = await global.actor.get_user_profile(global.user.getPrincipal());
    assert(profile_history.Ok[1].total_rate > 0)
    // logger({profile_history})

});
