use candid::{CandidType, Nat, Principal};
use ic_cdk::api::call::CallResult;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum IcpResult<T, E> {
    #[allow(non_camel_case_types)]
    ok(T),
    #[allow(non_camel_case_types)]
    err(E),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum IcpSwapErr {
    CommonError,
    InternalError(String),
    UnsupportedToken(String),
    InsufficientFunds,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MetadataToken {
    pub address: String,
    pub standard: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct DepositFromArgs {
    pub token: String,
    pub fee: Nat,
    pub amount: Nat,
}

pub type DepositFromResult = IcpResult<Nat, IcpSwapErr>;

pub async fn deposit_from(
    pool_canister_id: Principal,
    args: DepositFromArgs,
) -> CallResult<DepositFromResult> {
    let (deposit_from_result,) = ic_cdk::call(pool_canister_id, "depositFrom", (args,)).await?;

    Ok(deposit_from_result)
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SwapArgs {
    #[serde(rename = "amountIn")]
    pub amount_in: String,
    #[serde(rename = "amountOutMinimum")]
    pub amount_out_minimum: String,
    #[serde(rename = "zeroForOne")]
    pub zero_for_one: bool,
}

pub type SwapResult = IcpResult<Nat, IcpSwapErr>;

pub async fn swap(pool_canister_id: Principal, args: SwapArgs) -> CallResult<SwapResult> {
    let (swap_result,) = ic_cdk::call(pool_canister_id, "swap", (args,)).await?;

    Ok(swap_result)
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct WithdrawArgs {
    pub token: String,
    pub fee: Nat,
    pub amount: Nat,
}

pub type WithdrawResult = IcpResult<Nat, IcpSwapErr>;

pub async fn withdraw(
    pool_canister_id: Principal,
    args: WithdrawArgs,
) -> CallResult<WithdrawResult> {
    let (withdraw_result,) = ic_cdk::call(pool_canister_id, "withdraw", (args,)).await?;

    Ok(withdraw_result)
}
