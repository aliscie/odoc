// use crate::websocket::{AppMessage, Notification};
use ic_cdk_macros::update;
use crate::calendar::{Calendar, Event};
use ic_cdk::caller;


#[update]
fn save_calendar(mut calendar: Calendar) -> Result<Calendar, String> {
    if calendar.owner != caller().to_text() {
        return Err("You are not the owner of this calendar".to_string());
    }
    // calendar.owner = caller().to_string();
    // calendar.id = ic_cdk::api::time().to_string();
    let mut c = Calendar::get(&caller().to_text());
    if c.is_none() {
        calendar.id = ic_cdk::api::time().to_string();
        calendar.save();
        return Ok(calendar);
    }
    // TODO  keep old events
    // handle other cases
    calendar.save();
    return Ok(calendar);
}


#[update]
fn add_event_calendar(calendar_id: String, mut events: Vec<Event>) -> Result<Calendar, String> {
    let mut c = Calendar::get_calendar(&calendar_id);
    if c.is_none() {
        return Err("Calendar not found".to_string());
    }
    let mut calendar = c.unwrap();
    for event in events.iter_mut() {
        event.id = ic_cdk::api::time().to_string();
    }
    // check events not overlaying with others and not in blocked and is withing availabilities
    // is_available
    // has_event_conflict
    // is_blocked
    for event in events.iter() {
        if !calendar.is_available(event.start_time, event.end_time) {
            return Err("Event is not within availabilities".to_string());
        }
        if calendar.has_event_conflict(event.start_time, event.end_time) {
            return Err("Event is conflicting with other events".to_string());
        }
        if calendar.is_blocked(event.start_time, event.end_time) {
            return Err("Event is within blocked time".to_string());
        }
    }
    calendar.events.extend(events);
    calendar.save();
    Ok(calendar)
}
