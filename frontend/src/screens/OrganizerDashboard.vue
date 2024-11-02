<template>
    <div class="organizer-dashboard">
      <h1>Welcome to the Organizer Dashboard, {{ organizerName }}!</h1>
      <p>This is your workspace for managing events, viewing analytics, and more.</p>
  
      <!-- Add organizer-specific features here -->
      <div class="dashboard-section">
        <h2>Manage Events</h2>
        <router-link to="/create-event">Create New Event</router-link>
        <!-- Add more links or features for organizers -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        organizerName: 'Organizer', // Example, update with real data if needed
      };
    },
    mounted() {
      this.organizerName = sessionStorage.getItem('displayName') || 'Organizer';
    }
  };
  </script>
  
  <style scoped>
  .organizer-dashboard {
    padding: 20px;
  }
  .dashboard-section {
    margin-top: 20px;
  }
  </style>
  