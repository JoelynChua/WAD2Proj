import { ref } from 'vue'
import organiserEventService from '../../services/organiserEventService'
export const useCalendarEvents = (organiserId) => {
    const events = ref([])
    const isLoading = ref(false)
    const error = ref(null)
  
    // Format helpers
    const formatEventForCalendar = (event) => {
      if (!event || !event.id) {
        console.warn('Invalid event data received:', event)
        return null
      }
    
      // Keep the dates in the original timezone format
      return {
        id: event.id,
        title: event.title,
        price: event.price,
        start: event.start,     // Don't convert, keep original format
        end: event.end,         // Don't convert, keep original format
        allDay: event.allDay || false,
        backgroundColor: event.colour || '#fb00bc',
        borderColor: event.colour || '#fb00bc',
        description: event.description || '',
        organiserId: event.organiserId,
        editable: true,
        display: 'block',
        extendedProps: {
          price: event.price,
          description: event.description || ''
        }
      }
    }
    
    const formatEventForBackend = (eventData) => {
      if (!eventData) {
        throw new Error('Event data is required');
      }
    
      try {
        console.log('Event data received:', eventData);
    
        if (eventData.allDay) {
          // Extract just the date part from the ISO strings
          const startDate = eventData.start.split('T')[0];
          const endDate = eventData.end.split('T')[0];
          
          return {
            title: eventData.title,
            description: eventData.description || '',
            price: eventData.price,
            organiserId: organiserId,
            // For all-day events, set consistent start and end times
            start: `${startDate}T00:00:00+08:00`,
            end: `${endDate}T23:59:59+08:00`,
            allDay: true,
            colour: eventData.color || eventData.colour || '#fb00bc'
          };
        } else {
          // For timed events
          return {
            title: eventData.title,
            price: eventData.price,
            description: eventData.description || '',
            organiserId: organiserId,
            start: eventData.start.includes('+') ? eventData.start : `${eventData.start}+08:00`,
            end: eventData.end.includes('+') ? eventData.end : `${eventData.end}+08:00`,
            allDay: false,
            colour: eventData.color || eventData.colour || '#fb00bc'
          };
        }
    
      } catch (error) {
        console.error('Date processing error:', error);
        console.error('Original event data:', eventData);
        throw new Error(`Error formatting event: ${error.message}`);
      }
    };
  
    const fetchEvents = async () => {
      if (!organiserId) {
        console.error('No organiser ID provided')
        return
      }
  
      isLoading.value = true
      error.value = null
  
      try {
        console.log('Fetching events for organiser:', organiserId)
  
        const response = await organiserEventService.getEventsByOrganiserId(organiserId)
        console.log('Raw events from server:', response) // Debug log
  
        // Filter out any invalid events and format the valid ones
        const formattedEvents = Array.isArray(response) ? response
          .map(event => {
            const formatted = formatEventForCalendar(event)
            console.log('Formatted event:', formatted) // Debug log
            return formatted
          })
          .filter(event => event !== null) : []
  
        console.log('Final formatted events:', formattedEvents) // Debug log
        events.value = formattedEvents
        return formattedEvents
      } catch (err) {
        console.error('Error fetching events:', err)
        error.value = 'Failed to load events: ' + err.message
        throw err
      } finally {
        isLoading.value = false
      }
    }
  

    const createEvent = async (eventData) => {
      isLoading.value = true
      error.value = null
  
      try {
        const backendEvent = formatEventForBackend(eventData)
        console.log('Sending to backend:', backendEvent)
        const response = await organiserEventService.createEvent(backendEvent)
        console.log('Received from backend:', response)
        const newEvent = formatEventForCalendar(response)
        console.log('Formatted for calendar:', newEvent)
        
        if (newEvent) {
          events.value = [...events.value, newEvent]
          console.log('Updated events array:', events.value)
        }
  
        return newEvent
      } catch (err) {
        error.value = 'Failed to create event: ' + err.message
        throw err
      } finally {
        isLoading.value = false
      }
    }
  
    const updateEvent = async (eventId, eventData) => {
      isLoading.value = true
      error.value = null
    
      try {
        console.log('Updating event with data:', eventData);
        const backendEvent = formatEventForBackend(eventData)
        console.log('Formatted for backend:', backendEvent);
        
        const response = await organiserEventService.updateEvent(eventId, backendEvent)
        const updatedEvent = formatEventForCalendar(response)
    
        if (updatedEvent) {
          events.value = events.value.map(event => 
            event.id === eventId ? updatedEvent : event
          )
        }
    
        return updatedEvent
      } catch (err) {
        error.value = 'Failed to update event: ' + err.message
        throw err
      } finally {
        isLoading.value = false
      }
    }
  
    const deleteEvent = async (eventId) => {
      isLoading.value = true
      error.value = null
  
      try {
        await organiserEventService.deleteEvent(eventId)
        events.value = events.value.filter(event => event.id !== eventId)
        return true
      } catch (err) {
        error.value = 'Failed to delete event: ' + err.message
        throw err
      } finally {
        isLoading.value = false
      }
    }
  
    return {
      events,
      isLoading,
      error,
      fetchEvents,
      createEvent,
      updateEvent,
      deleteEvent
    }
  }