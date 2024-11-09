<template>
  <div class="event-popup">
    <div class="event-popup-content">
      <div class="popup-header">
        <h2>Edit Event</h2>
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
                <input v-model="localEvent.start" id="editStart" type="date" required class="date-input">
                <input v-if="!localEvent.allDay" v-model="localEvent.startTime" id="editStartTime" type="time" required
                  class="time-input">
              </div>
              <div class="date-row">
                <input v-model="localEvent.end" id="editEnd" type="date" class="date-input">
                <input v-if="!localEvent.allDay" v-model="localEvent.endTime" id="editEndTime" type="time"
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
              <textarea v-model="localEvent.description" id="editDescription" class="description-textarea"
                placeholder="Add description"></textarea>
            </div>
          </div>

          <!-- Price -->
          <div class="form-group">
            <div class="input-with-icon">
              <span class="input-icon">
                <i class="fi fi-rr-usd-circle"></i>
              </span>
              <input type="text" v-model="localEvent.price" id="price" class="title-input" placeholder="Price">
            </div>
          </div>

          <!-- Color Picker -->
          <div class="form-group color-group">
            <span class="input-icon">
              <i class="fi fi-rr-palette"></i>
            </span>
            <input type="color" v-model="localEvent.color" id="editEventColor" class="color-picker">
            <label for="editEventColor">Event color</label>
            <div class="all-day-toggle">
              <input type="checkbox" v-model="localEvent.allDay" id="allDay" class="all-day-checkbox">
              <label for="allDay">All Day</label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="popup-footer">
          <div class="button-group">
            <button type="button" @click="$emit('delete')" class="btn btn-text btn-danger"> Delete
            </button>
            <button type="button" @click="$emit('close')" class="btn btn-text">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import '../../../node_modules/@flaticon/flaticon-uicons/css/regular/all.css';
import { ref} from 'vue'

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
    console.log('Raw editingEvent:', props.editingEvent);
    console.log('Price from editingEvent:', props.editingEvent.price);
    const localEvent = ref({
      id: props.editingEvent.id,
      title: props.editingEvent.title,
      price: props.editingEvent.price,
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
        price: localEvent.value.price,
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
<style scoped src="./CalendarStyles.css"></style>