import React, { useEffect } from 'react';

import { useGoogleCalendar } from '../../../../hooks/useGoogleCalendar';
// Add to imports

import { googleToODOC } from './eventConverter';
import { useDispatch, useSelector } from "react-redux";

const GoogleCalendarButton = () => {
  // Add this line with other hooks
  const dispatch = useDispatch();
  const { profile } = useSelector((state: any) => state.filesState);
  const {
    createEvents,
    connectCalendar,
    disConnectCalendar,
    isConnected,
    getEvents,
    getBusyEventsForUser,
    allowViewBusy
  } = useGoogleCalendar();

  const filterFutureEvents = (events: any[]) => {
    const now = new Date();
    return events.filter(event => {
      
      const eventStart = new Date(event.start.dateTime || event.start.date);
      return eventStart >= now;
    });
  };

  // Example usage in useEffect
  useEffect(() => {
    const initialize = async () => {
      if (isConnected) {
        let res = await allowViewBusy();
        
        let events = await getEvents();
        const futureEvents = filterFutureEvents(events);
        dispatch({
          type: "SET_GOOGLE_CALENDAR",
          events: futureEvents.map(event=>googleToODOC(event))
        });
      } else {
        const busy = await getBusyEventsForUser("weplutus@gmila.com");
        console.log({busy })
        dispatch({
          type: "SET_GOOGLE_CALENDAR",
          events: busy
        });
      }
    };
    initialize();
  }, [isConnected]); // Add dispatch to dependencies

  const createCalendarEvent = async () => {
    const event = {
      'summary': 'Weekend Hiking Trip',
      'location': 'Mount Tamalpais State Park, Mill Valley, CA 94941',
      'description': 'Join us for a 5-mile hike through the redwoods! Bring water and snacks.\n\nTrail details: https://example.com/hikes/mt-tam',
      'start': {
        'dateTime': '2025-04-06T13:45:00+03:00',
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': '2025-04-06T14:15:00+03:00',
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'recurrence': [
        'RRULE:FREQ=WEEKLY;COUNT=5'
      ],
      'attendees': [
        {'email': 'weplutus.1@gmail.com'},
        {'email': 'weplutus@gmail.com'}
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 60}
        ]
      },
      'colorId': '5',
      'guestsCanInviteOthers': false,
      'guestsCanModify': false,
      'guestsCanSeeOtherGuests': true
    };

    const createdEvent = await createEvents(event);
    if (createdEvent) {
      console.log('Event created:', createdEvent);
      
    }
  };

  return (
    <div>
      <button onClick={isConnected ? disConnectCalendar : connectCalendar}>
        {isConnected ? 'Disconnect Calendar' : 'Connect Google Calendar'}
      </button>
      <button 
        onClick={createCalendarEvent} 
        style={{ marginLeft: '10px' }}
        disabled={!isConnected}
      >
        Create Hiking Event
      </button>
    </div>
  );
};

export default GoogleCalendarButton;