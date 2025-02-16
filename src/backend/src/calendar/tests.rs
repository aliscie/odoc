// #[cfg(test)]
// mod tests {
//     use super::*;
//     use ic_cdk::api::time;
//     use crate::calendar::*;
//
//     const NANOS_PER_SECOND: f64 = 1_000_000_000.0;
//     const NANOS_PER_MINUTE: f64 = NANOS_PER_SECOND * 60.0;
//     const NANOS_PER_HOUR: f64 = NANOS_PER_MINUTE * 60.0;
//     const NANOS_PER_DAY: f64 = NANOS_PER_HOUR * 24.0;
//
//     /// Helper struct to create timestamps in a human-friendly way
//     struct DateBuilder {
//         year: i32,
//         month: u32,
//         day: u32,
//         hour: u32,
//         minute: u32,
//         second: u32,
//     }
//
//     impl DateBuilder {
//         fn new(year: i32, month: u32, day: u32) -> Self {
//             Self {
//                 year,
//                 month,
//                 day,
//                 hour: 0,
//                 minute: 0,
//                 second: 0,
//             }
//         }
//
//         fn at(mut self, hour: u32, minute: u32) -> Self {
//             self.hour = hour;
//             self.minute = minute;
//             self
//         }
//
//         /// Converts to nanoseconds since Unix epoch
//         fn to_nanos(&self) -> f64 {
//             // Note: This is a simplified conversion for testing purposes
//             // In production, you'd want to use a proper date library or more accurate calculations
//
//             // Start with the year contribution
//             let mut days = (self.year - 1970) * 365;
//
//             // Add leap years (simplified)
//             days += ((self.year - 1969) / 4) as i32;
//
//             // Add days for months (simplified, not accounting for leap years)
//             let days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//             for month in 0..(self.month - 1) {
//                 days += days_in_month[month as usize];
//             }
//
//             // Add days
//             days += (self.day - 1) as i32;
//
//             // Convert everything to nanoseconds
//             let mut nanos = days as f64 * NANOS_PER_DAY;
//             nanos += self.hour as f64 * NANOS_PER_HOUR;
//             nanos += self.minute as f64 * NANOS_PER_MINUTE;
//             nanos += self.second as f64 * NANOS_PER_SECOND;
//
//             nanos
//         }
//     }
//
//     fn create_test_calendar() -> Calendar {
//         // Create a calendar with Monday-Thursday 9am-1pm availability
//         let calendar = Calendar {
//             owner: "test-user".to_string(),
//             id: "test-calendar".to_string(),
//             availabilities: vec![Availability {
//                 id: "weekly-availability".to_string(),
//                 title: Some("Weekday mornings".to_string()),
//                 schedule_type: ScheduleType::WeeklyRecurring {
//                     days: vec![0, 1, 2, 3],  // Monday = 0, Thursday = 3
//                     valid_until: None,
//                 },
//                 time_slots: vec![TimeSlot {
//                     start_time: 9 * NANOS_PER_HOUR as u64,  // 9 AM
//                     end_time: 13 * NANOS_PER_HOUR as u64,   // 1 PM
//                 }],
//             }],
//             events: Vec::new(),
//             blocked_times: Vec::new(),
//         };
//         calendar
//     }
//
//     #[test]
//     fn test_availability_and_events() {
//         let mut calendar = create_test_calendar();
//
//         // Test valid event (Monday 9:30 AM - 10:30 AM)
//         let monday_event_start = DateBuilder::new(2025, 2, 19)  // A Monday
//             .at(9, 30)
//             .to_nanos();
//
//         let monday_event_end = DateBuilder::new(2025, 2, 19)
//             .at(10, 30)
//             .to_nanos();
//
//         let valid_event = Event {
//             id: "valid-event".to_string(),
//             title: "Morning Meeting".to_string(),
//             description: Some("Team sync".to_string()),
//             start_time: monday_event_start,
//             end_time: monday_event_end,
//             created_by: "test-user".to_string(),
//             attendees: vec!["user1".to_string(), "user2".to_string()],
//             recurrence: None,
//         };
//
//         // Check if the time slot is available before adding the event
//         assert!(calendar.is_available(monday_event_start, monday_event_end),
//                 "Time slot should be available");
//
//         // Add the valid event
//         calendar.events.push(valid_event);
//
//         // Test invalid event (Friday 10:00 AM - 11:00 AM)
//         let friday_event_start = DateBuilder::new(2025, 2, 23)  // A Friday
//             .at(10, 0)
//             .to_nanos();
//
//         let friday_event_end = DateBuilder::new(2025, 2, 23)
//             .at(11, 0)
//             .to_nanos();
//
//         // Check if the Friday time slot is available
//         assert!(!calendar.is_available(friday_event_start, friday_event_end),
//                 "Friday time slot should not be available");
//
//         // Test invalid event (Monday 2:00 PM - 3:00 PM - outside available hours)
//         let monday_late_start = DateBuilder::new(2025, 2, 19)
//             .at(14, 0)  // 2 PM
//             .to_nanos();
//
//         let monday_late_end = DateBuilder::new(2025, 2, 19)
//             .at(15, 0)  // 3 PM
//             .to_nanos();
//
//         assert!(!calendar.is_available(monday_late_start, monday_late_end),
//                 "Time slot outside available hours should not be available");
//
//         // Verify that the original event still conflicts
//         assert!(!calendar.is_available(monday_event_start, monday_event_end),
//                 "Original event time slot should now be unavailable");
//     }
//
//     #[test]
//     fn test_day_of_week_calculation() {
//         let calendar = create_test_calendar();
//
//         // Test known dates
//         let monday = DateBuilder::new(2025, 2, 19).to_nanos();  // A Monday
//         assert_eq!(Calendar::get_day_of_week(monday), 0, "Should be Monday (0)");
//
//         let thursday = DateBuilder::new(2025, 2, 22).to_nanos();  // A Thursday
//         assert_eq!(Calendar::get_day_of_week(thursday), 3, "Should be Thursday (3)");
//
//         let friday = DateBuilder::new(2025, 2, 23).to_nanos();  // A Friday
//         assert_eq!(Calendar::get_day_of_week(friday), 4, "Should be Friday (4)");
//     }
//
//     #[test]
//     fn test_date_builder() {
//         // Test that our DateBuilder produces expected day of week results
//         let dates = [
//             (2025, 2, 19, 0),  // Wednesday
//             (2025, 2, 20, 1),  // Thursday
//             (2025, 2, 21, 2),  // Friday
//             (2025, 2, 22, 3),  // Saturday
//             (2025, 2, 23, 4),  // Sunday
//             (2025, 2, 24, 5),  // Monday
//             (2025, 2, 25, 6),  // Tuesday
//         ];
//
//         for (year, month, day, expected_dow) in dates {
//             let timestamp = DateBuilder::new(year, month, day).to_nanos();
//             assert_eq!(
//                 Calendar::get_day_of_week(timestamp),
//                 expected_dow,
//                 "Incorrect day of week for {}-{}-{}",
//                 year,
//                 month,
//                 day
//             );
//         }
//     }
// }
