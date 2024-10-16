<template>
    <div class="calendar-page">
      <CalendarComponent />
    </div>
  </template>
  
  <script>
  import CalendarComponent from '../components/CalendarComponent.vue'
  
  export default {
    name: 'CalendarPage',
    components: {
      CalendarComponent
    }
  }
  </script>
  
  <style scoped>
  .calendar-page {
    padding: 20px;
  }
  </style>