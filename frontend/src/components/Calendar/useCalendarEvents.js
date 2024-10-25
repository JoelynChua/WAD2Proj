import { ref } from 'vue'
import eventService from '../../services/organiserEventService'
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
  
      return {
        id: event.id,
        title: event.title,
        start: new Date(event.start).toISOString(), // Ensure proper date format
        end: new Date(event.end).toISOString(),     // Ensure proper date format
        allDay: event.allDay || false,
        backgroundColor: event.colour || '#fb00bc',
        borderColor: event.colour || '#fb00bc',
        description: event.description || '',        // Move description to top level
        organiserId: event.organiserId,             // Move organiserId to top level
        editable: true,
        display: 'block'
      }
    }
  
    const formatEventForBackend = (eventData) => {
        if (!eventData) {
          throw new Error('Event data is required');
        }
      
        try {
          let startDate, endDate;
      
          // Handle non-allDay events
          if (!eventData.allDay) {

            startDate = new Date(eventData.start);
            const startDateOnly = eventData.start.split('T')[0]; // Get just the date part
            
            if (!eventData.endTime) {
              endDate = new Date(startDate);
              endDate.setHours(endDate.getHours() + 1);
            } else {
              // Combine date with endTime
              endDate = new Date(`${startDateOnly}T${eventData.endTime}`);
            }
          } else {
            // For all-day events
            startDate = new Date(eventData.start.split('T')[0]);
            const nextDay = new Date(startDate);
            nextDay.setDate(nextDay.getDate() + 1);
            endDate = nextDay;
          }
      
          // Validate the dates
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format');
          }
      
          // Ensure end is after start
          if (endDate <= startDate) {
            endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + 1);
          }
      
          // Debug logging
          console.log('Processed start date:', startDate);
          console.log('Processed end date:', endDate);
      
          return {
            title: eventData.title || '',
            description: eventData.description || '',
            organiserId: organiserId,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            allDay: Boolean(eventData.allDay),
            colour: eventData.colour || '#fb00bc'
          };
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
  
        const response = await eventService.getEventsByOrganiserId(organiserId)
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
        const response = await eventService.createEvent(backendEvent)
        const newEvent = formatEventForCalendar(response)
  
        if (newEvent) {
          events.value = [...events.value, newEvent]
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
        const backendEvent = formatEventForBackend(eventData)
        const response = await eventService.updateEvent(eventId, backendEvent)
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
        await eventService.deleteEvent(eventId)
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