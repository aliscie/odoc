import {
    PaymentContract,
    Share,
    SharePaymentOption, ShareRequest,
    SharesContract,
    StoredContract
} from "../../../declarations/user_canister/user_canister.did";
import {logger} from "../../dev_utils/log_data";
import {Principal} from "@dfinity/principal";

// function detectContractType(data: any): StoredContract | null {
//     if ('contract_id' in data && 'sender' in data && 'receiver' in data && 'amount' in data) {
//         return {'PaymentContract': data as PaymentContract};
//     } else if ('contract_id' in data && 'shares' in data && 'payments' in data && 'shares_requests' in data) {
//         return {'SharesContract': data as SharesContract};
//     } else {
//         return null;
//     }
// }

function detectContractType(data: any): string | null {
    let keys = Object.keys(data);
    let payment_keys = ['canceled', 'contract_id', 'sender', 'released', 'confirmed', 'amount', 'receiver'];

    let shares_contract_keys = ["shares", "payments", "contract_id", "shares_requests"];

    if (payment_keys.every(key => keys.includes(key))) {
        return 'PaymentContract';
    }

    if (shares_contract_keys.every(key => keys.includes(key))) {
        return "SharesContract";
    }

    return null;
}


export default function denormalize_payment_contract(content: any[], data: Array<StoredContract> = []): Array<StoredContract> {
    Object.keys(content).forEach((key) => {
        let item = content[key];
        let contract_type: string | null = detectContractType(item);
        switch (contract_type) {
            case "PaymentContract":
                let de_normal: StoredContract = {
                    "PaymentContract": {
                        "contract_id": item.contract_id,
                        "sender": item.sender,
                        "receiver": item.receiver,
                        "released": item.released || false,
                        "confirmed": item.confirmed || false,
                        "canceled": item.canceled || false,
                        "amount": BigInt(item.amount || 0),
                    }
                };
                data.push(de_normal);
                break;

            case "SharesContract":
                let shares: Array<Share> = [];
                for (let s of item.shares) {
                    let share: Share = {
                        'share_contract_id': s.share_contract_id,
                        'accumulation': BigInt(s.accumulation),
                        'confirmed': s.confirmed,
                        'share': BigInt(s.share),
                        'receiver': s.receiver,
                    }
                    shares.push(share);
                }
                let payment_options: Array<SharePaymentOption> = item.payment_options.map((option) => {
                    let payment_option: SharePaymentOption = {
                        'id': String(option.id),
                        'title': String(option.title),
                        'date': String(option.date), // Json stringed data
                        'description': String(option.description),
                        'amount': BigInt(option.amount),
                    };
                    return payment_option;
                })
                let shares_requests: Array<[string, ShareRequest]> = item.shares_requests.map((req: ShareRequest) => {
                    // let x = {
                    //     "req": ["lxmaj4", {
                    //         "id": "lux3jn",
                    //         "requester": {"__principal__": "xy2x6-ab3cb-gtl4h-7zqk5-sdyua-q4avf-37cya-dcrl4-o37zu-jgyyr-uae"},
                    //         "shares": [{
                    //             "share_contract_id": "lxmaj4",
                    //             "accumulation": "0",
                    //             "share": "100",
                    //             "confirmed": false,
                    //             "receiver": {"__principal__": "2vxsx-fae"}
                    //         }],
                    //         "is_applied": false,
                    //         "name": "name",
                    //         "approvals": []
                    //     }]
                    // }
                    // logger({req})
                    // let shares_req: ShareRequest = {
                    //     // 'id': string,
                    //     // 'requester': Principal,
                    //     // 'shares': Array < Share >,
                    //     // 'is_applied': boolean,
                    //     // 'name': string,
                    //     // 'approvals': Array < Principal >,
                    // }
                    return [req[1].id, req[1]]
                });

                let de_normal_share_contract: StoredContract = {
                    "SharesContract": {
                        "shares": shares,
                        "payments": item.payments,
                        "shares_requests": shares_requests,
                        "contract_id": item.contract_id,
                        "payment_options": payment_options,
                    }
                };
                data.push(de_normal_share_contract);
                break;

            default:
                // Handle the case where contract_type is neither "PaymentContract" nor "SharesContract"
                break;
        }
    });

    return data
}
