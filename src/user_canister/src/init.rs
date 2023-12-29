use std::sync::atomic::Ordering;
use crate::files::COUNTER;
// use crate::files::COUNTER;
use crate::timer::init_timers;
use crate::websocket::init_websocket;

#[ic_cdk::init]
fn init() {
    init_websocket();
    // init_timers()
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    init_websocket();
    // init_timers(1 as u64)
}