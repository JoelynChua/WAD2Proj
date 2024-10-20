<template>
  <div class="homepage">
    <h1>Upcoming Events</h1>
    <div class="event-container" v-if="events.length">
      <div class="event" v-for="event in events" :key="event.id" @click="goToEventDetails(event.id)"
        style="cursor: pointer; position: relative;">
        <!-- Bookmark Icon Positioned in the Top Right -->
        <font-awesome-icon :icon="isBookmarked(event.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
          class="bookmark-icon" @click.stop="toggleWishlist(event.id)" />

        <!-- Event Details -->
        <h2>{{ event.name }}</h2>
        <p>Type: {{ event.type }}</p>
        <p>Age Restrictions: {{ event.ageRestrictions.legalAgeEnforced }}</p>
      </div>
    </div>
    <p v-else>No events available.</p>
  </div>
</template>


<script>
import eventService from '../services/eventService'; // Import the event service
import itineraryService from '../services/itineraryService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';

library.add(faBookmark, farBookmark); // Add the icons to the library

export default {
  name: 'HomePage',
  components: {
    FontAwesomeIcon, // Register the component
  },
  data() {
    return {
      //events is initialized as an empty array. This ensures that events is reactive and can be updated later when data is fetched from the server.
      events: [], // Initialize events as an empty array
      wishlists: [],
      userID: null, // Store userID in data
    };
  },

  /* mounted() hook is part of Vue's lifecycle methods. It is called when the component is fully 
  mounted (i.e., inserted into the DOM). This is a good place to perform actions like fetching data from APIs.
  runs when the component is fully loaded and shown to the user. It's often used to load data from a server or API.*/
  async mounted() {
    try {
      // Fetch attractions first
      this.events = await eventService.displayEvents();
      console.log(this.events);

      // Check if sessionStorage is available
      if (typeof sessionStorage !== 'undefined') {
        this.userID = sessionStorage.getItem('uid');
        console.log(this.userID, "bookmarked");
        this.wishlists = []; // Initialize wishlists as an empty array

        // Check if fetched wishlists has length greater than 0
        if (this.userID) {
          this.wishlists = await itineraryService.getUserWishlist(this.userID); // Assign wishlists only if userID exists
          if (this.wishlists.length > 0) {
            console.log(this.wishlists);
          } else {
            console.warn("No wishlists found for the user.");
          }
        }
      } else {
        console.warn("User ID not found in session storage.");
      }
    } catch (error) {
      console.error("Failed to fetch events or wishlists:", error);
    }
  },

  methods: {
    goToEventDetails(id) {
      // Use Vue Router's 'push' method to navigate to EventDetails page
      this.$router.push({ name: 'EventDetails', params: { id } });
    },

    // wishlist
    isBookmarked(eventID) {
      // Check if the event is in the wishlists
      return this.wishlists.some(wishlist => wishlist.eventID === eventID);
    },

    async toggleWishlist(eventID) {
      const existingWishlist = this.wishlists.find(wishlist => wishlist.eventID === eventID);
      const wishlistID = existingWishlist ? existingWishlist.id : null; // Safely access id

      const newWishlist = {
        userID: this.userID,
        eventID,
      };

      try {
        if (!wishlistID) {
          // If not bookmarked, add to wishlist
          const response = await itineraryService.addWishlist(newWishlist);
          console.log("Wishlist added:", response);
          // Update local state with the new wishlist ID
          this.wishlists.push({ ...newWishlist, id: response.id }); // Use response ID for new wishlist
        } else {
          // If already bookmarked, delete from wishlist
          await itineraryService.deleteWishlist(wishlistID);
          console.log("Wishlist deleted:", wishlistID);
          // Update local state
          this.wishlists = this.wishlists.filter(wishlist => wishlist.id !== wishlistID);
        }

        // Reload the wishlists after adding or deleting
        await this.reloadWishlists();
        console.log("Updated wishlists:", this.wishlists);
      } catch (error) {
        console.error("Failed to update wishlist:", error);
      }
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

.bookmark-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  /* Adjust the icon size */
  color: #2c3e50;
}
</style>