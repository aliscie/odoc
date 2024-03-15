//  Tests
//     1. keep old cells in contract.rows if not permited
//     2. prevent create new cells
//     3. prevent update a cell
//     3. Allow update a cell

import {newContract} from "./data_samples";
import {createCContract} from "../../components/contracts/custom_contract/utls";
import {
    CCell, CColumn, CContract,
    CRow,
    CustomContract,
    InitialData,
    StoredContract
} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";
import {randomString} from "../../data_processing/data_samples";
import {Principal} from "@dfinity/principal";

test("Update cell", async () => {
    // -------------------------------------------------- Create contract  -------------------------------------------------- \\
    let res = await global.actor.deposit_usdt(100);

    const {custom_contract, promise} = newContract();
    let new_c_contract: CContract = createCContract();
    custom_contract.creator = global.user.getPrincipal();
    new_c_contract.rows[0].cells[0].value = "INIT VALUE"
    custom_contract.contracts = [new_c_contract];
    new_c_contract.columns = new_c_contract.columns.map((col: CColumn) => {
        // col.permissions = [{'AnyOneEdite': null}]
        col.permissions = []
        return col;
    })


    expect("Ok" in res).toBeTruthy();

    let to_store: StoredContract = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);
    expect({"Ok": "Updates applied successfully."}).toEqual(res)
    let init_date: { Ok: InitialData } | { Err: string } = await global.actor.get_initial_data();
    // expect(init_date.Ok.Contracts.length).toBeGreaterThan(0);
    // init_date.Ok.Contracts.forEach((contract: CustomContract) => {
    //     expect(contract[1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("INIT VALUE");
    // });

    // -------------------------- Other user try to update the cell -------------------------- \\
    custom_contract.contracts[0].rows[0].cells[0].value = "NEW VALUE";
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);
    logger({res})


    // -------------------------- Check if the cell was not updated -------------------------- \\
    init_date = await global.actor.get_initial_data();
    // logger({xxxxx: init_date.Ok.Contracts[0][1].CustomContract.contracts[0].rows});
    expect(init_date.Ok.Contracts[0][1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("NEW VALUE");

// -------------------------- Update formula -------------------------- \\
    custom_contract.contracts[0].columns[1].formula_string = "1+1";
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);

    // ----- update cell ----- \\
    // -------------------------- Other user try to update the cell -------------------------- \\
    custom_contract.contracts[0].rows[0].cells[0].value = "NEW VALUE 2";
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);


    // -------------------------- Check if the cell was not updated -------------------------- \\
    init_date = await global.actor.get_initial_data();
    // logger({xxxxx: init_date.Ok.Contracts[0][1].CustomContract.contracts[0].rows});
    expect(init_date.Ok.Contracts[0][1].CustomContract.contracts[0].rows[0].cells[0].value).toBe("NEW VALUE 2");

});

