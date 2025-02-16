use std::borrow::Cow;
use serde::{Serialize};
use candid::{CandidType, Decode, Encode, Deserialize};
use ic_cdk::{caller};
use ic_stable_structures::{storable::Bound, StableBTreeMap, Storable};
use crate::CALENDAR_STORE;

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct Calendar {
    pub id: String,
    pub owner: String,
    pub availabilities: Vec<Availability>,
    pub events: Vec<Event>,
    pub blocked_times: Vec<BlockedTime>,
}

impl Storable for Calendar {
    fn to_bytes(&self) -> Cow<[u8]> {
        if let Ok(bytes) = Encode!(self) {
            return Cow::Owned(bytes);
        }
        Cow::Borrowed(&[])
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct Event {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub start_time: f64,
    // nanoseconds since Unix epoch
    pub end_time: f64,
    // nanoseconds since Unix epoch
    pub created_by: String,
    pub attendees: Vec<String>,
    pub recurrence: Option<RecurrenceRule>,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct Availability {
    pub id: String,
    pub title: Option<String>,
    pub schedule_type: ScheduleType,
    pub time_slots: Vec<TimeSlot>,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub enum ScheduleType {
    // Single date range (e.g., available March 1-15)
    DateRange {
        start_date: f64,
        // nanoseconds since Unix epoch
        end_date: f64,    // nanoseconds since Unix epoch
    },
    // Weekly recurring (e.g., every Monday and Wednesday)
    WeeklyRecurring {
        days: Vec<u32>,
        // 0 = Monday, 6 = Sunday
        valid_until: Option<f64>,  // nanoseconds since Unix epoch
    },
    // Specific dates (e.g., available on March 1, 5, and 10)
    SpecificDates(Vec<f64>),  // vector of nanoseconds since Unix epoch
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct TimeSlot {
    pub start_time: u64,
    // nanoseconds since midnight
    pub end_time: u64,    // nanoseconds since midnight
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct BlockedTime {
    id: String,
    reason: Option<String>,
    block_type: BlockType,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub enum BlockType {
    // Single time block (e.g., unavailable tomorrow)
    SingleBlock {
        start_time: f64,
        // nanoseconds since Unix epoch
        end_time: f64,    // nanoseconds since Unix epoch
    },
    // Recurring weekly block (e.g., unavailable every Monday)
    WeeklyBlock {
        day: u32,
        // 0 = Monday, 6 = Sunday
        start_time: u64,
        // nanoseconds since midnight
        end_time: u64,
        // nanoseconds since midnight
        valid_until: Option<f64>,  // nanoseconds since Unix epoch
    },
    // Full day block (e.g., unavailable all day tomorrow)
    FullDayBlock {
        date: f64,  // nanoseconds since Unix epoch
    },
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct RecurrenceRule {
    frequency: RecurrenceFrequency,
    interval: i32,
    until: Option<f64>,
    // nanoseconds since Unix epoch
    count: Option<i32>,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub enum RecurrenceFrequency {
    Daily,
    Weekly,
    Monthly,
    Yearly,
}

// Helper functions for time calculations
impl Calendar {
    const NANOS_PER_DAY: f64 = 86_400_000_000_000.0;
    const NANOS_PER_WEEK: f64 = Self::NANOS_PER_DAY * 7.0;

    pub fn get_day_of_week(timestamp: f64) -> u32 {
        // Convert nanoseconds to days since epoch
        let days_since_epoch = (timestamp / Self::NANOS_PER_DAY).floor();
        // January 1, 1970 was a Thursday (4)
        // Add 3 to shift so 0 = Monday
        ((days_since_epoch as u32 + 3) % 7) as u32
    }

    pub fn get_time_of_day(timestamp: f64) -> u64 {
        (timestamp % Self::NANOS_PER_DAY) as u64
    }

    pub fn start_of_day(timestamp: f64) -> f64 {
        (timestamp / Self::NANOS_PER_DAY).floor() * Self::NANOS_PER_DAY
    }
}

// Implementation methods for checking availability
impl Calendar {
    pub fn save(&self) -> Result<(), String> {
        CALENDAR_STORE.with(|store| {
            let mut store = store.borrow_mut();
            store.insert(self.id.clone(), self.clone());
            Ok(())
        })
    }
    pub fn default() -> Self {
        Calendar {
            id: ic_cdk::api::time().to_string(),
            owner: caller().to_text(),
            availabilities: Vec::new(),
            events: Vec::new(),
            blocked_times: Vec::new(),
        }
    }
    pub fn get(user_id: &String) -> Option<Self> {
        CALENDAR_STORE.with(|store| {
            let store = store.borrow();
            store.get(user_id)
        })
    }

    pub fn new(calendar_id: &String) -> Self {
        let calendar = Calendar {
            id: calendar_id.clone(),
            owner: caller().to_text(),
            availabilities: Vec::new(),
            events: Vec::new(),
            blocked_times: Vec::new(),
        };
        calendar.save();
        calendar
    }


    pub fn get_calendar(user_id: &str) -> Option<Self> {
        CALENDAR_STORE.with(|store| {
            let store = store.borrow();
            store.iter()
                .filter(|(_, calendar)| calendar.id == user_id)
                .map(|(_, calendar)| calendar.clone())
                .next()
        })
    }

    pub fn cleanup_old_events(&mut self) -> Calendar {
        let current_time = ic_cdk::api::time() as f64;

        // Remove events that ended before now
        self.events.retain(|event| {
            // Keep event if it's recurring or if it hasn't ended yet
            if let Some(recurrence) = &event.recurrence {
                // For recurring events, check if the recurrence hasn't ended yet
                if let Some(until) = recurrence.until {
                    until > current_time
                } else {
                    // If no end date specified for recurrence, keep the event
                    true
                }
            } else {
                // For non-recurring events, keep if it hasn't ended yet
                event.end_time > current_time
            }
        });

        self.clone()
    }


    /// Checks if a given time slot is available
    pub fn is_available(&self, start_time: f64, end_time: f64) -> bool {
        // Check if time conflicts with any existing events
        if self.has_event_conflict(start_time, end_time) {
            return false;
        }

        // Check if time is blocked
        if self.is_blocked(start_time, end_time) {
            return false;
        }

        // Check if time falls within any availability windows
        self.has_availability(start_time, end_time)
    }

    /// Returns all available time slots for a given date range
    // pub fn get_available_slots(&self, start_date: f64, end_date: f64) -> Vec<TimeSlot> {
    //     // Implementation would combine availabilities, subtract events and blocked times
    //     // This is a complex algorithm that would need to handle all the different types
    //     // of availabilities and blocked times
    //     todo!()
    // }

    pub fn has_event_conflict(&self, start_time: f64, end_time: f64) -> bool {
        self.events.iter().any(|event| {
            // Check for overlap with existing events
            // Also need to check recurring events
            (start_time < event.end_time && end_time > event.start_time)
        })
    }

    pub fn is_blocked(&self, start_time: f64, end_time: f64) -> bool {
        self.blocked_times.iter().any(|block| {
            match &block.block_type {
                BlockType::SingleBlock { start_time: block_start, end_time: block_end } => {
                    start_time < *block_end && end_time > *block_start
                }
                BlockType::WeeklyBlock { day, start_time: block_start, end_time: block_end, valid_until } => {
                    // Check if any day in the range matches the blocked weekday
                    let mut current_time = start_time;
                    while current_time < end_time {
                        if Self::get_day_of_week(current_time) == *day {
                            let time_of_day = Self::get_time_of_day(current_time);
                            if time_of_day >= *block_start && time_of_day <= *block_end {
                                if let Some(valid_until) = valid_until {
                                    if current_time <= *valid_until {
                                        return true;
                                    }
                                } else {
                                    return true;
                                }
                            }
                        }
                        current_time += Self::NANOS_PER_DAY;
                    }
                    false
                }
                BlockType::FullDayBlock { date } => {
                    // Check if any part of the time range falls on the blocked date
                    let blocked_start = Self::start_of_day(*date);
                    let blocked_end = blocked_start + Self::NANOS_PER_DAY;
                    start_time < blocked_end && end_time > blocked_start
                }
            }
        })
    }

    fn has_availability(&self, start_time: f64, end_time: f64) -> bool {
        self.availabilities.iter().any(|availability| {
            match &availability.schedule_type {
                ScheduleType::DateRange { start_date, end_date } => {
                    // Check if time falls within the date range
                    if start_time >= *start_date && end_time <= *end_date {
                        // Check if time falls within any of the time slots
                        let time_of_day = Self::get_time_of_day(start_time);
                        availability.time_slots.iter().any(|slot| {
                            time_of_day >= slot.start_time && time_of_day <= slot.end_time
                        })
                    } else {
                        false
                    }
                }
                ScheduleType::WeeklyRecurring { days, valid_until } => {
                    let day = Self::get_day_of_week(start_time);
                    if days.contains(&day) {
                        if let Some(until) = valid_until {
                            if start_time > *until {
                                return false;
                            }
                        }
                        let time_of_day = Self::get_time_of_day(start_time);
                        availability.time_slots.iter().any(|slot| {
                            time_of_day >= slot.start_time && time_of_day <= slot.end_time
                        })
                    } else {
                        false
                    }
                }
                ScheduleType::SpecificDates(dates) => {
                    dates.iter().any(|date| {
                        let day_start = Self::start_of_day(*date);
                        let day_end = day_start + Self::NANOS_PER_DAY;
                        if start_time >= day_start && end_time <= day_end {
                            let time_of_day = Self::get_time_of_day(start_time);
                            availability.time_slots.iter().any(|slot| {
                                time_of_day >= slot.start_time && time_of_day <= slot.end_time
                            })
                        } else {
                            false
                        }
                    })
                }
            }
        })
    }
}
