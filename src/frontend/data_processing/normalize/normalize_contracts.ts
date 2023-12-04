import {PaymentContract, Share, SharesContract} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";

export function normalize_contracts(json) {
    const dataStructure = {};
    for (const [key, value] of json) {
        switch (Object.keys(value)[0]) {
            case "SharesContract":

                const shareContractData = value.SharesContract;

                let shares: Array<Share> = shareContractData.shares.map((s) => {
                    let share: Share = {
                        share_contract_id: s.share_contract_id,
                        accumulation: BigInt(s.accumulation),
                        conformed: s.conformed,
                        share: BigInt(s.share),
                        receiver: s.receiver,
                        contractor: s.contractor,
                    };
                    return share
                });
                let shares_contract: SharesContract = {
                    shares: shares,
                    payments: shareContractData.payments,
                    contract_id: shareContractData.contract_id,
                    shares_requests: shareContractData.shares_requests,
                    payment_options: shareContractData.payment_options
                };

                dataStructure[key] = shares_contract;
                break;
            case "PaymentContract":
                const paymentContractData = value.PaymentContract;
                let payment: PaymentContract = {
                    contract_id: paymentContractData.contract_id,
                    sender: paymentContractData.sender,
                    released: paymentContractData.released,
                    confirmed: paymentContractData.confirmed,
                    amount: paymentContractData.amount,
                    receiver: paymentContractData.receiver,
                    canceled: paymentContractData.canceled,
                }
                dataStructure[key] = payment;
                break;
            default:
                throw new Error("Unknown contract type")
                break;
        }

    }
    return dataStructure;
}
