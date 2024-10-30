<template>
    <div class="homepage" style="margin-top: 80px;">
      <div class="hero-section">
        <!-- Background Image with Overlay Text -->
        <div class="hero-content">
          <img />
          <h1>Find Your Event</h1>
        </div>
  
        <!-- Navy Blue Box -->
        <div class="navy-box">
          <div class="form-field search-bar">
            <div class="search-container">
              <i class="fi fi-rr-search search-icon"></i>
              <input
                type="text"
                placeholder="Search for events..."
                aria-label="Search"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="filter-container">
        <h1>Upcoming Events</h1>
        <div class="dropdown-container">
          <i class="fi fi-rr-angle-small-down dropdown-icon"></i>
          <select id="event-filter" class="custom-dropdown">
            <option value="all">All Events</option>
            <option value="wishlist">My Wishlist</option>
          </select>
        </div>
      </div>
      <div class="event-container" v-if="events.length">
        <div
          class="event"
          v-for="event in events"
          :key="event.id"
          @click="goToEventDetails(event.id)"
          style="cursor: pointer; position: relative"
        >
          <!-- Event Image Placeholder -->
          <img
            :src="
              event.image ||
              'https://via.placeholder.com/300x200?text=Event+Image'
            "
            alt="Event image"
            class="event-image"
          />
  
          <!-- Bookmark Icon Positioned in the Top Right -->
          <font-awesome-icon
            :icon="
              isBookmarked(event.id)
                ? ['fas', 'bookmark']
                : ['far', 'bookmark']
            "
            class="bookmark-icon"
            @click.stop="toggleWishlist(event.id)"
          />
  
          <!-- Event Details -->
          <div class="event-details">
            <h2>{{ event.name }}</h2>
            <p>Type: {{ event.type }}</p>
            <p>
              Age Restrictions:
              {{ event.ageRestrictions.legalAgeEnforced }}
            </p>
          </div>
        </div>
      </div>
      <p v-else>No events available.</p>
      <p v-if="!isAuthenticated" class="text-center">
        Please log in to see events. 
        <button @click="$emit('toggle-modal')" class="btn btn-link">Log In</button>
      </p>
    </div>
  </template>
  
  <script>
  import eventService from '../services/eventService'; // Import the event service
  import itineraryService from '../services/itineraryService';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { faBookmark } from '@fortawesome/free-solid-svg-icons';
  import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
  import { getAuth } from 'firebase/auth';
  
  library.add(faBookmark, farBookmark); // Add the icons to the library
  
  export default {
    name: 'EventPage',
    components: {
      FontAwesomeIcon, // Register the component
    },
    data() {
      return {
        events: [], // Initialize events as an empty array
        wishlists: [],
        userID: null, // Store userID in data
        isAuthenticated: false, // Track authentication state
      };
    },
  
    async mounted() {
      try {
        // Fetch events first
        this.events = await eventService.displayEvents();
        console.log(this.events);
  
        this.authListener();
  
        if (this.userID) {
          this.wishlists = await itineraryService.getUserWishlist(
            this.userID
          ); // Assign wishlists if userID exists
          if (this.wishlists.length > 0) {
            console.log(this.wishlists);
          } else {
            console.warn('No wishlists found for the user.');
          }
        } else {
          console.warn('User ID not found in Vuex store.');
        }
      } catch (error) {
        console.error('Failed to fetch events or wishlists:', error);
      }
    },
  
    methods: {
      goToEventDetails(id) {
        // Use Vue Router's 'push' method to navigate to EventDetails page
        this.$router.push({ name: 'EventDetails', params: { id } });
      },
  
      isBookmarked(eventID) {
        // Check if the event is in the wishlists
        return this.wishlists.some(
          (wishlist) => wishlist.eventID === eventID
        );
      },
  
      authListener() {
        const auth = getAuth();
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            this.isAuthenticated = true; // User is logged in
            this.userID = user.uid;
            try {
              this.itineraries = await itineraryService.getItineraryByUserID(this.userID);
              console.log(this.itineraries);
              await this.reloadWishlists();
            } catch (error) {
              console.error('Failed to fetch itineraries:', error);
            }
          } else {
            console.log('User is signed out');
            this.isAuthenticated = false; // User is logged out
            // Emit event to show the login modal
            this.$emit('toggle-modal');
          }
        });
      },
  
      async toggleWishlist(eventID) {
        const existingWishlist = this.wishlists.find(
          (wishlist) => wishlist.eventID === eventID
        );
        const wishlistID = existingWishlist ? existingWishlist.id : null; // Safely access id
  
        const newWishlist = {
          userID: this.userID,
          eventID,
        };
  
        try {
          if (!wishlistID) {
            // If not bookmarked, add to wishlist
            const response = await itineraryService.addWishlist(
              newWishlist
            );
            console.log('Wishlist added:', response);
            // Update local state with the new wishlist ID
            this.wishlists.push({ ...newWishlist, id: response.id }); // Use response ID for new wishlist
          } else {
            // If already bookmarked, delete from wishlist
            await itineraryService.deleteWishlist(wishlistID);
            console.log('Wishlist deleted:', wishlistID);
            // Update local state
            this.wishlists = this.wishlists.filter(
              (wishlist) => wishlist.id !== wishlistID
            );
          }
  
          // Reload the wishlists after adding or deleting
          await this.reloadWishlists();
          console.log('Updated wishlists:', this.wishlists);
        } catch (error) {
          console.error('Failed to update wishlist:', error);
        }
      },
  
      async reloadWishlists() {
        try {
          if (this.userID) {
            this.wishlists = await itineraryService.getUserWishlist(
              this.userID
            ); // Fetch updated wishlists
          }
        } catch (error) {
          console.error('Failed to reload wishlists:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .homepage {
      text-align: center;
      padding: 40px;
      background: #f9f9f9;
      color: #333;
  }
  .hero-section {
      position: relative;
      width: 100%;
      height: 500px; /* Adjust the height as needed */
      background-image: url('https://plus.unsplash.com/premium_photo-1661943659036-aa040d92ee64?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); /* Replace with your image URL */
      background-size: cover;
      background-position: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      padding-top: 50px;
  }
  .hero-content {
      position: relative;
      z-index: 1; /* Ensures it stays above the background */
      color: white;
      text-align: center;
  }
  .hero-content h1 {
      font-size: 3em;
      margin: 0;
  }
  .navy-box {
      position: absolute;
      bottom: -30px; /* Set a negative value to extend it beyond the hero section */
      width: 70%; /* Adjust width as needed */
      max-width: 1000px;
      background-color: #1a1a40; /* Navy blue color */
      padding: 15px 20px;
      align-items: center;
      color: white;
      border-radius: 8px; /* Optional rounded corners */
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for visual depth */
      z-index: 2; /* Ensure it overlaps any content below */
  }
  .search-container {
      position: relative;
      margin: auto;
      width: 90%;
  }
  .search-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-40%);
      font-size: 1.2em;
      color: #888;
      pointer-events: none;
  }
  
  .form-field {
      display: flex;
      align-items: center;
      margin: 0 10px;
      flex: 1;
  }
  .search-bar {
      flex: 1; /* Makes the search bar take up more space */
  }
  .search-container input[type='text'] {
      padding: 10px 15px;
      padding-left: 40px;
      width: 100%; /* Takes full width of the .form-field */
      border: 2px solid #87cefa; /* Light blue border */
      border-radius: 25px; /* Fully rounded corners */
      font-size: 1em;
      color: #333;
      background-color: #f5f5f5; /* Light gray background */
      outline: none;
      transition: background-color 0.3s ease;
  }
  .search-container input[type='text']:hover {
      background-color: #e0e0e0; /* Slightly darker grey on hover */
  }
  .filter-container {
      padding: 20px;
      margin: 0 auto;
      margin-top: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 900px;
  }
  .filter-container h1 {
      font-size: 2em;
      color: #333;
      margin: 0;
      font-weight: bolder;
  }
  .dropdown-container {
      position: relative; /* Relative positioning for icon placement */
      display: inline-block;
  }
  
  .custom-dropdown {
      padding: 10px 40px 10px 20px; /* Add right padding for the icon */
      font-size: 1em;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 12px;
      background-color: #f9f9f9;
      appearance: none; /* Removes default arrow */
      outline: none;
      cursor: pointer;
      font-weight: bold;
      width: 150px; /* Adjust width as needed */
  }
  
  .dropdown-icon {
      position: absolute;
      right: 15px; /* Position inside the dropdown box */
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.8em;
      color: #888;
      pointer-events: none; /* Make the icon unclickable */
  }
  
  .custom-dropdown:hover {
      border-color: #bbb;
  }
  
  .custom-dropdown option:hover {
      background-color: #26f501; /* Light blue on hover */
      color: #333; /* Text color on hover */
  }
  
  .event-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      margin-top: 50px;
  }
  
  .event {
      position: relative;
      border: 1px solid #e0e4e7;
      border-radius: 10px;
      background-color: #fff;
      overflow: hidden;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.1s ease;
      max-width: 300px; /* Set a max-width to ensure the image does not exceed the card width */
      margin: 0 auto; /* Center align each card */
  }
  
  .event:hover {
      transform: scale(1.03);
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  /* Event Image Styling */
  .event-image {
      width: 100%; /* Ensure the image fills the width of the card */
      height: auto;
      display: block;
      margin: 0 auto;
      object-fit: cover; /* Maintain aspect ratio while covering the area */
  }
  
  /* Event Details Styling */
  .event-details {
      padding: 15px;
      text-align: center;
  }
  
  .event-details h2 {
      color: #34495e;
      font-size: 1.2em;
      margin: 10px 0;
  }
  
  .event-details p {
      color: #666;
      font-size: 0.9em;
      line-height: 1.4;
  }
  
  /* Bookmark Icon */
  .bookmark-icon {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 22px;
      color: #34495e;
      transition: color 0.3s;
  }
  
  .bookmark-icon:hover {
      color: #e74c3c;
  }
  </style>
  