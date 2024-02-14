//  Tests
//     1. keep old cells in contract.rows if not permited
//     2. prevent create new cells
//     3. prevent update a cell
//     3. Allow update a cell

import {newContract} from "./data_samples";
import {createCContract} from "../../components/contracts/custom_contract/utls";
import {
    CCell, CContract,
    CRow,
    CustomContract,
    InitialData,
    StoredContract
} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";
import {randomString} from "../../data_processing/data_samples";

test("Test custom contract permissions", async () => {
    // -------------------------------------------------- Create contract  -------------------------------------------------- \\
    let res = await global.actor.deposit_usdt(100);

    const {custom_contract, promise} = newContract();
    let new_c_contract: CContract = createCContract();
    custom_contract.creator = global.user.getPrincipal();
    new_c_contract.rows[0].cells[0].value = "INIT VALUE"
    custom_contract.contracts = [new_c_contract];
    expect("Ok" in res).toBeTruthy();

    let to_store: StoredContract = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);
    let init_date: { Ok: InitialData } | { Err: string } = await global.actor.get_initial_data();
    expect(init_date.Ok.Contracts.length).toBeGreaterThan(0);
    init_date.Ok.Contracts.forEach((contract: CustomContract) => {
        expect(contract[1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("INIT VALUE");
    });

    // -------------------------- Other user try to update the cell -------------------------- \\
    let newUser = await global.newUser();
    global.actor.setIdentity(newUser);
    custom_contract.contracts[0].rows[0].cells[0].value = "NEW VALUE";
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);
    // expect({"Ok": "Some updates were not applied, Updates applied successfully."}).toStrictEqual(res);
    // logger({res});


    // -------------------------- Check if the cell was not updated -------------------------- \\
    global.actor.setIdentity(global.user);

    // init_date = await global.actor.get_initial_data();
    // init_date.Ok.Contracts.forEach((contract: CustomContract) => {
    //     expect(contract[1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("INIT VALUE");
    // });

    custom_contract.contracts[0].columns[0].permissions = [{'AnyOneEdite': null}];
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);


    // -------------------------- Other user try to update the cell -------------------------- \\
    global.actor.setIdentity(newUser);
    custom_contract.contracts[0].rows[0].cells[0].value = "NEW VALUE";
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);


    // -------------------------- Check if the cell was updated -------------------------- \\
    global.actor.setIdentity(global.user);
    init_date = await global.actor.get_initial_data();
    init_date.Ok.Contracts.forEach((contract: CustomContract) => {
        expect(contract[1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("NEW VALUE");
    });

});

