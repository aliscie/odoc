use b3_utils::{vec_to_hex_string_with_0x, Subaccount};
use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::update;
use ic_cdk_macros::query;

use crate::{CPayment, ExchangeType, PaymentStatus, Wallet};


#[query]
fn deposit_principal() -> String {
    let principal = Principal::from_text(caller().to_string()).unwrap();
    let sub_account = Subaccount::from_principal(principal);

    let bytes32 = sub_account.to_bytes32().unwrap();

    vec_to_hex_string_with_0x(bytes32)
}
