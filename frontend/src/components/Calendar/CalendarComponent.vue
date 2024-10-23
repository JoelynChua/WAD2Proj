<template>
  <div class="calendar-container">
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    
    <EventCreatePopup
      v-if="showEventPopup"
      :newEvent="newEvent"
      @create="createEvent"
      @close="resetEvent"
      @added="closePopup"
    />

    <EventEditPopup
      v-if="showEventEditor"
      :editingEvent="editingEvent"
      @update="updateEvent"
      @delete="deleteEvent"
      @close="closeEventEditor"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventCreatePopup from './EventCreatePopup.vue'
import EventEditPopup from './EventEditPopup.vue'
import { useEvents } from './useEvents'

export default {
  components: { 
    FullCalendar,
    EventCreatePopup,
    EventEditPopup
  },
  setup() {
    const fullCalendar = ref(null)
    const showEventPopup = ref(false)
    const showEventEditor = ref(false)
    const defaultColor = '#fb00bc'

    // Utility functions
    const formatTimeDisplay = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const formatTime = (date) => {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    }

    // Popup control
    const openCreateEventPopup = () => {
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0]
      newEvent.value = {
        title: '',
        description: '',
        start: formattedDate,
        end: formattedDate,
        startTime: '',
        endTime: '',
        allDay: true,
        color: defaultColor
      }
      showEventPopup.value = true
    }

    const resetEvent = () => {
      closePopup()
      newEvent.value = {
        title: '',
        description: '',
        start: '',
        end: '',
        startTime: '',
        endTime: '',
        allDay: false,
        color: defaultColor
      }
    }

    const closePopup = () => {
      showEventPopup.value = false
    }

    const closeEventEditor = () => {
      showEventEditor.value = false
      editingEvent.value = {
        id: '',
        title: '',
        description: '',
        start: '',
        end: '',
        startTime: '',
        endTime: '',
        allDay: false,
        color: defaultColor
      }
    }

    function handleDateClick(arg) {
      newEvent.value = {
        title: '',
        description: '',
        start: arg.dateStr,
        end: arg.dateStr,
        startTime: '',
        endTime: '',
        allDay: arg.allDay,
        color: defaultColor
      }
      showEventPopup.value = true
    }

    function handleDateSelect(arg) {
      newEvent.value = {
        title: '',
        description: '',
        start: arg.startStr.split('T')[0],
        end: arg.endStr.split('T')[0],
        startTime: arg.startStr.split('T')[1]?.slice(0, 5) || '',
        endTime: arg.endStr.split('T')[1]?.slice(0, 5) || '',
        allDay: arg.allDay,
        color: defaultColor
      }
      showEventPopup.value = true
    }

    function handleEventClick(info) {
      const event = info.event
      const startDate = event.start
      const endDate = event.end || event.start

      editingEvent.value = {
        id: event.id,
        title: event.title,
        description: event.extendedProps.description || '',
        start: formatDate(startDate),
        end: formatDate(endDate),
        startTime: formatTime(startDate),
        endTime: event.end ? formatTime(endDate) : '',
        allDay: event.allDay,
        color: event.backgroundColor
      }
      showEventEditor.value = true
    }

    // Get event management functionality
    const {
      events,
      newEvent,
      editingEvent,
      createEvent,
      updateEvent,
      deleteEvent
    } = useEvents(fullCalendar, { formatDate, formatTime, defaultColor })

    // Calendar configuration
    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      customButtons: {
        createEventButton: {
          text: 'Create Event',
          click: openCreateEventPopup
        }
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'createEventButton dayGridMonth,timeGridWeek,timeGridDay'
      },
      dayMaxEventRows: true,
      views: {
        timeGrid: {
          dayMaxEventRows: 6
        }
      },
      weekends: true,
      events: events,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      height: '100%',
      dateClick: handleDateClick,
      select: handleDateSelect,
      eventColor: defaultColor,
      eventTextColor: '#ffffff',
      slotMinTime: '06:00:00',
      slotMaxTime: '22:00:00',
      eventClick: handleEventClick,
      eventContent: (arg) => {
        const eventElement = document.createElement('div')
        eventElement.classList.add('fc-event-content')
        eventElement.style.backgroundColor = arg.event.backgroundColor
        eventElement.style.borderColor = arg.event.borderColor

        if (!arg.event.allDay) {
          const timeElement = document.createElement('div')
          timeElement.classList.add('fc-event-time')
          const startTime = arg.event.start ? formatTimeDisplay(arg.event.start) : ''
          const endTime = arg.event.end ? formatTimeDisplay(arg.event.end) : ''
          timeElement.textContent = endTime ? `${startTime} - ${endTime}` : startTime
          eventElement.appendChild(timeElement)
        }

        const titleElement = document.createElement('strong')
        titleElement.textContent = arg.event.title
        eventElement.appendChild(titleElement)

        if (arg.event.extendedProps.description) {
          const descriptionElement = document.createElement('div')
          descriptionElement.classList.add('fc-event-description')
          descriptionElement.textContent = arg.event.extendedProps.description
          eventElement.appendChild(descriptionElement)
        }

        return { domNodes: [eventElement] }
      }
    })

    onMounted(() => {
      const calendarApi = fullCalendar.value.getApi()
      calendarApi.setOption('height', window.innerHeight)
    })

    return {
      fullCalendar,
      resetEvent,
      calendarOptions,
      showEventPopup,
      showEventEditor,
      newEvent,
      editingEvent,
      createEvent,
      updateEvent,
      deleteEvent,
      closePopup,
      closeEventEditor,
      formatDate,
      formatTime,
      formatTimeDisplay
    }
  }
}
</script>

<style scoped src="./CalendarStyles.css">
</style>