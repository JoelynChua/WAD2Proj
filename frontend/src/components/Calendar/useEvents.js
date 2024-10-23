import { ref } from 'vue'

export function useEvents(calendarRef) {
  const events = ref([])
  const newEvent = ref({})
  const editingEvent = ref({})


  const createEvent = () => {
    if (newEvent.value.title && newEvent.value.start) {
      const calendarApi = calendarRef.value.getApi()
      let eventData = {
        title: newEvent.value.title,
        start: newEvent.value.start,
        end: newEvent.value.end,
        allDay: newEvent.value.allDay,
        color: newEvent.value.color,
        extendedProps: {
          description: newEvent.value.description
        }
      }

      if (!newEvent.value.allDay) {
        eventData.start = `${newEvent.value.start}T${newEvent.value.startTime}`
        eventData.end = `${newEvent.value.end}T${newEvent.value.endTime || newEvent.value.startTime}`
      }

      calendarApi.addEvent(eventData)
      events.value.push(eventData)
    }
  }

  const updateEvent = () => {
    const calendarApi = calendarRef.value.getApi()
    const event = calendarApi.getEventById(editingEvent.value.id)
    if (event) {
      event.remove()
      const updatedEvent = {
        id: editingEvent.value.id,
        title: editingEvent.value.title,
        description: editingEvent.value.description,
        start: editingEvent.value.allDay ? editingEvent.value.start : `${editingEvent.value.start}T${editingEvent.value.startTime}`,
        end: editingEvent.value.allDay ? editingEvent.value.end : `${editingEvent.value.end}T${editingEvent.value.endTime}`,
        allDay: editingEvent.value.allDay,
        backgroundColor: editingEvent.value.color,
        extendedProps: {
          description: editingEvent.value.description
        }
      }
      calendarApi.addEvent(updatedEvent)
      
      // Update the events array
      const index = events.value.findIndex(e => e.id === editingEvent.value.id)
      if (index !== -1) {
        events.value[index] = updatedEvent
      }
    }
  }

  const deleteEvent = () => {
    const calendarApi = calendarRef.value.getApi()
    const event = calendarApi.getEventById(editingEvent.value.id)
    if (event) {
      event.remove()
      // Remove from events array
      events.value = events.value.filter(e => e.id !== editingEvent.value.id)
    }
  }

  return {
    events,
    newEvent,
    editingEvent,
    createEvent,
    updateEvent,
    deleteEvent
  }
}