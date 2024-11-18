use b3_utils::{vec_to_hex_string_with_0x, Subaccount};
use candid::Principal;
use ic_cdk::caller;
use ic_cdk_macros::query;
use ic_cdk_macros::update;

use crate::{CPayment, ExchangeType, PaymentStatus, Wallet};
