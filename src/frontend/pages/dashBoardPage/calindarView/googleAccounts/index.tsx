import React, { useEffect, useState } from 'react';

const GoogleCalendarButton = () => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('googleCalendarToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsConnected(true);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isConnected && accessToken) {
      listUpcomingEvents(accessToken);
    }
  }, [isConnected, accessToken]);

  const handleAuthClick = () => {
    if (!window.google) return;
    
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse?.access_token) {
          localStorage.setItem('googleCalendarToken', tokenResponse.access_token);
          setAccessToken(tokenResponse.access_token);
          setIsConnected(true);
        }
      },
      error_callback: (error) => {
        console.error('Error signing in', error);
        handleDisconnect();
      }
    });
    
    tokenClient.requestAccessToken();
  };

  const handleDisconnect = () => {
    localStorage.removeItem('googleCalendarToken');
    setAccessToken('');
    setIsConnected(false);
  };

  const listUpcomingEvents = (token: string) => {
    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        'Authorization': `Bearer ${token}`,
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
    })
    .catch(err => {
      console.error('Error fetching events', err);
      handleDisconnect();
    });
  };

  const createCalendarEvent = () => {
    if (!accessToken) return;

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
  
    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Event created:', data);
      listUpcomingEvents(accessToken);
    })
    .catch(err => {
      console.error('Error creating event', err);
      handleDisconnect();
    });
  };

  return (
    <div>
      <button onClick={isConnected ? handleDisconnect : handleAuthClick}>
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