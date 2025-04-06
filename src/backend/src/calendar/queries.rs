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
    // if caller() == Principal::anonymous() {
    //     return None;
    // }
    match Calendar::get_calendar(&calendar_id) {
        Ok(calendar) => Some(calendar),
        Err(_) => None
    }
}


#[query]
fn load_more_events(week_offset: i32) -> Vec<Event> {
    if caller() == Principal::anonymous() {
        return Vec::new();
    }

    match Calendar::get_calendar(&caller().to_text()) {
        Ok(calendar) => calendar.get_events_by_week(week_offset),
        Err(_) => Vec::new()
    }
}
