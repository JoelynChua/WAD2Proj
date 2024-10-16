<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <div class="d-flex align-items-center">
        <button class="navbar-toggler me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand" href="/">Tabi-log</a>
      </div>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto"> <!-- Use mx-auto to center the nav items -->
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Events</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/attractionsList">Attractions</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/itineraryList">Itinerary</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/ExpensePage">Expense</a>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link" href="/calendar">Calendar</a>
          </li>
        </ul>

        <ul class="navbar-nav"> <!-- Separate nav for Profile and Log In / Sign Up -->
          <li class="nav-item" v-if="!isAuthenticated">
            <a class="nav-link" href="/Loginpage">Log In / Sign Up</a>
          </li>
          <li class="nav-item dropdown" v-else>
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="../assets/user-icon.png" alt="User Icon" width="30" height="30" class="rounded-circle" /> <!-- User icon -->
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <a class="dropdown-item" href="/ProfilePage">Profile</a> <!-- Link to profile -->
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="signOut">Sign Out</a> <!-- Sign out link -->
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from '../firebase/firebaseClientConfig'; // Adjust the path to your Firebase config
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // Import Firebase Auth methods

export default {
  name: "navbarNav",
  data() {
    return {
      isAuthenticated: false, // Track authentication state
    };
  },
  created() {
    // Check authentication state on component creation
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user; // Update isAuthenticated based on user state
    });
  },
  methods: {
    async signOut() {
      try {
        await firebaseSignOut(auth); // Sign out from Firebase
        this.isAuthenticated = false; // Update local state
        this.$router.push('/'); // Redirect to home or desired page
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    },
  }
};
</script>

<style scoped>
/* Optional: Add your custom styles here */
</style>

