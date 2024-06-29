use std::sync::atomic::{AtomicU64, Ordering};
use crate::COUNTER;

// static COUNTER: AtomicU64 = AtomicU64::new(0);

#[ic_cdk::query]
fn counter() -> u64 {
    COUNTER.load(Ordering::Relaxed)
}


// #[ic_cdk::init]
pub fn init_timers() {
    let timer_interval_secs = 1_u64;
    let interval = std::time::Duration::from_secs(timer_interval_secs);
    ic_cdk::println!("Starting a periodic task with interval {interval:?}");
    ic_cdk_timers::set_timer_interval(interval, || {
        COUNTER.fetch_add(1, Ordering::Relaxed);
    });
}


// #[ic_cdk::post_upgrade]
// fn post_upgrade_timers(timer_interval_secs: u64) {
//     init_timers(timer_interval_secs)
// }