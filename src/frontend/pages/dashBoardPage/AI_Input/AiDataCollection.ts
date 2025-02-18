// State management
export const conversationState = {
  operation: null,
  collectedData: {},
  isComplete: false
};

// Action types
export const ActionTypes = {
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  ADD_AVAILABILITY: 'ADD_AVAILABILITY',
  ADD_AVAILABILITIES: 'ADD_AVAILABILITIES',
  UPDATE_AVAILABILITY: 'UPDATE_AVAILABILITY',
  DELETE_AVAILABILITY: 'DELETE_AVAILABILITY',
  ADD_BLOCKED_TIMES: 'ADD_BLOCKED_TIMES',
  UPDATE_BLOCKED_TIME: 'UPDATE_BLOCKED_TIME',
  DELETE_BLOCKED_TIME: 'DELETE_BLOCKED_TIME'
};

function handleEventConversation(inputText) {
  try {
    // Determine operation type from input
    const operation = parseOperation(inputText);
    conversationState.operation = operation;

    // Parse all possible information from the input
    const parsedInfo = parseEventInput(inputText);
    
    // If we have all required information, mark as complete
    if (isEventComplete(parsedInfo)) {
      const eventData = formatEventData(parsedInfo);
      conversationState.collectedData = eventData;
      conversationState.isComplete = true;
      
      // Return action object based on operation type
      return createActionObject(operation, eventData);
    }
    
    // If missing critical information, ask for it
    const missingInfo = getMissingInformation(parsedInfo);
    if (missingInfo) {
      return { text: missingInfo };
    }
    
    return conversationState.collectedData;
  } catch (error) {
    console.error('Event Conversation Error:', error);
    return { text: 'An error occurred. Please try again.' };
  }
}

function parseOperation(input) {
  const text = input.toLowerCase();
  if (text.startsWith('create') || text.startsWith('add')) return ActionTypes.ADD_EVENT;
  if (text.startsWith('update') || text.startsWith('edit')) return ActionTypes.UPDATE_EVENT;
  if (text.startsWith('delete') || text.startsWith('remove')) return ActionTypes.DELETE_EVENT;
  if (text.includes('block') && text.includes('time')) return ActionTypes.ADD_BLOCKED_TIMES;
  return ActionTypes.ADD_EVENT; // Default to ADD_EVENT
}

function parseEventInput(input) {
  const result = {
    id: generateId(),
    title: null,
    description: null,
    startTime: null,
    endTime: null,
    duration: null,
    attendees: [],
    type: 'event'
  };

  // Parse duration
  const durationMatch = input.match(/(\d+)\s*(minute|min|minutes|mins|hour|hr|hours|hrs)/i);
  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    result.duration = unit.includes('hour') ? value * 60 : value;
  }

  // Parse time with AM/PM
  const timeMatch = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)/);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3].toLowerCase();
    
    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    result.startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // Parse date references
  if (input.toLowerCase().includes('tomorrow')) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const dateStr = formatDate(date);
    if (result.startTime) {
      result.startTime = `${dateStr}T${result.startTime}`;
    }
  }

  // Parse attendees
  const withMatch = input.match(/\bwith\s+([^.!?,]*)/i);
  if (withMatch) {
    result.attendees = ['Me', ...withMatch[1].split(/\s*(?:,|and)\s*/)
      .map(name => name.trim())
      .filter(name => name.length > 0)];
  }

  // Set title and description
  if (result.attendees.length > 0) {
    const otherAttendees = result.attendees.filter(a => a !== 'Me').join(', ');
    result.title = `Call with ${otherAttendees}`;
    result.description = `${result.duration || '30'} minutes call with ${otherAttendees}`;
  } else {
    result.title = 'Call';
    result.description = `${result.duration || '30'} minutes call`;
  }

  // Calculate end time
  if (result.startTime) {
    result.endTime = calculateEndTime(result.startTime, result.duration);
  }

  return result;
}

function isEventComplete(parsedInfo) {
  return parsedInfo.title && 
         parsedInfo.startTime && 
         (parsedInfo.endTime || parsedInfo.duration);
}

function getMissingInformation(parsedInfo) {
  if (!parsedInfo.startTime) return "When would you like to schedule this?";
  if (!parsedInfo.duration && !parsedInfo.endTime) return "How long should this event be?";
  if (!parsedInfo.attendees.length) return "Who would you like to invite to this event?";
  return null;
}

function formatEventData(parsedInfo) {
  return {
    id: parsedInfo.id,
    title: parsedInfo.title,
    description: parsedInfo.description,
    start_time: parsedInfo.startTime,
    end_time: parsedInfo.endTime,
    attendees: parsedInfo.attendees,
    type: parsedInfo.type
  };
}

function createActionObject(operation, eventData) {
  switch (operation) {
    case ActionTypes.ADD_EVENT:
      return {
        type: ActionTypes.ADD_EVENT,
        event: eventData
      };
    case ActionTypes.UPDATE_EVENT:
      return {
        type: ActionTypes.UPDATE_EVENT,
        event: eventData
      };
    case ActionTypes.DELETE_EVENT:
      return {
        type: ActionTypes.DELETE_EVENT,
        eventId: eventData.id
      };
    default:
      return {
        type: ActionTypes.ADD_EVENT,
        event: eventData
      };
  }
}

function calculateEndTime(startTime, durationMinutes) {
  const [dateTime, timeStr] = startTime.includes('T') ? startTime.split('T') : [null, startTime];
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const totalMinutes = hours * 60 + minutes + (durationMinutes || 30);
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  return dateTime ? `${dateTime}T${endTime}` : endTime;
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function resetConversationState() {
  conversationState.operation = null;
  conversationState.collectedData = {};
  conversationState.isComplete = false;
}

export { handleEventConversation, resetConversationState };
