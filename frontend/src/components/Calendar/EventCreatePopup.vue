<template>
  <div class="event-popup">
    <div class="event-popup-content">
      <h2>Create Event</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group title-group">
          <div class="title-label">
            <label for="title">Title</label>
            <div class="checkbox-group">
              <input type="checkbox" v-model="localEvent.allDay" id="allDay">
              <label for="allDay">All Day Event</label>
            </div>
          </div>
          <input type="text" v-model="localEvent.title" id="title" required placeholder="Enter event title">
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea v-model="localEvent.description" id="description" class="description-textarea" placeholder="Enter event description"></textarea>
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
          <input type="color" v-model="localEvent.colour" id="eventColor">
        </div>
        <div class="button-group">
          <button type="submit" class="btn btn-primary">Create Event</button>
          <button type="button" @click="$emit('close')" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: {
    newEvent: {
      type: Object,
      required: true
    }
  },
  
  emits: ['create', 'close'],
  
  setup(props, { emit }) {
    const localEvent = ref({ ...props.newEvent })

    // Watch for changes to the newEvent prop
    watch(() => props.newEvent, (newVal) => {
      localEvent.value = { ...newVal }
    }, { deep: true })

    const handleSubmit = () => {
      const formattedEvent = {
        title: localEvent.value.title,
        description: localEvent.value.description,
        colour: localEvent.value.colour,
        allDay: localEvent.value.allDay,
        organiserId: localEvent.value.organiserId
      }

      if (localEvent.value.allDay) {
        formattedEvent.start = `${localEvent.value.start}T00:00:00.000Z`
        formattedEvent.end = `${localEvent.value.start}T23:59:59.999Z`
      } else {
        formattedEvent.start = `${localEvent.value.start}T${localEvent.value.startTime}:00.000Z`
        formattedEvent.end = `${localEvent.value.end || localEvent.value.start}T${localEvent.value.endTime}:00.000Z`
      }

      console.log('Submitting event:', formattedEvent)
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