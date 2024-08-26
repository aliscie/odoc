import {CustomContract, StoredContract} from "../../../declarations/backend/backend.did";
import {logger} from "../../DevUtils/logData";

// type ContractType = CustomContract;

export function deserializeContracts(json: Array<[string, StoredContract]>) {
    let contracts: Map<string, ContractType> = new Map();
    json && json.map((item: [string, StoredContract]) => {
        let key: string = item[0];
        let value: StoredContract = item[1];
        let contract: CustomContract = Object.values(value)[0];
        contracts[key] = contract;
    })
    return contracts;
}
