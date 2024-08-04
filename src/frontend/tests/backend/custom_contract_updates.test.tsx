import {CustomContract} from "../../../declarations/backend/backend.did";
import {logger} from "../../dev_utils/log_data";

test("Test update cell", async () => {
    let custom_contract: CustomContract = {
        "id": "t7k6mw",
        "permissions": [],
        "creator": global.user.getPrincipal(),
        "date_created": 0,
        "payments": [],
        "name": "string",
        "formulas": [],
        "contracts": [
            {
                "id": "9tf5uf",
                "creator": global.user.getPrincipal(),
                "date_created": 0,
                "name": "Untitled",
                "rows": [
                    {
                        "id": "g3bqvn",
                        "cells": [
                            {
                                "field": "acfvsq",
                                "value": "INIT VALUE"
                            }
                        ]
                    }
                ],
                "columns": [
                    {
                        "id": "0rotq1",
                        "field": "acfvsq",
                        "headerName": "Untitled",
                        "column_type": "string",
                        "filters": [],
                        "permissions": [],
                        "formula_string": "",
                        "editable": true,
                        "deletable": false
                    }
                ],
            }
        ],
        "date_updated": 0,
        "promises": [
            {
                "contract_id": "",
                "id": "ggp9n8",
                "date_created": 0,
                "date_released": 0,
                "sender": global.user.getPrincipal(),
                "status": {
                    "None": null
                },
                "amount": 0,
                "receiver": global.user.getPrincipal(),
                "cells": []
            }
        ],
    };

    let res;
    let to_store;
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], [], []);
    expect(res).toEqual({"Ok": "Updates applied successfully."});

    //// ------------------- Update cell -------------------
    custom_contract.contracts[0].rows[0].cells[0].value = "NEW VALUE";
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], [], []);
    expect(res).toEqual({"Ok": "Updates applied successfully."});


    //// ------------------- Update cell by others-------------------
    let newUser = await global.newUser();
    global.actor.setIdentity(newUser);
    custom_contract.contracts[0].rows[0].cells[0].value = "CHANGE BY OTHERS";
    to_store = {
        "CustomContract": custom_contract
    }
    res = await global.actor.multi_updates([], [], [to_store], [], []);
    expect(res).toEqual({"Ok": "Error: You don't have permission to update column: Untitled Updates applied successfully."});

    //------------------- get init data -------------------
    global.actor.setIdentity(global.user);
    res = await global.actor.get_initial_data();
    expect(res.Ok.Contracts[0][1].CustomContract.contracts[0].rows[0].cells[0].value).toEqual("NEW VALUE");
});
