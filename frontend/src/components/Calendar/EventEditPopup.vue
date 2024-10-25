<template>
    <div class="event-popup">
      <div class="event-popup-content">
        <h2>Edit Event</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group title-group">
            <div class="title-label">
              <label for="editTitle">Title</label>
              <div class="checkbox-group">
                <input type="checkbox" v-model="localEvent.allDay" id="editAllDay">
                <label for="editAllDay">All Day Event</label>
              </div>
            </div>
            <input type="text" v-model="localEvent.title" id="editTitle" required placeholder="Enter event title">
          </div>
          <div class="form-group">
            <label for="editDescription">Description</label>
            <textarea v-model="localEvent.description" id="editDescription" class="description-textarea" placeholder="Enter event description"></textarea>
          </div>
          <div class="form-group">
            <label for="editStart">Start Date</label>
            <input v-model="localEvent.start" id="editStart" type="date" required>
          </div>
          <div class="form-group" v-if="!localEvent.allDay">
            <label for="editStartTime">Start Time</label>
            <input v-model="localEvent.startTime" id="editStartTime" type="time" required>
          </div>
          <div class="form-group">
            <label for="editEnd">End Date</label>
            <input v-model="localEvent.end" id="editEnd" type="date">
          </div>
          <div class="form-group" v-if="!localEvent.allDay">
            <label for="editEndTime">End Time</label>
            <input v-model="localEvent.endTime" id="editEndTime" type="time">
          </div>
          <div class="form-group">
            <label for="editEventColor">Event Color</label>
            <input type="color" v-model="localEvent.color" id="editEventColor">
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">Update Event</button>
            <button type="button" @click="$emit('delete')" class="btn btn-danger">Delete Event</button>
            <button type="button" @click="$emit('close')" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  
  export default {
    props: {
      editingEvent: {
        type: Object,
        required: true
      }
    },
    emits: ['update', 'delete', 'close', 'update:editingEvent'],
    
    setup(props, { emit }) {
      const localEvent = ref({...props.editingEvent})
  
      onMounted(() => {
        // Parse the dates when component mounts
        if (props.editingEvent.start) {
          const startDate = new Date(props.editingEvent.start)
          localEvent.value.start = startDate.toISOString().split('T')[0]
          if (!props.editingEvent.allDay) {
            localEvent.value.startTime = startDate.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        }
  
        if (props.editingEvent.end) {
          const endDate = new Date(props.editingEvent.end)
          localEvent.value.end = endDate.toISOString().split('T')[0]
          if (!props.editingEvent.allDay) {
            localEvent.value.endTime = endDate.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        }
      })
  
      const handleSubmit = () => {
        // Combine date and time before emitting
        const formattedEvent = {
          title: localEvent.value.title,
          description: localEvent.value.description,
          allDay: localEvent.value.allDay,
          colour: localEvent.value.color, // Note: fixing the color/colour discrepancy
          organiserId: localEvent.value.organiserId
        }
  
        if (localEvent.value.allDay) {
          formattedEvent.start = `${localEvent.value.start}T00:00:00`
          formattedEvent.end = localEvent.value.end 
            ? `${localEvent.value.end}T23:59:59`
            : `${localEvent.value.start}T23:59:59`
        } else {
          formattedEvent.start = `${localEvent.value.start}T${localEvent.value.startTime}`
          formattedEvent.end = localEvent.value.end && localEvent.value.endTime
            ? `${localEvent.value.end}T${localEvent.value.endTime}`
            : `${localEvent.value.start}T${localEvent.value.startTime}`
        }
  
        console.log('Formatted event for update:', formattedEvent)
        emit('update', formattedEvent)
      }
  
      return {
        localEvent,
        handleSubmit
      }
    }
  }
  </script>
<style scoped src="./CalendarStyles.css">
</style>