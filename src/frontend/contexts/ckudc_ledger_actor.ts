import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import {
  _SERVICE,
  Account,
} from "../../declarations/ckusdc_ledger/ckusdc_ledger.did";
import { canisterId, idlFactory } from "../../declarations/ckusdc_ledger";
import { Principal } from "@dfinity/principal";

async function getLedgerActor(agent) {
  // let host = "https://ic0.app";
  // if (import.meta.env.VITE_DFX_NETWORK === "local") {
  //   host = import.meta.env.VITE_IC_HOST;
  // }

  // const client = await AuthClient.create();
  // const identity = await client.getIdentity();
  // const agent = new HttpAgent({
  //   identity,
  //   host,
  // });
  // const principal = identity.getPrincipal().toString();

  // ---------------------- root key fetch ---------------------- \\
  if (import.meta.env.VITE_DFX_NETWORK === "local") {
    agent
      .fetchRootKey()
      .then((rootKey) => {
        console.log("successfully fetched root key: ");
      })
      .catch((err) => {
        console.log("Error fetching root key: ", err);
      });
  }
  const ckusdc_ledger: _SERVICE = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });
  return ckusdc_ledger;
  // let ac: Account = {
  //     owner: Principal.fromText(profile.id),
  //     subaccount: [],
  // };
  // let res = await ckusdc_ledger.icrc1_balance_of(ac);
  // console.log("Your balance is:", Number(res));
}
export default getLedgerActor;
