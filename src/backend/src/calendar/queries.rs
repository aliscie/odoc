use ic_cdk_macros::query;
use crate::calendar::Calendar;
use ic_cdk::caller;


#[query]
fn get_my_calendar() -> Calendar {
    let mut c = Calendar::get(&caller().to_text());
    if let Some(mut calendar) = c {
        calendar = calendar.cleanup_old_events();
        return calendar;
    }
    Calendar::default()
}
