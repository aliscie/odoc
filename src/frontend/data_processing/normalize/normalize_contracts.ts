import {Payment} from "../../../declarations/user_canister/user_canister.did";

export function normalize_contracts(json) {
    const dataStructure = {};
    for (const [key, value] of json) {
        const contractData = value.PaymentContract;
        let payment: Payment = {
            contract_id: contractData.contract_id,
            sender: contractData.sender,
            released: contractData.released,
            confirmed: contractData.confirmed,
            amount: contractData.amount,
            receiver: contractData.receiver,
            canceled: contractData.canceled,
        }
        dataStructure[key] = payment;
    }
    return dataStructure;
}
