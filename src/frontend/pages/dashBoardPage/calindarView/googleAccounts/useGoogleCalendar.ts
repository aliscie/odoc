import { a } from 'framer-motion/dist/types.d-6pKw1mTI';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Event as ODOCEvent } from "$/declarations/backend/backend.did.d.js";
import { odocToGoogle } from "./eventConverter";
let accessToken = ""
export const useGoogleCalendar = () => {
  const { profile } = useSelector((state: any) => state.filesState);
  const [isConnected, setIsConnected] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);

  // Remove: const [calendarId, setCalendarId] = useState('primary');

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';

  useEffect(() => {
    const storedToken = localStorage.getItem('googleCalendarToken');
    if (storedToken) {
      accessToken = storedToken

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

  const initializeGoogleApi = async () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        setIsApiReady(true);
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const connectCalendar = async () => {
    if (!window.google) return;
    
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse) => {
        if (tokenResponse?.access_token) {
          localStorage.setItem('googleCalendarToken', tokenResponse.access_token);
          accessToken = tokenResponse.access_token;
          setIsConnected(true);
          await initializeGoogleApi();
          
          try {
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('googleCalendarId', data.id); // Store directly in localStorage
            }
          } catch (error) {
            console.log('Error fetching calendar ID:', error);
          }
        }
      },
      error_callback: (error) => {
        console.log('Error signing in', error);
        disConnectCalendar();
      }
    });
    
    tokenClient.requestAccessToken();
  };

  const disConnectCalendar = () => {
    localStorage.removeItem('googleCalendarToken');
    localStorage.removeItem('googleCalendarId');
    accessToken = '';
    setIsConnected(false);
    setIsApiReady(false);
  };

  const getEvents = async () => {
    if (!accessToken) return [];
    
    try {
      const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      url.searchParams.append('timeMin', new Date().toISOString());
      url.searchParams.append('showDeleted', 'false');
      url.searchParams.append('singleEvents', 'true');
      url.searchParams.append('maxResults', '10');
      url.searchParams.append('orderBy', 'startTime');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      return data.items || [];
    } catch (err) {
      console.log('Error fetching events', err);
      disConnectCalendar();
      return [];
    }
  };

  const getBusyEventsForUser = async (email: string) => {
    const now = new Date().toISOString();
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeMin: now,
          timeMax: nextWeek,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          items: [{ id: email }]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch busy events');
      }


      return data.calendars?.[email]?.busy || [];
    } catch (error) {
      console.log("Error fetching busy events for user:", error);
      return [];
    }
  };

  const allowViewBusy = async () => {
    if (!accessToken) return false;
  
    try {
      // First check if freeBusyReader rule already exists
      // const aclListResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/acl', {
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Accept': 'application/json'
      //   }
      // });

      
      // if (!aclListResponse.ok) {
      //   throw new Error('Failed to fetch ACL list');
      // }

      // const aclList = await aclListResponse.json();

      // const hasFreeBusyReader = aclList.items?.some(
      //   rule => rule.role === "freeBusyReader" && rule.scope?.type === "default"
      // );

      
      // if (hasFreeBusyReader) {
      //   return true;
      // }

      // Insert or update the ACL
      const aclResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/acl', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: "freeBusyReader",
          scope: { type: "default" }
        })
      });


      if (!aclResponse.ok) {
        throw new Error('Failed to update ACL');
      }

      console.log("Calendar ACL updated successfully");
      return true;
    } catch (error) {
      console.log("Error setting free/busy view:", error);
      return false;
    }
  };


  const createEvents = async (event: ODOCEvent) => {
    if (!accessToken) return null;

    try {
      const googleEvent = odocToGoogle(event);
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(googleEvent)
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.log('Error creating event', err);
      disConnectCalendar();
      return null;
    }
  };

  const updateEvent = async ( event: ODOCEvent) => {
    const eventId = event.id;
    if (!accessToken) return null;

    try {
      const googleEvent = odocToGoogle(event);
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(googleEvent)
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.log('Error updating event', err);
      disConnectCalendar();
      return null;
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!accessToken) return false;

    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.ok;
    } catch (err) {
      console.log('Error deleting event', err);
      disConnectCalendar();
      return false;
    }
  };

  // Update useEffect to load saved calendar ID
  useEffect(() => {
    const storedToken = localStorage.getItem('googleCalendarToken');
    
    if (storedToken) {
      accessToken = storedToken;
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

  const executeGoogleAction = async (action) => {
    console.log({isConnected, action});
      if (!isConnected) return false;
      
      try {
        switch(action.type) {
          case "ADD_EVENT":

            return await createEvents(action.event);
          
          case "UPDATE_EVENT":
            return await updateEvent(action.event);
            
          case "DELETE_EVENT":
            return await deleteEvent(action.id);
            
          default:
            console.error(`Unsupported action type: ${action.type}`);
            return false;
        }
      } catch (error) {
        console.error('Error executing Google action:', error);
        return false;
      }
    }
  return {
    executeGoogleAction,
    connectCalendar,
    disConnectCalendar,
    isConnected,
    getEvents,
    getBusyEventsForUser,
    allowViewBusy,
    isApiReady,
    calendarId: localStorage.getItem('googleCalendarId')
  };
};