import React, { useEffect } from 'react';

const GoogleCalendarButton = () => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAuthClick = () => {
    if (!window.google) return;
    
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          setIsConnected(true);
          listUpcomingEvents(tokenResponse.access_token);
        }
      },
      error_callback: (error) => {
        console.log('Error signing in', error);
      }
    });
    
    tokenClient.requestAccessToken();
  };

  const listUpcomingEvents = (accessToken: string) => {
    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      params: {
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Calendar events:', data.items);
    });
  };

  const createCalendarEvent = () => {
    if (!window.gapi) return;
  
    const event = {
      'summary': 'Weekend Hiking Trip',
      'location': 'Mount Tamalpais State Park, Mill Valley, CA 94941',
      'description': 'Join us for a 5-mile hike through the redwoods! Bring water and snacks.\n\nTrail details: https://example.com/hikes/mt-tam',
      'start': {
        'dateTime': '2023-11-18T09:00:00-08:00',
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': '2023-11-18T14:00:00-08:00',
        'timeZone': 'America/Los_Angeles'
      },
      'recurrence': [
        'RRULE:FREQ=WEEKLY;COUNT=5' // Repeat weekly for 5 weeks
      ],
      'attendees': [
        {'email': 'hiking-buddy1@example.com'},
        {'email': 'hiking-buddy2@example.com'}
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60}, // 1 day before
          {'method': 'popup', 'minutes': 60} // 1 hour before
        ]
      },
      'colorId': '5', // Green color for outdoor activities
      'guestsCanInviteOthers': false,
      'guestsCanModify': false,
      'guestsCanSeeOtherGuests': true
    };
  
    window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event,
      'sendUpdates': 'all' // Send notifications to all attendees
    }).then((response) => {
      console.log('Event created:', response.result);
      console.log('Event link:', response.result.htmlLink);
      console.log('Google Meet link:', response.result.hangoutLink);
      listUpcomingEvents();
    }).catch(err => {
      console.log('Error creating event', err);
    });
  };

  return (
    <div>
      <button onClick={handleAuthClick}>
        {isConnected ? 'Calendar Connected' : 'Connect Google Calendar'}
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