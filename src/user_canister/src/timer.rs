use ic_cdk_timers::TimerId;
use std::{
    cell::RefCell,
    sync::atomic::{AtomicU64, Ordering},
    time::Duration,
};
use candid::candid_method;

thread_local! {
    static COUNTER: RefCell<u32> = RefCell::new(0);
    static TIMER_IDS: RefCell<Vec<TimerId>> = RefCell::new(Vec::new());
}
//
static INITIAL_CANISTER_BALANCE: AtomicU64 = AtomicU64::new(0);
static CYCLES_USED: AtomicU64 = AtomicU64::new(0);

//
fn periodic_task() {
    // Just increment the counter.
    COUNTER.with(|counter| {
        *counter.borrow_mut() += 1;
        ic_cdk::println!("Timer canister: Counter: {}", counter.borrow());
    });

    track_cycles_used();
}

//
fn track_cycles_used() {
    let current_canister_balance = ic_cdk::api::canister_balance();
    INITIAL_CANISTER_BALANCE.fetch_max(current_canister_balance, Ordering::Relaxed);
    let cycles_used = INITIAL_CANISTER_BALANCE.load(Ordering::Relaxed) - current_canister_balance;
    CYCLES_USED.store(cycles_used, Ordering::Relaxed);
}

#[ic_cdk_macros::query]
#[candid_method(query)]
fn counter() -> u32 {
    COUNTER.with(|counter| *counter.borrow())
}

#[ic_cdk_macros::update]
#[candid_method(update)]
fn start_with_interval_secs(secs: u64) {
    let secs = Duration::from_secs(secs);
    ic_cdk::println!("Timer canister: Starting a new timer with {secs:?} interval...");
    let timer_id = ic_cdk_timers::set_timer_interval(secs, periodic_task);
    TIMER_IDS.with(|timer_ids| timer_ids.borrow_mut().push(timer_id));
}

//
#[ic_cdk_macros::update]
#[candid_method(update)]
fn stop() {
    TIMER_IDS.with(|timer_ids| {
        if let Some(timer_id) = timer_ids.borrow_mut().pop() {
            ic_cdk::println!("Timer canister: Stopping timer ID {timer_id:?}...");
            ic_cdk_timers::clear_timer(timer_id);
        }
    });
}

#[ic_cdk_macros::query]
#[candid_method(update)]
fn cycles_used() -> u64 {
    CYCLES_USED.load(Ordering::Relaxed)
}

//
#[ic_cdk_macros::init]
fn init(min_interval_secs: u64) {
    start_with_interval_secs(min_interval_secs);
}

// #[ic_cdk_macros::post_upgrade]
// fn post_upgrade(min_interval_secs: u64) {
//     init(min_interval_secs);
// }