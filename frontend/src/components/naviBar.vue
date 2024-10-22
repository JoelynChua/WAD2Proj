<template>
  <nav 
    class="navbar navbar-expand-lg navbar-light" 
    :class="{ 
      sticky: isSticky, 
      'navbar-small': isSmall, 
      hidden: isHidden 
    }" style="background-color: #f7f5f5;">
    <div class="container-fluid">
      <div class="d-flex align-items-center">
        <button 
          class="navbar-toggler me-2" 
          type="button" 
          :class="{'navbar-icon-small': isSmall}"
          style="z-index: 1050;"
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon" :class="{'navbar-button-small': isSmall}"
          ></span>
        </button>
        <a class="navbar-brand" href="/">Tabi-log</a>
      </div>

      <div 
        class="collapse navbar-collapse" 
        :class="{ hiddencollapse: isHidden }" 
        id="navbarNav" 
        style="background-color: #f7f5f5">
        <ul class="navbar-nav mx-auto"> <!-- Center the nav items -->
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
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false">
              <img 
                src="../assets/user-icon.png" 
                alt="User Icon" 
                width="30" 
                height="30" 
                class="rounded-circle" /> <!-- User icon -->
            </a>
            <ul class="dropdown-menu dropdown-menu-end" :class="{ hidden: isHidden }" aria-labelledby="navbarDropdown">
              <li>
                <a class="dropdown-item" href="/ProfilePage">Profile</a> <!-- Link to profile -->
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="signOut">Sign Out</a> <!-- Sign out link -->
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
      isSticky: true,        // Track if the navbar should be sticky
      isSmall: false,        // Track if the navbar is small
      isHidden: false,       // Track if the navbar should be hidden
      lastScrollY: 0,       // Store the last scroll position
      stickyTop: 0,         // Store the offset top of the navbar
      scrollThreshold: 200,  // Threshold for hiding the navbar
    };
  },
  created() {
    // Check authentication state on component creation
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user; // Update isAuthenticated based on user state
    });
  },
  mounted() {
    // Set the initial sticky position
    this.stickyTop = this.$el.offsetTop;

    // Add scroll event listener
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    // Clean up the scroll event listener when the component is destroyed
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollY = window.scrollY;

      // Check if the scroll position has reached the navbar's position
      this.isSticky = scrollY >= this.stickyTop;
      this.isSmall = scrollY > 100; // Adjust threshold for small navbar

      // Only hide the navbar if the user has scrolled down past the threshold
      if (scrollY > this.scrollThreshold) {
        if (scrollY > this.lastScrollY) {
          // Scrolling down
          this.isHidden = true;
        } else {
          // Scrolling up
          this.isHidden = false;
        }
      } else {
        // If not past the threshold, ensure the navbar is visible
        this.isHidden = false;
      }

      // Update lastScrollY
      this.lastScrollY = scrollY;
    },
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
.navbar {
  transition: all 0.3s ease; /* Smooth transition for all changes */
  height: 80px; /* Initial height when the page loads */
  padding: 1rem 1.5rem; /* Padding when not scrolled */
}

.sticky {
  position: fixed; /* Fix the navbar when sticky */
  top: 0; /* Position it at the top */
  left: 0; /* Align left */
  right: 0; /* Align right */
  z-index: 1000; /* Ensure it stays on top of other content */
}

.navbar-small {
  height: 50px; /* Height when scrolled down */
  padding: 0.5rem 1rem; /* Smaller padding when scrolled down */
  font-size: 0.9rem; /* Smaller font size when scrolled down */
}

.navbar-icon-small {
  padding: 5px;
  transition: all 0.3s ease; /* Add smooth transition to all properties */

}

.navbar-button-small {
  height: 22px;
  width: 22px;
  transition: all 0.3s ease; /* Add smooth transition to all properties */
}

.hidden {
  transform: translateY(-100%); /* Slide up to hide */
  transition: transform 0.3s ease; /* Smooth transition for the hidden state */
}

.hiddencollapse {
  transform: translateY(-100%); /* Slide up to hide */
  transition: transform 0.9s ease; /* Smooth transition for the hidden state */
}

.navbar-small .navbar-brand {
  font-size: 1.25rem; /* Smaller brand text */
}

.navbar-small .nav-link {
  padding: 0.5rem 1rem; /* Smaller padding for nav links */
}
</style>
