<template>
  <div style="margin-top: 30px;" class="itinerary-list">
    <h1>My Itineraries</h1>

    <div style="margin: 60px;">
      <!-- Add itinerary -->
      <button v-if="!loginMessage" style="margin-bottom: 20px; display: block; background-color: #c8e0ea"
        @click="toItineraryForm()" class="btn btn">
        <span class="plus-sign">New Itinerary +</span>
      </button>

      <!-- Display login prompt if user is not logged in -->
      <div v-if="loginMessage">
        <p>
          {{ loginMessage }}
          <RouterLink to="/login-for-users">Log in </RouterLink>
        </p>
      </div>

      <!-- Display itineraries if available -->
      <div v-else-if="itineraries.length > 0">
        <div class="carousel-client">
          <div class="slide" v-for="(itinerary, index) in itineraries" :key="index">
            <div class="itinerary-item" @click="getItineraryByID(itinerary.id)">
              <!-- Delete Icon -->
              <font-awesome-icon :icon="['fas', 'trash']" class="delete-icon"
                @click.stop="deleteItinerary(itinerary.id)" title="Delete Itinerary" />
              <div class="itinerary-title">
                {{ itinerary.title }}
                <br />
                <span class="itinerary-date">{{ itinerary.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Display message if no itineraries are available -->
      <div v-else-if="itineraries.length === 0">
        <p>No itinerary available.</p>
      </div>

      <!-- Loading message if itineraries are being fetched -->
      <div v-else>Loading itineraries...</div>
    </div>
  </div>
</template>



<script>
import itineraryService from '../services/itineraryService'; // Adjust the path as needed
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import { auth } from '../firebase/firebaseClientConfig';

// Add the icon to the library
library.add(faTrash);

export default {
  name: 'itineraryList',
  components: {
    FontAwesomeIcon, // Register the component
  },
  //Data Function: The data function returns an object where itineraries is initialized as an empty array to store the itineraries fetched from the server.
  //Defining
  data() {
    return {
      itineraries: [], // Initialize itineraries as an empty array
      uid: null,
      uEmail: null,
      loginMessage: "", // Message displayed when user is not logged in
    };
  },

  //Mounted Hook: This is a lifecycle method that runs when the component is first added to the DOM.
  /*Mounted vs created
  created hook: helps with the loading of data before it is displayed on the webpage
  mounted hook: load data with UI
  Created Hook: Focuses on data loading and initialization before the component is rendered. 
  Use it for preparing data that should be available as soon as the component is shown.
  
  Mounted Hook: Focuses on operations related to the UI and DOM after the component is displayed. 
  Use it for tasks that require the component to be present in the DOM.
*/
  created() {
    // Set up an observer on the Auth object to get user state changes
    this.authListener();
  },

  // async mounted() {
  //   try {
  //     //the properties defined in data() are accessible via this, which refers to the component instance.
  //     this.itineraries = await itineraryService.getItineraryByUserID(sessionStorage.getItem('uid')); // Fetch itineraries from the service
  //     console.log(this.itineraries);
  //   } catch (error) {
  //     console.error("Failed to fetch itineraries:", error);
  //   }
  // },

  methods: {
    getItineraryByID(itineraryID) {
      this.$router.push({ name: 'ItineraryDetails', params: { id: itineraryID } }); // Ensure parameter name matches route
    },
    toItineraryForm() {
      this.$router.push({ name: 'ItineraryForm' });
    },

    async deleteItinerary(itineraryID) {
    try {
        const isConfirmed = window.confirm("Are you sure you want to delete this itinerary?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels
        }

        await itineraryService.deleteItinerary(itineraryID);
        this.itineraries = this.itineraries.filter(itinerary => itinerary.id !== itineraryID);
        // Optionally, you can show a success message or toast notification
    } catch (error) {
        console.error("Error deleting itinerary:", error);
        // Optionally, show an error message
    }
},





    authListener() {
      // Listen to the authentication state
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          // User is signed in
          this.uid = user.uid; // Get the user ID
          this.uEmail = user.email; // Get the user email
          console.log(user.uid, user.email);

          try {
            // Attempt to fetch itineraries by email only
            const itineraries = await this.fetchItineraries(this.uEmail);
            console.log("Loaded itineraries:", itineraries);

            // Store itineraries in the component state if found
            this.itineraries = itineraries || []; // Default to an empty array if no itineraries

          } catch (error) {
            console.error("Error fetching itineraries:", error);
            this.itineraries = []; // Reset itineraries in case of error
          }
        } else {
          // User is signed out
          console.log('User is signed out');
          this.itineraries = []; // Reset itineraries to an empty array
          this.loginMessage = "Please log in to view your itineraries.";
        }
      });
    },

    async fetchItineraries(email) {
      try {
        // Fetch itineraries by email only
        const itineraries = await itineraryService.getItineraryByUserEmail(email);

        console.log("Itineraries fetched by Email:", itineraries);

        return itineraries || []; // Return itineraries or an empty array if none
      } catch (error) {
        console.error("Error in fetchItineraries:", error);
        throw error; // Rethrow the error to be caught in authListener
      }
    }





  },
};
</script>

<style scoped>
body {
  background-color: #eee;
}

.itinerary-list h2 {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: 6px;
  color: #000;
  letter-spacing: 0.3px;
  padding: 0;
}

.itinerary-list::after {
  content: "";
  height: 3px;
  background: #fbb900;
  width: 80px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}

.carousel-client {
  display: flex;
  overflow: auto;
  gap: 20px;
  padding: 2em 0em;
  width: 100%; /* Make sure the carousel takes full width */
}

@media (max-width: 600px) {
  .itinerary-item {
    width: 100%; /* Adjust to fit smaller screens */
  }
  .carousel-client {
    gap: 10px; /* Reduce gap for smaller screens */
  }
}

.carousel-client::-webkit-scrollbar {
  height: 8px;
}
.carousel-client::-webkit-scrollbar-thumb {
  background-color: #cad8dc;
  border-radius: 4px;
}
.carousel-client::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}



.slide {
  min-width: 200px;
  transition: transform 0.5s ease;
  padding: 10px;
}

.itinerary-item {
  display: inline-block; /* Ensure it acts as an inline-block for flex layout */
  background-color: #cad8dc;
  opacity: 0.8;
  border-radius: 10px;
  text-align: center;
  padding: 20px 10px; /* Combined padding-top/bottom and padding-left/right */
  width: 500px; /* Set a larger custom width to make it longer */
  max-width: 100%; /* Prevent it from exceeding the container width */
  box-sizing: border-box; /* Ensure padding is included in the total width */
  cursor: pointer;
  word-wrap: break-word; /* Ensure long words break and wrap to the next line */
  overflow-wrap: break-word; /* Allow wrapping on long words */
  overflow: hidden; /* Prevent content from overflowing */
  margin: 0 auto; /* Center it horizontally, if needed */
}


.itinerary-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}


.itinerary-title {
  font-size: 18px;
  color: black;
  font-weight: bold;
}

.itinerary-date {
  display: block;
  font-size: 16px;
  color: navy;
  margin-top: 10px;
}

.delete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: red;
}
</style>
