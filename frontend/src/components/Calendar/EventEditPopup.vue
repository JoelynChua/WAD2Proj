<template>
    <div class="event-popup">
      <div class="event-popup-content">
        <h2>Edit Event</h2>
        <form @submit.prevent="$emit('update')">
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
  import { computed } from 'vue'
  
  export default {
    props: {
      editingEvent: {
        type: Object,
        required: true
      }
    },
    emits: ['update', 'delete', 'close', 'update:editingEvent'],
    setup(props, { emit }) {
      const localEvent = computed({
        get: () => props.editingEvent,
        set: (value) => emit('update:editingEvent', value)
      })
  
      return { localEvent }
    }
  }
  </script>
<style scoped src="./CalendarStyles.css">
</style>