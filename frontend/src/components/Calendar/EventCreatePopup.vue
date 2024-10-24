<template>
    <div class="event-popup">
      <div class="event-popup-content">
        <h2>Create New Event</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group title-group">
            <div class="title-label">
              <label for="title">Title</label>
              <div class="checkbox-group">
                <input type="checkbox" v-model="localEvent.allDay" id="allDay">
                <label for="allDay">All Day Event</label>
              </div>
            </div>
            <input 
              type="text" 
              v-model="localEvent.title" 
              id="title" 
              required 
              placeholder="Enter event title"
            >
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              v-model="localEvent.description" 
              id="description" 
              class="description-textarea" 
              placeholder="Enter event description"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="start">Start Date</label>
            <input 
              v-model="localEvent.start" 
              id="start" 
              type="date" 
              required
            >
          </div>
          <div class="form-group" v-if="!localEvent.allDay">
            <label for="startTime">Start Time</label>
            <input 
              v-model="localEvent.startTime" 
              id="startTime" 
              type="time" 
              required
            >
          </div>
          <div class="form-group">
            <label for="end">End Date</label>
            <input 
              v-model="localEvent.end" 
              id="end" 
              type="date"
            >
          </div>
          <div class="form-group" v-if="!localEvent.allDay">
            <label for="endTime">End Time</label>
            <input 
              v-model="localEvent.endTime" 
              id="endTime" 
              type="time"
            >
          </div>
          <div class="form-group">
            <label for="eventColor">Event Color</label>
            <input 
              type="color" 
              v-model="localEvent.colour" 
              id="eventColor"
            >
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">Add Event</button>
            <button type="button" @click="$emit('close')" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  
  export default {
    name: 'EventCreatePopup',
  
    props: {
      newEvent: {
        type: Object,
        required: true
      }
    },
  
    emits: ['create', 'close'],
  
    setup(props, { emit }) {
      // Local form state
      const localEvent = ref({
        title: '',
        description: '',
        start: '',
        end: '',
        startTime: '',
        endTime: '',
        allDay: false,
        colour: '#fb00bc',
        organiserId: 'current-user-id' // Replace with actual user ID
      })
  
      // Watch for changes in newEvent prop
      watch(() => props.newEvent, (newValue) => {
        localEvent.value = {
          ...localEvent.value,
          ...newValue,
          // Ensure color/colour consistency
          colour: newValue.color || newValue.colour || '#fb00bc'
        }
      }, { deep: true })
  
      // Handle form submission
      const handleSubmit = () => {
        // Combine date and time if not all day event
        const formattedEvent = {
          ...localEvent.value,
          start: localEvent.value.allDay 
            ? localEvent.value.start 
            : `${localEvent.value.start}T${localEvent.value.startTime}`,
          end: localEvent.value.allDay 
            ? localEvent.value.end 
            : `${localEvent.value.end}T${localEvent.value.endTime}`
        }
  
        emit('create', formattedEvent)
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