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

        if (!arg.event.allDay) {
          const timeElement = document.createElement('div')
          timeElement.classList.add('fc-event-time')
          timeElement.textContent = arg.timeText
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
      formatTime
    }
  }
}
</script>

<style scoped>
/* Styles remain largely the same, with a few additions */
.calendar-container {
  height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
}

.event-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.event-popup-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.title-group {
  margin-bottom: 1rem;
}

.title-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.description-textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit; 
  line-height: 1.5; 
}

label {
  display: block;
  text-align: left;
  padding-left: 2px;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

input[type="text"],
input[type="date"],
input[type="time"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input[type="color"] {
  width: 100%;
  height: 40px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.25rem;
  accent-color: #fb00bc;
}

.checkbox-group label {
  font-weight: normal;
  margin-bottom: 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #fb00bc;
  color: white;
}

.btn-secondary {
  background-color: #fb0000;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

:deep(.fc) {
  font-family: Arial, sans-serif;
}

:deep(.fc-button-primary) {
  background-color: rgb(251, 0, 188);
  border-color: rgb(251, 0, 188);
}

:deep(.fc-button-primary:not(:disabled):active),
:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  background-color: rgb(251, 0, 188);
  border-color: rgb(251, 0, 188);
}

:deep(.fc-daygrid-day-number),
:deep(.fc-col-header-cell-cushion) {
  color: #333;
  text-decoration: none;
}

:deep(.fc-day-today) {
  background-color: rgb(243, 172, 225) !important;
}

:deep(.fc-event) {
  border-radius: 2px;
}

:deep(.fc-header-toolbar) {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

:deep(.fc-toolbar-chunk) {
  flex: 1;
  display: flex;
  align-items: center;
}

:deep(.fc-toolbar-chunk:first-child) {
  justify-content: flex-start;
}

:deep(.fc-toolbar-chunk:last-child) {
  justify-content: flex-end;
}

:deep(.fc-toolbar-title) {
  position: absolute !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  margin: 0 !important;
}

:deep(.fc-event-content) {
  padding: 2px 4px;
}

:deep(.fc-event-description) {
  font-size: 0.8em;
  margin-top: 2px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

:deep(.fc-event-time) {
  font-size: 0.85em;
  margin-bottom: 2px;
}

:deep(.fc-event-title) {
  font-weight: bold;
}

</style>