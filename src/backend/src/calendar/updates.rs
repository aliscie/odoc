// use crate::websocket::{AppMessage, Notification};
use ic_cdk_macros::update;
use crate::calendar::{Availability, Calendar, Event, ScheduleType};
use ic_cdk::caller;
use serde::{Serialize};
use candid::{CandidType, Decode, Encode, Deserialize, Principal};

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct CalendarActions {
    pub events: Vec<Event>,
    pub availabilities: Vec<Availability>,
    pub delete_events: Vec<String>,
    pub delete_availabilities: Vec<String>,
}


impl Calendar {
    fn check_availability_permissions(&self, caller_id: &str, actions: &CalendarActions) -> Result<(), String> {
        if (!actions.availabilities.is_empty() || !actions.delete_availabilities.is_empty())
            && caller_id != self.owner {
            return Err("Only calendar owner can manage availabilities".to_string());
        }
        Ok(())
    }

    fn check_event_update_permission(&self, caller_id: &str, event_id: &str) -> Result<(), String> {
        if let Some(existing_event) = self.events.iter().find(|e| e.id == event_id) {
            if caller_id != self.owner && caller_id != existing_event.created_by {
                return Err(format!("You don't have permission to update this event"));
            }
        }
        Ok(())
    }

    fn check_event_conflicts(&self, new_event: &Event) -> Result<(), String> {
        let has_conflict = self.events.iter()
            .filter(|e| e.id != new_event.id)
            .any(|e| new_event.start_time < e.end_time && new_event.end_time > e.start_time);

        if has_conflict {
            return Err(format!("Event '{}' conflicts with an existing event", new_event.title));
        }
        Ok(())
    }

    fn check_blocked_time_overlap(&self, new_event: &Event) -> Result<(), String> {
        let overlaps_blocked = self.availabilities.iter()
            .filter(|a| a.is_blocked)
            .any(|a| self.time_overlaps_availability(new_event.start_time, new_event.end_time, a));

        if overlaps_blocked {
            return Err(format!("Event '{}' overlaps with a blocked time period", new_event.title));
        }
        Ok(())
    }

    fn time_overlaps_availability(&self, start_time: f64, end_time: f64, availability: &Availability) -> bool {
        match &availability.schedule_type {
            ScheduleType::DateRange { start_date, end_date } => {
                start_time < *end_date && end_time > *start_date
            }
            ScheduleType::WeeklyRecurring { days, valid_until } => {
                let event_day = Self::get_day_of_week(start_time);
                days.contains(&event_day) && match valid_until {
                    Some(until) => start_time <= *until,
                    None => true
                }
            }
            ScheduleType::SpecificDates(dates) => {
                dates.iter().any(|date| {
                    let day_start = Self::start_of_day(*date);
                    let day_end = day_start + Self::NANOS_PER_DAY;
                    start_time < day_end && end_time > day_start
                })
            }
        }
    }

    fn check_event_permissions_and_availability(&self, new_event: &Event, caller_id: &str) -> Result<(), String> {
        // Permission check
        if caller_id != self.owner {
            if !new_event.id.is_empty() {
                // For existing events, check if caller is creator
                if let Some(existing) = self.events.iter().find(|e| e.id == new_event.id) {
                    if caller_id != existing.created_by {
                        return Err("No permission to update this event".to_string());
                    }
                }
            }
        }

        // Conflict check
        if self.events.iter()
            .filter(|e| e.id != new_event.id)
            .any(|e| new_event.start_time < e.end_time && new_event.end_time > e.start_time) {
            return Err("Event conflicts with existing events".to_string());
        }

        // Availability check
        let mut has_valid_slot = false;
        for avail in &self.availabilities {
            let overlaps = match &avail.schedule_type {
                ScheduleType::DateRange { start_date, end_date } => {
                    new_event.start_time < *end_date && new_event.end_time > *start_date
                }
                ScheduleType::WeeklyRecurring { days, valid_until } => {
                    let event_day = Self::get_day_of_week(new_event.start_time);
                    days.contains(&event_day) &&
                        valid_until.map_or(true, |until| new_event.start_time <= until)
                }
                ScheduleType::SpecificDates(dates) => {
                    dates.iter().any(|date| {
                        let day_start = Self::start_of_day(*date);
                        let day_end = day_start + Self::NANOS_PER_DAY;
                        new_event.start_time < day_end && new_event.end_time > day_start
                    })
                }
            };

            if overlaps {
                if avail.is_blocked {
                    return Err("Event overlaps with blocked time".to_string());
                }
                has_valid_slot = true;
            }
        }

        if !self.availabilities.is_empty() && !has_valid_slot {
            return Err("Event must be within available time slots".to_string());
        }

        Ok(())
    }


    fn update_events(&mut self, events: Vec<Event>, caller_id: &str) -> Result<(), String> {
        for mut event in events {
            self.check_event_permissions_and_availability(&event, caller_id)?;

            if event.created_by.is_empty() {
                event.created_by = caller_id.to_string();
            }

            if let Some(idx) = self.events.iter().position(|e| e.id == event.id) {
                self.events[idx] = event;
            } else {
                event.created_by = caller_id.to_string();
                self.events.push(event);
            }
        }
        Ok(())
    }


    fn delete_events(&mut self, event_ids: &[String], caller_id: &str) -> Result<(), String> {
        for event_id in event_ids {
            self.check_event_update_permission(caller_id, event_id)?;
        }
        self.events.retain(|event| !event_ids.contains(&event.id));
        Ok(())
    }

    fn update_availabilities(&mut self, availabilities: Vec<Availability>) {
        for new_availability in availabilities {
            if let Some(index) = self.availabilities.iter().position(|a| a.id == new_availability.id) {
                self.availabilities[index] = new_availability;
            } else {
                self.availabilities.push(new_availability);
            }
        }
    }
}

#[update]
fn update_calendar(calendar_id: String, actions: CalendarActions) -> Result<Calendar, String> {
    // Owner has full permissions
    // Non-owners can only update events they created
    // Events can't overlap with other events
    // Events can't overlap with blocked availability periods
    // Events must fall within available time slots if any exist

    // if user is anonymous return error
    if caller() == Principal::anonymous() {
        return Err("Unauthorized".to_string());
    }

    let caller_id = caller().to_text();
    let mut calendar = match Calendar::get_calendar(&calendar_id) {
        Some(cal) => cal,
        None => return Err("Calendar not found".to_string()),
    };


    // Check permissions for availability management
    calendar.check_availability_permissions(&caller_id, &actions)?;

    // Handle events
    calendar.update_events(actions.events, &caller_id)?;
    calendar.delete_events(&actions.delete_events, &caller_id)?;

    // Handle availabilities (only if user is owner, already checked in check_availability_permissions)
    if caller_id == calendar.owner {
        calendar.update_availabilities(actions.availabilities);
        calendar.availabilities.retain(|availability|
            !actions.delete_availabilities.contains(&availability.id)
        );
    }

    // Sort events chronologically
    calendar.events.sort_by(|a, b| a.start_time.partial_cmp(&b.start_time).unwrap());

    // Save changes
    match calendar.save() {
        Ok(_) => Ok(calendar),
        Err(e) => Err(format!("Failed to save calendar: {}", e)),
    }
}
