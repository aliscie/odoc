use std::collections::HashMap;
use std::fs::File;
use std::sync::atomic::Ordering;

use candid::{candid_method, Principal};
use ic_cdk::caller;
use ic_cdk_macros::update;
use serde::__private::de::Content;
//
// #[update]
// #[candid_method(update)]
// fn deposit_usdt() -> Result<(), String> {}
//
// #[update]
// #[candid_method(update)]
// fn withdraw_usdt() -> Result<(), String> {}