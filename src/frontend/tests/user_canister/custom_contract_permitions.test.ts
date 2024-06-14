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
} from "../../../declarations/backend/backend.did";
import {logger} from "../../dev_utils/log_data";
import {randomString} from "../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";

// test("Test custom contract update permissions", async () => {
//     // -------------------------------------------------- Create contract  -------------------------------------------------- \\
//     let res = await global.actor.deposit_usdt(100);
//
//     const {custom_contract, promise} = newContract();
//     let new_c_contract: CContract = createCContract();
//     custom_contract.creator = global.user.getPrincipal();
//     new_c_contract.rows[0].cells[0].value = "INIT VALUE"
//     custom_contract.contracts = [new_c_contract];
//     expect("Ok" in res).toBeTruthy();
//
//     let to_store: StoredContract = {
//         "CustomContract": custom_contract
//     }
//     res = await global.actor.multi_updates([], [], [to_store], []);
//     expect({"Ok": "Updates applied successfully."}).toEqual(res)
//     let init_date: { Ok: InitialData } | { Err: string } = await global.actor.get_initial_data();
//     // expect(init_date.Ok.Contracts.length).toBeGreaterThan(0);
//     // init_date.Ok.Contracts.forEach((contract: CustomContract) => {
//     //     expect(contract[1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("INIT VALUE");
//     // });
//
//     // -------------------------- Other user try to update the cell -------------------------- \\
//     let newUser = await global.newUser();
//     global.actor.setIdentity(newUser);
//     custom_contract.contracts[0].rows[0].cells[0].value = "NEW VALUE";
//     to_store = {
//         "CustomContract": custom_contract
//     }
//     res = await global.actor.multi_updates([], [], [to_store], []);
//     expect({"Ok": "Error: You don't have permission to update column: Untitled Updates applied successfully."}).toStrictEqual(res);
//
//
//
//     // -------------------------- Check if the cell was not updated -------------------------- \\
//     global.actor.setIdentity(global.user);
//
//     init_date = await global.actor.get_initial_data();
//     expect(init_date.Ok.Contracts[0][1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("INIT VALUE");
//
//     // -------------------------- Allow anyone to edite -------------------------- \\
//     // custom_contract.contracts[0].columns[0].permissions = [{'AnyOneEdite': null}];
//     custom_contract.contracts[0].columns[0].permissions = [{'Edit': newUser.getPrincipal()}];
//     to_store = {
//         "CustomContract": custom_contract
//     }
//     res = await global.actor.multi_updates([], [], [to_store], []);
//
//
//     // -------------------------- Other user try to update the cell -------------------------- \\
//     global.actor.setIdentity(newUser);
//     custom_contract.contracts[0].rows[0].cells[0].value = "NEW VALUE";
//     to_store = {
//         "CustomContract": custom_contract
//     }
//     res = await global.actor.multi_updates([], [], [to_store], []);
//
//
//     // -------------------------- Check if the cell was updated -------------------------- \\
//     global.actor.setIdentity(global.user);
//     init_date = await global.actor.get_initial_data();
//     expect(init_date.Ok.Contracts[0][1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("NEW VALUE");
//
// });


test("Test custom contract view permissions", async () => {
    // -------------------------------------------------- Create contract  -------------------------------------------------- \\
    let res = await global.actor.deposit_usdt(100);

    const {custom_contract, promise} = newContract();

    const author = global.user.getPrincipal().toText();
    const contract_id = custom_contract.id;
    const newUser = await global.newUser();


    let new_c_contract: CContract = createCContract();
    custom_contract.creator = global.user.getPrincipal();
    new_c_contract.rows[0].cells[0].value = "INIT VALUE"
    custom_contract.contracts = [new_c_contract];
    expect("Ok" in res).toBeTruthy();
    custom_contract.contracts[0].columns[0].permissions = [];
    // custom_contract.contracts[0].columns[0].permissions = [{'View': newUser.getPrincipal()}];
    let to_store: StoredContract = {
        "CustomContract": custom_contract
    }

    res = await global.actor.multi_updates([], [], [to_store], []);
    expect({"Ok": "Updates applied successfully."}).toEqual(res)

    let get_contract = await global.actor.get_contract(author, contract_id);
    expect(get_contract.Ok.CustomContract.contracts[0].rows[0].cells[0].value).toBe("INIT VALUE");
    expect(get_contract.Ok.CustomContract.contracts[0].columns.length).toBe(1);

    // -------------------------- Other user try to view the cell -------------------------- \\

    global.actor.setIdentity(newUser);
    get_contract = await global.actor.get_contract(author, contract_id);
    expect(get_contract.Ok.CustomContract.contracts[0].rows[0].cells.length).toBe(0);
    expect(get_contract.Ok.CustomContract.contracts[0].columns.length).toBe(0);

});