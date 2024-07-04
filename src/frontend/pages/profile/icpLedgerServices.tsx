import { get_identity } from "../../backend_connect/ic_agent";
import { createAgent } from "@dfinity/utils";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
class icpLedgerService {
    ledger: LedgerCanister | null;
    constructor() {
        this.ledger = null;
    }
    async init() {
        const identity = await get_identity();
        const HOST = import.meta.env.VITE_DFX_NETWORK === 'local' ? import.meta.env.VITE_IC_HOST : "https://icp-api.io";

        if (identity != null) {
            const agent = await createAgent({
                identity: identity,
                host: HOST,
            });

            this.ledger = LedgerCanister.create({ agent });
        }
    }

    async getBalance(pid: string) {
        const accountIdentifier = AccountIdentifier.fromPrincipal({ principal: Principal.fromText(pid) });
        let balance = await this.ledger?.accountBalance({ accountIdentifier, certified: false });
        let formatedBbalance = Number(balance) / 100000000;
        return formatedBbalance;
    }

    transferIcp(pid:Principal,amount: number) {
        let res = this.ledger?.icrc1Transfer({
            to: {
                owner : pid,
                subaccount : [],
            },
            amount: BigInt(Math.floor(amount * 100000000)),
            fee: BigInt(10000),
            createdAt: BigInt(Date.now() * 1000000), // Nanoseconds since unix epoc to trigger deduplication 
        });
        return res;
    }
}

const icpLedger = new icpLedgerService();
export default icpLedger;