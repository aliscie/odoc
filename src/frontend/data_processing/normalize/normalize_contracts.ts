import {
    CustomContract,
    PaymentContract,
    SharesContract,
    StoredContract
} from "../../../declarations/user_canister/user_canister.did";

type ContractType = CustomContract | PaymentContract | SharesContract;

export function normalize_contracts(json: Array<[string, StoredContract]>) {
    let contracts: Map<string, ContractType> = new Map();
    json.map((item: [string, StoredContract]) => {
        let key: string = item[0];
        let value: StoredContract = item[1];
        let contract: ContractType = Object.values(value)[0];
        contracts[key] = contract;
    })
    return contracts;
}