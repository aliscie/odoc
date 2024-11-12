use candid::{Nat, Principal};
use ic_cdk::api::call::CallResult;

pub async fn get_fee(ledger_id: Principal) -> CallResult<Nat> {
    let (fee,) = ic_cdk::call(ledger_id, "icrc1_fee", ()).await?;

    Ok(fee)
}
