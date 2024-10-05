<template>
    <div class="homepage">
      <h1>Upcoming Events</h1>
      <div class="event-container" v-if="events.length">
        <div class="event" v-for="event in events" :key="event.id">
          <h2>{{ event.name }}</h2>
          <p>Date: {{ event.date }}</p>
          <p>Location: {{ event.location }}</p>
          <p>Description: {{ event.description }}</p>
        </div>
      </div>
      <p v-else>No events available.</p>
    </div>
  </template>
  
  <script>
  import eventService from '../services/eventService'; // Import the event service
  
  export default {
    name: 'HomePage',
    data() {
      return {
        events: [], // Initialize events as an empty array
      };
    },
    async mounted() {
      try {
        this.events = await eventService.displayEvents(); // Fetch events from the service
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    },
  };
  </script>
  
  <style>
  .homepage {
    text-align: center;
    padding: 20px;
  }
  
  .event-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
  }
  
  .event {
    border: 1px solid #2c3e50;
    border-radius: 8px;
    padding: 15px;
    margin: 10px;
    width: 80%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .event:hover {
    transform: scale(1.02);
  }
  
  h2 {
    color: #2c3e50;
  }
  
  p {
    color: #555;
  }
  </style>
  