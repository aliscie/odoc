import {randomString} from "../../data_processing/data_samples";
import {CPayment, CustomContract} from "../../../declarations/backend/backend.did";
import {createNewPromis} from "../../components/contracts/custom_contract/utls";
import {Principal} from "@dfinity/principal";

export function newContract(): { custom_contract: CustomContract, promise: CPayment } {

    let contract_id: string = randomString();
    let promise: CPayment = createNewPromis(Principal.fromText("2vxsx-fae"));
    let custom_contract: CustomContract = {
        id: contract_id,
        creator: Principal.fromText("2vxsx-fae"),
        'date_created': 0,
        'payments': [],
        'name': 'string',
        'formulas': [],
        'contracts': [],
        'date_updated': 0,
        'promises': [promise],
        "permissions": [],

    }
    return {custom_contract, promise};
}