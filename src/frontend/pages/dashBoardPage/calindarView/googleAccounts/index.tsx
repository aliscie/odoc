import React, { useEffect } from 'react';

import { useGoogleCalendar } from './useGoogleCalendar';
// Add to imports
import { Button, Badge, Avatar } from '@mui/material';
import GoogleCalendarLogo from '@mui/icons-material/Event';
import Tooltip from '@mui/material/Tooltip';

import { googleToODOC } from './eventConverter';
import { useDispatch, useSelector } from "react-redux";
import { all } from 'mathjs';
import { useBackendContext } from '@/contexts/BackendContext';

const GoogleCalendarButton = () => {

  const { backendActor } = useBackendContext();
  
  const { calendar } = useSelector((state: RootState) => state.calendarState);
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
    allowViewBusy,
    calendarId
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

      
        let res = await allowViewBusy();
        let all_events = []
        let events = await getEvents();
        
        const futureEvents = filterFutureEvents(events);
        all_events = futureEvents.map(event=>({...googleToODOC(event), created_by:calendar.owner}))
        const isMyCal = profile.id == calendar.owner;
        
        if (!isMyCal){          
          const busy = await getBusyEventsForUser(calendar.googleIds[0]);
          const serlizedBusy = busy.map(event => ({
            ...googleToODOC(event),
            created_by: calendar.owner
          }));

          all_events = all_events.concat(serlizedBusy)
        }
        
        dispatch({
          type: "SET_GOOGLE_CALENDAR",
          events: all_events
        });

        if (isMyCal&& !calendar.googleIds.includes(calendarId)){
          let res = await backendActor.add_google_calendar_id(calendar.id, [calendarId])
          if (res.Err){
            console.log({error_add_google_calendar_id: res.Err})
          }
        }
        

    };

    if (isConnected) {
      initialize();
    }
    
  }, [isConnected,calendar.owner,dispatch]); // Add dispatch to dependencies

  // const createCalendarEvent = async () => {
   
  //   const event = {
  //     'summary': 'Weekend Hiking Trip',
  //     'location': 'Mount Tamalpais State Park, Mill Valley, CA 94941',
  //     'description': 'Join us for a 5-mile hike through the redwoods! Bring water and snacks.\n\nTrail details: https://example.com/hikes/mt-tam',
  //     'start': {
  //       'dateTime': '2025-04-06T13:45:00+03:00',
  //       'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
  //     },
  //     'end': {
  //       'dateTime': '2025-04-06T14:15:00+03:00',
  //       'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
  //     },
  //     'recurrence': [
  //       'RRULE:FREQ=WEEKLY;COUNT=5'
  //     ],
  //     'attendees': [
  //       {'email': 'weplutus.1@gmail.com'},
  //       {'email': 'weplutus@gmail.com'}
  //     ],
  //     'reminders': {
  //       'useDefault': false,
  //       'overrides': [
  //         {'method': 'email', 'minutes': 24 * 60},
  //         {'method': 'popup', 'minutes': 60}
  //       ]
  //     },
  //     'colorId': '5',
  //     'guestsCanInviteOthers': false,
  //     'guestsCanModify': false,
  //     'guestsCanSeeOtherGuests': true
  //   };

  //   const createdEvent = await createEvents(event);
  //   if (createdEvent) {
  //     console.log('Event created:', createdEvent);
      
  //   }
  // };

  return (
    <div>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color={isConnected ? 'success' : 'error'}
        sx={{
          '& .MuiBadge-dot': {
            height: 12,
            width: 12,
            borderRadius: '50%',
            animation: isConnected ? 'pulse 2s infinite' : 'none',
          },
          '@keyframes pulse': {
            '0%': { transform: 'scale(0.95)', opacity: 1 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
            '100%': { transform: 'scale(0.95)', opacity: 1 },
          }
        }}
      >
        <Tooltip title={isConnected ? "Disconnect Google Calendar" : "Connect Google Calendar"}>
          <Button
            variant="contained"
            onClick={isConnected ? disConnectCalendar : connectCalendar}
            sx={{
              backgroundColor: isConnected ? '#4285F4' : '#DB4437',
              '&:hover': {
                backgroundColor: isConnected ? '#3367D6' : '#C1351D',
              },
              minWidth: '40px',
              padding: '8px'
            }}
          >
            <GoogleCalendarLogo sx={{ color: 'white', fontSize: '24px' }} />
          </Button>
        </Tooltip>
      </Badge>
    </div>
  );
};

export default GoogleCalendarButton;