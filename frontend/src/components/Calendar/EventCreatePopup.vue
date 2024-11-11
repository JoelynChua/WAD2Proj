<template>
  <div class="event-popup">
    <div class="event-popup-content">
      <div class="popup-header">
        <h2>Create Event</h2>
        <button class="close-button" @click="$emit('close')">
          <i class="fi fi-rr-cross"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-body">
          <!-- Title and All Day Checkbox -->
          <div class="form-group title-group">
            <div class="input-with-icon">
              <span class="input-icon">
                <i class="fi fi-rr-edit"></i>
              </span>
              <input type="text" v-model="localEvent.title" id="title" required placeholder="Add title and time"
                class="title-input">
            </div>
          </div>

          <!-- Date/Time Section -->
          <div class="form-group datetime-group">
            <div class="datetime-icon">
              <i class="fi fi-rr-calendar"></i>
            </div>
            <div class="datetime-inputs">
              <div class="date-row above-date-row">
                <input v-model="localEvent.start" id="start" type="date" required class="date-input">
                <input v-if="!localEvent.allDay" v-model="localEvent.startTime" id="startTime" type="time" required
                  class="time-input">
              </div>
              <div class="date-row">
                <input v-model="localEvent.end" id="end" type="date" class="date-input">
                <input v-if="!localEvent.allDay" v-model="localEvent.endTime" id="endTime" type="time"
                  class="time-input">
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <div class="input-with-icon">
              <span class="input-icon">
                <i class="fi fi-rr-document-signed"></i>
              </span>
              <textarea v-model="localEvent.description" id="description" class="description-textarea"
                placeholder="Add description"></textarea>
            </div>
          </div>

          <!-- Price -->
          <div class="form-group">
            <div class="input-with-icon">
              <span class="input-icon">
                <i class="fi fi-rr-usd-circle"></i>
              </span>
              <input type="number" v-model="localEvent.price" id="price" class="title-input" placeholder="Price" min="0"
                step="0.01">
            </div>
          </div>

          <!-- Color Picker -->
          <div class="form-group color-group">
            <span class="input-icon">
              <i class="fi fi-rr-palette"></i>
            </span>
            <input type="color" v-model="localEvent.colour" id="eventColor" class="color-picker">
            <label for="eventColor">Event color</label>
            <div class="all-day-toggle">
              <input type="checkbox" v-model="localEvent.allDay" id="allDay" class="all-day-checkbox">
              <label for="allDay">All Day</label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="popup-footer">
          <div class="button-group">
            <button type="submit" class="btn btn-primary">Create</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import '../../../node_modules/@flaticon/flaticon-uicons/css/regular/all.css';
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

    // EventCreatePopup.vue
    const handleSubmit = () => {
      const formattedEvent = {
        title: localEvent.value.title,
        description: localEvent.value.description,
        colour: localEvent.value.colour,
        allDay: localEvent.value.allDay,
        organiserId: localEvent.value.organiserId,
        price: localEvent.value.price,
      }

      if (localEvent.value.allDay) {
        // For all-day events, use start date and add one day to end date
        formattedEvent.start = `${localEvent.value.start}T00:00:00+08:00`
        // For multi-day events, we need the end date to be the end of the last day
        const endDate = new Date(localEvent.value.end)
        endDate.setHours(23, 59, 59)
        formattedEvent.end = endDate.toISOString().replace('Z', '+08:00')
      } else {
        formattedEvent.start = `${localEvent.value.start}T${localEvent.value.startTime || '00:00'}:00+08:00`
        // For multi-day events with times, use the actual end date and time
        formattedEvent.end = `${localEvent.value.end}T${localEvent.value.endTime || '23:59'}:00+08:00`
      }

      console.log('Formatted event data:', formattedEvent);
      emit('create', formattedEvent)
    }




    return {
      localEvent,
      handleSubmit
    }
  }
}
</script>

<style scoped src="./CalendarStyles.css"></style>