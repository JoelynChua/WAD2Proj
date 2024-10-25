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
import { ref } from 'vue'

export default {
  props: {
    editingEvent: {
      type: Object,
      required: true
    }
  },
  emits: ['update', 'delete', 'close'],
  
  setup(props, { emit }) {
    // Create a local copy of the event
    const localEvent = ref({
      id: props.editingEvent.id,
      title: props.editingEvent.title,
      description: props.editingEvent.description,
      start: props.editingEvent.start,
      end: props.editingEvent.end,
      startTime: props.editingEvent.startTime,
      endTime: props.editingEvent.endTime,
      allDay: props.editingEvent.allDay,
      color: props.editingEvent.color
    })
  const handleSubmit = () => {
    console.log('Submitting with values:', localEvent.value);
    
    const formattedEvent = {
      id: localEvent.value.id,
      title: localEvent.value.title,
      description: localEvent.value.description,
      allDay: localEvent.value.allDay,
      color: localEvent.value.color
    }

    if (localEvent.value.allDay) {
      formattedEvent.start = `${localEvent.value.start}T00:00:00+08:00`
      formattedEvent.end = `${localEvent.value.end || localEvent.value.start}T23:59:59+08:00`
    } else {
      // Ensure we have valid times
      const startTime = localEvent.value.startTime || '00:00'
      const endTime = localEvent.value.endTime || startTime

      // Add timezone information to the dates
      formattedEvent.start = `${localEvent.value.start}T${startTime}:00+08:00`
      formattedEvent.end = `${localEvent.value.end || localEvent.value.start}T${endTime}:00+08:00`
    }

    console.log('Formatted event for update:', formattedEvent);
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