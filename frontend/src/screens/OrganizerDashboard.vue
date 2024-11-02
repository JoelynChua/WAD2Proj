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
import { auth, database } from '../firebase/firebaseClientConfig'; // Import Firebase Auth and Database
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database'; // Import database methods

export default {
  data() {
    return {
      organizerName: 'Organizer', // Default if displayName not found
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Retrieve the displayName from Firebase Database
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          this.organizerName = userData.displayName || 'Organizer'; // Set organizerName from Database
          console.log(this.organizerName);
          console.log("Display name retrieved from Firebase Database.");
        } else {
          console.warn("No user data found in Firebase Database.");
        }
      } else {
        console.warn("User is not authenticated.");
      }
    });
  },
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
  