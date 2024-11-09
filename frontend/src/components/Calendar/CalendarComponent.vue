<template>
  <div class="calendar-container">
    
    <FullCalendar
      ref="calendarRef"
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
import { getAuth } from 'firebase/auth';

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
      default: function() {
        const auth = getAuth();
        const user = auth.currentUser;
        return user ? user.uid : null;
      }
    }
  },

  setup(props) {
    const showEventPopup = ref(false)
    const showEventEditor = ref(false)
    const newEvent = ref(null)
    const editingEvent = ref(null)
    const defaultColor = '#4339cf'
    const calendarRef = ref(null)

    const {
      events,
      error,
      fetchEvents,
      createEvent,
      updateEvent,
      deleteEvent
    } = useCalendarEvents(props.organiserId)
    
    // Calendar event handlers
    const handleDateSelect = (selectInfo) => {
      console.log('Select info:', selectInfo);
      
      // For all-day events, we need to handle the end date differently
      let startStr = selectInfo.startStr;
      let endStr = selectInfo.endStr;
      
      if (selectInfo.allDay) {
        // For all-day events, endStr will be exclusive, so we need to subtract one day
        const endDate = new Date(endStr);
        endDate.setDate(endDate.getDate() - 1);
        endStr = endDate.toISOString().split('T')[0];
      }
      
      console.log('Adjusted dates:', { startStr, endStr });

      newEvent.value = {
        title: '',
        description: '',
        price: '',
        start: formatDate(startStr),
        end: formatDate(endStr),
        startTime: selectInfo.allDay ? '' : selectInfo.startStr.split('T')[1]?.slice(0, 5) || '',
        endTime: selectInfo.allDay ? '' : selectInfo.endStr.split('T')[1]?.slice(0, 5) || '',
        allDay: selectInfo.allDay,
        colour: defaultColor,
        organiserId: props.organiserId
      }
      
      console.log('New event data:', newEvent.value);
      showEventPopup.value = true
    }

    function handleEventClick(info) {
        const event = info.event
        

        // console.log('Raw event data:', {
        //     id: event.id,
        //     start: event.start,
        //     end: event.end,
        //     allDay: event.allDay,
        //     startStr: event.startStr,
        //     endStr: event.endStr
        // });

        const startDate = new Date(event.start)
        const endDate = event.end ? new Date(event.end) : new Date(event.start)
        

        // console.log('Converted dates:', {
        //     startDate,
        //     endDate,
        //     startLocalISO: startDate.toISOString(),
        //     endLocalISO: endDate.toISOString(),
        //     startTimezone: startDate.getTimezoneOffset(),
        //     endTimezone: endDate.getTimezoneOffset()
        // });

        editingEvent.value = {
            id: event.id,
            title: event.title,
            price: event.extendedProps.price,
            description: event.extendedProps.description || '',
            start: formatDate(startDate),
            end: formatDate(endDate),
            startTime: event.allDay ? '' : formatTime(startDate),
            endTime: event.allDay ? '' : (event.end ? formatTime(endDate) : formatTime(startDate)),
            allDay: event.allDay,
            color: event.backgroundColor
        }


        // console.log('Formatted event:', editingEvent.value);
        
        showEventEditor.value = true
    }

    const refreshCalendar = () => {
      if (calendarRef.value) {
        const calendarApi = calendarRef.value.getApi()
        calendarApi.refetchEvents()
      }
    }

    function formatDate(date) {

        const d = new Date(date)

        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        
        const formatted = `${year}-${month}-${day}`
        console.log('formatDate input:', date, 'output:', formatted);
        return formatted
    }

    function formatTime(date) {
        const d = new Date(date)
        
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        
        const formatted = `${hours}:${minutes}`
        console.log('formatTime input:', date, 'output:', formatted);
        return formatted
    }

    const handleEventDrop = async (dropInfo) => {
      try {
        const event = dropInfo.event;
        
        const updatedEvent = {
          id: event.id,
          title: event.title,
          price: event.extendedProps.price,  
          description: event.extendedProps.description,
          start: event.startStr,
          end: event.endStr,
          allDay: event.allDay,
          colour: event.backgroundColor || defaultColor,  
          organiserId: props.organiserId
        }

        console.log('Drop event data:', updatedEvent);
        await updateEvent(updatedEvent.id, updatedEvent)
        refreshCalendar()  
      } catch (err) {
        dropInfo.revert()
        console.error('Error updating event:', err)
      }
    }
    function formatTimeDisplay(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    const handleEventResize = async (resizeInfo) => {
      try {
        const event = resizeInfo.event;
        
        const updatedEvent = {
          id: event.id,
          title: event.title,
          price: event.extendedProps.price,  // Fix: get price from extendedProps
          description: event.extendedProps.description,
          start: event.startStr,
          end: event.endStr,
          allDay: event.allDay,
          colour: event.backgroundColor || defaultColor,  // Use default color if not set
          organiserId: props.organiserId
        }

        console.log('Resize event data:', updatedEvent);
        await updateEvent(updatedEvent.id, updatedEvent)
        refreshCalendar()  // Add this to ensure calendar updates
      } catch (err) {
        resizeInfo.revert()
        console.error('Error updating event after resize:', err)
      }
    }
    // Make calendar options computed to ensure reactivity
    const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      timeZone: 'local',
      editable: true,
      eventResizableFromStart: true,
      eventDurationEditable: true,
      selectable: true,
      selectMirror: true,
      eventColor: defaultColor,
      eventResize: handleEventResize,
      eventDisplay: 'block',
      dayMaxEvents: true,
      weekends: true,
      events: events.value, // Use the reactive events value
      displayEventTime: true,
      select: handleDateSelect,
      eventClick: handleEventClick,
      eventDrop: handleEventDrop,
      customButtons: {
        createEventButton: {
          text: 'Create Event',
          click: () => {
            const today = new Date()
            const formattedDate = formatDate(today)
            
            newEvent.value = {
              title: '',
              description: '',
              price: '',
              start: formattedDate,
              end: formattedDate,
              startTime: '',
              endTime: '',
              allDay: true,
              colour: defaultColor,
              organiserId: props.organiserId
            }
            
            showEventPopup.value = true
          }
        }
      },
      headerToolbar: {
        left: 'prev,next today title',
        right: 'createEventButton dayGridMonth,timeGridWeek,timeGridDay'
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      eventContent: (arg) => {
        const eventElement = document.createElement('div')
        eventElement.classList.add('fc-event-content')
        eventElement.style.backgroundColor = arg.event.backgroundColor || arg.event.extendedProps.colour
        eventElement.style.borderColor = arg.event.borderColor || arg.event.extendedProps.colour
        eventElement.style.padding = '2px 4px'
        eventElement.style.borderRadius = '4px'
        
        // Calculate duration in minutes
        const start = arg.event.start
        const end = arg.event.end || arg.event.start
        const durationInMinutes = (end - start) / (1000 * 60)
        
        // Consider an event "short" if it's less than 60 minutes (adjust as needed)
        const isShortEvent = durationInMinutes < 90

        // Add tooltip for short events
        if (isShortEvent && arg.event.extendedProps?.description) {
            eventElement.title = `${arg.event.title}\n${arg.event.extendedProps.description}`
        }

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

        if (arg.event.extendedProps?.description && !isShortEvent) {
            const descriptionElement = document.createElement('div')
            descriptionElement.classList.add('fc-event-description')
            descriptionElement.textContent = arg.event.extendedProps.description
            descriptionElement.style.fontSize = '0.85em'
            descriptionElement.style.opacity = '0.9'
            eventElement.appendChild(descriptionElement)
        }

        return { domNodes: [eventElement] }
    },

    }))
    
    // CRUD operations
    const handleCreateEvent = async (eventData) => {
      try {
        const createdEvent = await createEvent(eventData)
        if (createdEvent) {
          events.value = [...events.value, createdEvent]
          refreshCalendar()
          calendarRef.value.getApi().refetchEvents()
        }
        closePopup()
      } catch (err) {
        console.error('Error creating event:', err)
      }
    }

    const handleUpdateEvent = async (eventData) => {
      try {
        const updatedEvent = await updateEvent(editingEvent.value.id, eventData)
        if (updatedEvent) {
          events.value = events.value.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
          )
          refreshCalendar()
        }
        closeEventEditor()
      } catch (err) {
        console.error('Error updating event:', err)
      }
    }

    const handleDeleteEvent = async () => {
      if (!editingEvent.value?.id) return
      
      try {
        await deleteEvent(editingEvent.value.id)
        events.value = events.value.filter(event => event.id !== editingEvent.value.id)
        refreshCalendar()
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
      calendarRef,
      calendarOptions,
      showEventPopup,
      showEventEditor,
      newEvent,
      editingEvent,
      events,
      error,
      handleCreateEvent,
      handleUpdateEvent,
      handleDeleteEvent,
      handleEventResize,
      closePopup,
      closeEventEditor,
    }
  }
}
</script>

<style scoped src="./CalendarStyles.css">
</style>