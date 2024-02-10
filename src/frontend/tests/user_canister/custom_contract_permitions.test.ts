//  Tests
//     1. keep old cells in contract.rows if not permited
//     2. prevent create new cells
//     3. prevent update a cell
//     3. Allow update a cell


import {newContract} from "./data_samples";
import {createCContract} from "../../components/contracts/custom_contract/utls";
import {
    CCell,
    CRow,
    CustomContract,
    InitialData,
    StoredContract
} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";
import {randomString} from "../../data_processing/data_samples";

test("Test custom contract permissions", async () => {
    let new_user = await global.newUser();
    let {custom_contract, promise} = newContract();
    let c_contract = createCContract()
    custom_contract.contracts = [c_contract];
    let to_store: StoredContract = {
        "CustomContract": custom_contract
    }
    let res = await global.actor.multi_updates([], [], [to_store], []);
    expect("Ok" in res).toBeTruthy();

    // -------------------------------------------------- other user -------------------------------------------------- \\
    let test_value = 'MY_UPDATE_IS_HERE';
    global.actor.setIdentity(new_user);
    let cells: Array<CCell> = [];

    c_contract.columns.forEach((column) => {
        cells.push({
            field: column.field,
            value: test_value,
        })
    });
    let new_row: CRow = {
        id: randomString(),
        cells
    };
    custom_contract.contracts[0].rows = [...custom_contract.contracts[0].rows, new_row]
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], []);
    expect("Ok" in res).toBeTruthy();

    // -------------------------------------------------- Back to original user -------------------------------------------------- \\
    global.actor.setIdentity(global.user);
    let init_date: { Ok: InitialData } | { Err: string } = await global.actor.get_initial_data();
    let contracts: CustomContract = res.Ok.Contracts;
    logger({contracts}) // TODO what the fuck why this is empty?
    // TODO expect their is no new cell or new row with `MY_UPDATE_IS_HERE`

});
