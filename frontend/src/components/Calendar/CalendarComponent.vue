<template>
  <div class="calendar-container">
    <FullCalendar ref="fullCalendar" 
      :options="calendarOptions" 
    />
    
    <div v-if="showEventPopup" class="event-popup">
      <div class="event-popup-content">
        <h2>Create New Event</h2>
        <form @submit.prevent="createEvent">
          <div class="form-group title-group">
            <div class="title-label">
              <label for="title">Title</label>
              <div class="checkbox-group">
                <input type="checkbox" v-model="newEvent.allDay" id="allDay">
                <label for="allDay">All Day Event</label>
              </div>
            </div>
            <input type="text" v-model="newEvent.title" id="title" required placeholder="Enter event title">
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea v-model="newEvent.description" id="description" class="description-textarea" placeholder="Enter event description"></textarea>
          </div>
          <div class="form-group">
            <label for="start">Start Date</label>
            <input v-model="newEvent.start" id="start" type="date" required>
          </div>
          <div class="form-group" v-if="!newEvent.allDay">
            <label for="startTime">Start Time</label>
            <input v-model="newEvent.startTime" id="startTime" type="time" required>
          </div>
          <div class="form-group">
            <label for="end">End Date</label>
            <input v-model="newEvent.end" id="end" type="date">
          </div>
          <div class="form-group" v-if="!newEvent.allDay">
            <label for="endTime">End Time</label>
            <input v-model="newEvent.endTime" id="endTime" type="time">
          </div>
          <div class="form-group">
            <label for="eventColor">Event Color</label>
            <input type="color" v-model="newEvent.color" id="eventColor">
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">Add Event</button>
            <button type="button" @click="closePopup" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEventEditor" class="event-popup">
      <div class="event-popup-content">
        <h2>Edit Event</h2>
        <form @submit.prevent="updateEvent">
          <div class="form-group title-group">
            <div class="title-label">
              <label for="editTitle">Title</label>
              <div class="checkbox-group">
                <input type="checkbox" v-model="editingEvent.allDay" id="editAllDay">
                <label for="editAllDay">All Day Event</label>
              </div>
            </div>
            <input type="text" v-model="editingEvent.title" id="editTitle" required placeholder="Enter event title">
          </div>
          <div class="form-group">
            <label for="editDescription">Description</label>
            <textarea v-model="editingEvent.description" id="editDescription" class="description-textarea" placeholder="Enter event description"></textarea>
          </div>
          <div class="form-group">
            <label for="editStart">Start Date</label>
            <input v-model="editingEvent.start" id="editStart" type="date" required>
          </div>
          <div class="form-group" v-if="!editingEvent.allDay">
            <label for="editStartTime">Start Time</label>
            <input v-model="editingEvent.startTime" id="editStartTime" type="time" required>
          </div>
          <div class="form-group">
            <label for="editEnd">End Date</label>
            <input v-model="editingEvent.end" id="editEnd" type="date">
          </div>
          <div class="form-group" v-if="!editingEvent.allDay">
            <label for="editEndTime">End Time</label>
            <input v-model="editingEvent.endTime" id="editEndTime" type="time">
          </div>
          <div class="form-group">
            <label for="editEventColor">Event Color</label>
            <input type="color" v-model="editingEvent.color" id="editEventColor">
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">Update Event</button>
            <button type="button" @click="deleteEvent" class="btn btn-danger">Delete Event</button>
            <button type="button" @click="closeEventEditor" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: { FullCalendar },
  setup() {
    const fullCalendar = ref(null)
    const events = ref([])
    const showEventPopup = ref(false)
    const showEventEditor = ref(false)
    const defaultColor = '#fb00bc'
    const newEvent = ref({
      title: '',
      description: '',
      start: '',
      end: '',
      startTime: '',
      endTime: '',
      allDay: false,
      color: defaultColor
    })
    const editingEvent = ref({
      id: '',
      title: '',
      description: '',
      start: '',
      end: '',
      startTime: '',
      endTime: '',
      allDay: false,
      color: defaultColor
    })
  

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

    function formatTimeDisplay(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    function openCreateEventPopup() {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
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
      showEventPopup.value = true;
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

    function createEvent() {
      if (newEvent.value.title && newEvent.value.start) {
        const calendarApi = fullCalendar.value.getApi()
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
        closePopup()
      }
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

    function formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    function formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    }

    function updateEvent() {
      const calendarApi = fullCalendar.value.getApi()
      const event = calendarApi.getEventById(editingEvent.value.id)
      if (event) {
        event.remove()
        calendarApi.addEvent({
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
        })
        closeEventEditor()
      }
    }

    function deleteEvent() {
      const calendarApi = fullCalendar.value.getApi()
      const event = calendarApi.getEventById(editingEvent.value.id)
      if (event) {
        event.remove()
        closeEventEditor()
      }
    }

    function closeEventEditor() {
      showEventEditor.value = false
      editingEvent.value = { /* Reset to default values */ }
    }
    function closePopup() {
      showEventPopup.value = false
      newEvent.value = { title: '', description: '', start: '', end: '', startTime: '', endTime: '', allDay: false }
    }

    onMounted(() => {
      const calendarApi = fullCalendar.value.getApi()
      calendarApi.setOption('height', window.innerHeight)
    })

    return {
      fullCalendar,
      calendarOptions,
      showEventPopup,
      showEventEditor,
      newEvent,
      createEvent,
      closePopup,
      openCreateEventPopup,
      updateEvent,
      deleteEvent,
      editingEvent,
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