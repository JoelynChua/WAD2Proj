<template>
  <div class="calendar-container">
    <div v-if="isLoading" class="loading-overlay">
      Loading events...
    </div>
    
    <FullCalendar
      ref="fullCalendar"
      :options="calendarOptions"
    />
    
    <EventCreatePopup
      v-if="showEventPopup"
      :newEvent="newEvent"
      @create="handleCreateEvent"
      @close="closePopup"
    />

    <EventEditPopup
      v-if="showEventEditor"
      :editingEvent="editingEvent"
      @update="handleUpdateEvent"
      @delete="handleDeleteEvent"
      @close="closeEventEditor"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendarEvents } from './useCalendarEvents'
import EventCreatePopup from './EventCreatePopup.vue'
import EventEditPopup from './EventEditPopup.vue'

export default {
  name: 'CalendarComponent',

  components: {
    FullCalendar,
    EventCreatePopup,
    EventEditPopup
  },

  props: {
    organiserId: {
      type: String,
      required: true,
      default: '123'
    }
  },

  setup(props) {
    const showEventPopup = ref(false)
    const showEventEditor = ref(false)
    const newEvent = ref(null)
    const editingEvent = ref(null)
    // const calendarRef = ref(null)

    const {
      events,
      isLoading,
      error,
      fetchEvents,
      createEvent,
      updateEvent,
      deleteEvent
    } = useCalendarEvents(props.organiserId)

    // Calendar event handlers
    const handleDateSelect = (selectInfo) => {
      newEvent.value = {
        title: '',
        description: '',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        colour: '#fb00bc',
        organiserId: props.organiserId
      }
      showEventPopup.value = true
    }

    const handleEventClick = (clickInfo) => {
      editingEvent.value = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        description: clickInfo.event.extendedProps?.description || '',
        start: clickInfo.event.startStr,
        end: clickInfo.event.endStr,
        allDay: clickInfo.event.allDay,
        colour: clickInfo.event.backgroundColor,
        organiserId: props.organiserId
      }
      showEventEditor.value = true
    }

    const handleEventDrop = async (dropInfo) => {
      try {
        const updatedEvent = {
          id: dropInfo.event.id,
          title: dropInfo.event.title,
          description: dropInfo.event.extendedProps?.description || '',
          start: dropInfo.event.startStr,
          end: dropInfo.event.endStr,
          allDay: dropInfo.event.allDay,
          colour: dropInfo.event.backgroundColor,
          organiserId: props.organiserId
        }
        await updateEvent(updatedEvent.id, updatedEvent)
      } catch (err) {
        dropInfo.revert()
        console.error('Error updating event:', err)
      }
    }

    function formatTimeDisplay(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Make calendar options computed to ensure reactivity
    const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      events: events.value, // Use the reactive events value
      eventContent: (arg) => {
        const eventElement = document.createElement('div')
        eventElement.classList.add('fc-event-content')
        eventElement.style.backgroundColor = arg.event.backgroundColor || arg.event.extendedProps.colour
        eventElement.style.borderColor = arg.event.borderColor || arg.event.extendedProps.colour
        eventElement.style.padding = '2px 4px'
        eventElement.style.borderRadius = '4px'

        if (!arg.event.allDay) {
          const timeElement = document.createElement('div')
          timeElement.classList.add('fc-event-time')
          const startTime = arg.event.start ? formatTimeDisplay(arg.event.start) : ''
          const endTime = arg.event.end ? formatTimeDisplay(arg.event.end) : ''
          timeElement.textContent = endTime ? `${startTime} - ${endTime}` : startTime
          timeElement.style.fontSize = '0.85em'
          timeElement.style.opacity = '0.8'
          eventElement.appendChild(timeElement)
        }

        const titleElement = document.createElement('strong')
        titleElement.textContent = arg.event.title
        titleElement.style.display = 'block'
        eventElement.appendChild(titleElement)

        if (arg.event.extendedProps?.description) {
          const descriptionElement = document.createElement('div')
          descriptionElement.classList.add('fc-event-description')
          descriptionElement.textContent = arg.event.extendedProps.description
          descriptionElement.style.fontSize = '0.85em'
          descriptionElement.style.opacity = '0.9'
          eventElement.appendChild(descriptionElement)
        }

        return { domNodes: [eventElement] }
      },
      select: handleDateSelect,
      eventClick: handleEventClick,
      eventDrop: handleEventDrop,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    }))

    // CRUD operations
    const handleCreateEvent = async (eventData) => {
      try {
        await createEvent(eventData)
        closePopup()
      } catch (err) {
        console.error('Error creating event:', err)
      }
    }

    const handleUpdateEvent = async (eventData) => {
      try {
        await updateEvent(eventData.id, eventData)
        closeEventEditor()
      } catch (err) {
        console.error('Error updating event:', err)
      }
    }

    const handleDeleteEvent = async (eventId) => {
      try {
        await deleteEvent(eventId)
        closeEventEditor()
      } catch (err) {
        console.error('Error deleting event:', err)
      }
    }

    const closePopup = () => {
      showEventPopup.value = false
      newEvent.value = null
    }

    const closeEventEditor = () => {
      showEventEditor.value = false
      editingEvent.value = null
    }

    // Watch for changes in events
    watch(events, (newEvents) => {
      console.log('Events updated:', newEvents)
    }, { deep: true })

    onMounted(async () => {
      await fetchEvents()
      console.log('Mounted events:', events.value)
    })

    return {
      calendarOptions,
      showEventPopup,
      showEventEditor,
      newEvent,
      editingEvent,
      events,
      isLoading,
      error,
      handleCreateEvent,
      handleUpdateEvent,
      handleDeleteEvent,
      closePopup,
      closeEventEditor
    }
  }
}
</script>

<style scoped src="./CalendarStyles.css">
</style>