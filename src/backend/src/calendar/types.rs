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
    pub description: String,
    pub start_time: f64,
    pub end_time: f64,
    pub date: f64,
    pub created_by: String,
    pub attendees: Vec<String>,
    pub recurrence: Option<RecurrenceRule>,
    pub owner: String,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct Availability {
    pub id: String,
    pub title: Option<String>,
    pub schedule_type: ScheduleType,
    pub time_slots: Vec<TimeSlot>,
    pub is_blocked: bool,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub enum ScheduleType {
    DateRange {
        start_date: f64,
        end_date: f64,
    },
    WeeklyRecurring {
        days: Vec<u32>,
        valid_until: Option<f64>,
    },
    SpecificDates(Vec<f64>),
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct TimeSlot {
    pub start_time: u64,
    pub end_time: u64,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub struct RecurrenceRule {
    frequency: RecurrenceFrequency,
    interval: i32,
    until: Option<f64>,
    count: Option<i32>,
}

#[derive(Clone, Debug, Serialize, CandidType, Deserialize)]
pub enum RecurrenceFrequency {
    Daily,
    Weekly,
    Monthly,
    Yearly,
}

impl Calendar {
    pub const NANOS_PER_DAY: f64 = 86_400_000_000_000.0;
    const NANOS_PER_WEEK: f64 = Self::NANOS_PER_DAY * 7.0;

    pub fn get_day_of_week(timestamp: f64) -> u32 {
        let days_since_epoch = (timestamp / Self::NANOS_PER_DAY).floor();
        ((days_since_epoch as u32 + 3) % 7) as u32
    }

    pub fn get_time_of_day(timestamp: f64) -> u64 {
        (timestamp % Self::NANOS_PER_DAY) as u64
    }

    pub fn start_of_day(timestamp: f64) -> f64 {
        (timestamp / Self::NANOS_PER_DAY).floor() * Self::NANOS_PER_DAY
    }

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
        };
        calendar.save().unwrap();
        calendar
    }

    pub fn get_calendar(calendar_id: &str) -> Option<Self> {
        CALENDAR_STORE.with(|store| {
            let store = store.borrow();
            store.iter()
                .filter(|(_, calendar)| calendar.id == calendar_id)
                .map(|(_, calendar)| calendar.clone())
                .next()
        })
    }

    pub fn cleanup_old_events(&mut self) -> Calendar {
        let current_time = ic_cdk::api::time() as f64;
        self.events.retain(|event| {
            if let Some(recurrence) = &event.recurrence {
                if let Some(until) = recurrence.until {
                    until > current_time
                } else {
                    true
                }
            } else {
                event.end_time > current_time
            }
        });

        // Sort events chronologically
        self.events.sort_by(|a, b| a.start_time.partial_cmp(&b.start_time).unwrap());
        self.clone()
    }

    pub fn get_events_by_week(&self, page: i32) -> Vec<Event> {
        let current_time = ic_cdk::api::time() as f64;
        let start_of_today = Self::start_of_day(current_time);

        let (week_start, week_end) = if page >= 0 {
            (
                start_of_today + (Self::NANOS_PER_WEEK * page as f64),
                start_of_today + (Self::NANOS_PER_WEEK * (page + 1) as f64),
            )
        } else {
            (
                start_of_today + (Self::NANOS_PER_WEEK * (page - 1) as f64),
                start_of_today + (Self::NANOS_PER_WEEK * page as f64),
            )
        };

        self.events
            .iter()
            .filter(|event| {
                event.start_time >= week_start && event.start_time < week_end
            })
            .cloned()
            .collect()
    }

    pub fn get_next_seven_days_events(&self) -> Vec<Event> {
        self.get_events_by_week(0)
    }

    pub fn is_available(&self, start_time: f64, end_time: f64) -> bool {
        if !self.has_availability(start_time, end_time) {
            return false;
        }

        !self.has_event_conflict(start_time, end_time)
    }

    pub fn has_event_conflict(&self, start_time: f64, end_time: f64) -> bool {
        self.events.iter().any(|event| {
            start_time < event.end_time && end_time > event.start_time
        })
    }

    fn has_availability(&self, start_time: f64, end_time: f64) -> bool {
        self.availabilities.iter()
            .filter(|availability| !availability.is_blocked)
            .any(|availability| {
                match &availability.schedule_type {
                    ScheduleType::DateRange { start_date, end_date } => {
                        if start_time >= *start_date && end_time <= *end_date {
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
