import {Principal} from "@dfinity/principal";
import {StoredContract} from "../../../declarations/user_canister/user_canister.did";

function denormalize_payment_contract(content: any[], data: Array<StoredContract> = []) {
    Object.keys(content).forEach((key) => {
        let item = content[key];
        let de_normal: StoredContract = {
            "PaymentContract": {
                "contract_id": item.contract_id,
                "sender": item.sender,
                "receiver": item.receiver,
                "released": item.released || false,
                "confirmed": item.confirmed || false,
                "canceled": item.canceled || false,
                "amount": BigInt(item.amount),
            }
        }
        data.push(de_normal)
    });

    return data;
}


export default denormalize_payment_contract;