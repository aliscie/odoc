import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGoogleCalendar } from '../../../../hooks/useGoogleCalendar';

const GoogleCalendarButton = () => {
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

  // Example usage in useEffect
  useEffect(() => {
    const initialize = async () => {
      const busySlots = await getBusyEventsForUser('weplutus@gmail.com');
      console.log({busySlots})


      
      if (isConnected) {
        let res  = await allowViewBusy();
        let events = await getEvents();
      console.log({res,events})
      }
    };
    initialize();
  }, [isConnected]);

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