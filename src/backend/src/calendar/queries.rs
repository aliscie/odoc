use candid::Principal;
use ic_cdk_macros::query;
use crate::calendar::{Calendar, Event};
use ic_cdk::caller;

#[query]
fn get_my_calendar() -> Calendar {
    match Calendar::get(&caller().to_text()) {
        Some(calendar) => calendar,
        None => Calendar::default()
    }
}

#[query]
fn get_calendar(calendar_id: String) -> Option<Calendar> {
    // if user is anonymous return error
    if caller() == Principal::anonymous() {
        return None;
    }
    Calendar::get_calendar(&calendar_id)
}


#[query]
fn load_more_events(week_offset: i32) -> Vec<Event> {
    // if user is anonymous return error
    if caller() == Principal::anonymous() {
        return Vec::new();
    }

    match Calendar::get(&caller().to_text()) {
        Some(calendar) => calendar.get_events_by_week(week_offset),
        None => Vec::new()
    }
}
