<template>
    <div class="homepage">
        <div class="hero-section">
            <!-- Background Image with Overlay Text -->
            <div class="hero-content">
                <img />
                <h1>Find Your Event</h1>
            </div>

            <!-- Navy Blue Box -->
            <div class="navy-box" :class="{ 'visible': showSearchBar }">
                <div class="form-field search-bar">
                    <div class="search-container">
                        <i class="fi fi-rr-search search-icon"></i>
                        <input type="text" placeholder="Search for events..." aria-label="Search" v-model="searchQuery"
                            @keyup="searchEvents(searchQuery)" />
                    </div>
                </div>
            </div>
        </div>


        <PopularEvents :events="events" />

        <!-- Events filter -->
        <div v-if="userID" class="filter-container">
            <h1>Upcoming Events</h1>
            <div class="dropdown-container">
                <i class="fi fi-rr-angle-small-down dropdown-icon"></i>
                <select id="event-filter" class="custom-dropdown" v-model="selectedFilter">
                    <option value="all">All Events</option>
                    <option value="wishlist">My Wishlist</option>
                </select>
            </div>
        </div>

        <div class="event-container" v-if="selectedFilter === 'wishlist' && filteredEvents.length">
            <div class="event" v-for="event in filteredEvents" :key="event.id" @click="goToEventDetails(event.id)"
                @popevent="goToEventDetails(event.id)" style="cursor: pointer; position: relative">
                <!-- Event Image Placeholder -->
                <img :src="event.images[0].url ||
                    'https://via.placeholder.com/300x200?text=Event+Image'
                    " alt="Event image" class="event-image" />

                <!-- Bookmark Icon Positioned in the Top Right -->
                <font-awesome-icon v-if="userID" :icon="isBookmarked(event.id)
                    ? ['fas', 'bookmark']
                    : ['far', 'bookmark']
                    " class="bookmark-icon" @click.stop="toggleWishlist(event.id)" />

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
        <!-- <p v-else>No events available.</p> -->



        <div v-else>
            <div v-if="events.length" class="event-container">
                <div class="event" v-for="event in events" :key="event.id" @click="goToEventDetails(event.id)"
                    @popevent="goToEventDetails(event.id)" style="cursor: pointer; position: relative">
                    <!-- Event Image Placeholder -->
                    <img :src="event.images[0].url ||
                        'https://via.placeholder.com/300x200?text=Event+Image'
                        " alt="Event image" class="event-image" />

                    <!-- Bookmark Icon Positioned in the Top Right -->
                    <font-awesome-icon v-if="userID" :icon="isBookmarked(event.id)
                        ? ['fas', 'bookmark']
                        : ['far', 'bookmark']
                        " class="bookmark-icon" @click.stop="toggleWishlist(event.id)" />

                    <!-- Event Details -->
                    <div class="event-details">
                        <h2>{{ event.name }}</h2>
                        <p>Type: {{ event.type }}</p>
                        <!-- <p>
                            Age Restrictions:
                            {{ event.ageRestrictions.legalAgeEnforced }}
                        </p> -->
                    </div>
                </div>
            </div>
            <p v-else>No events available.</p>

        </div>

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
// import axios from 'axios';


import PopularEvents from '../components/PopularEvents.vue';

library.add(faBookmark, farBookmark); // Add the icons to the library

export default {
    name: 'HomePage',
    components: {
        FontAwesomeIcon,
        PopularEvents, // Register the component
    },
    data() {
        return {
            events: [], // Initialize events as an empty array
            wishlists: [],
            userID: null, // Store userID in data
            showSearchBar: false,
            selectedFilter: 'all', // Default filter to show all events
            searchQuery: '', // Bind to the search input

        };
    },
    async created() {
        try {
            this.events = await eventService.displayEvents();
            console.log(this.events);
        } catch (error) {
            console.error('Failed to fetch events or wishlists:', error);
        }
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },

    async mounted() {
        try {
            // Set up the authentication listener first
            this.authListener();

            // Fetch events only after the user state has been set
            if (this.userID) {
                this.events = await eventService.displayEvents();
                console.log(this.events);
                this.wishlists = await itineraryService.getUserWishlist(this.userID); // Fetch wishlists if userID exists
            } else {
                // If userID is not available yet, you might want to fetch events without wishlists
                this.events = await eventService.displayEvents();
                console.log(this.events);
            }
        } catch (error) {
            console.error('Failed to fetch events or wishlists:', error);
        }

        window.addEventListener('scroll', this.handleScroll);
    },
    computed: {
        /*
        computed property will automatically re-evaluate and return the updated result. This behavior is ideal for scenarios 
        where you want to display derived state based on existing reactive data.

        This means that if you reference a computed property multiple times in your template, Vue only recalculates its value 
        once and reuses the cached result, enhancing performance.

        Method only perfor again when its called
        */
        filteredEvents() {
            // If userID is present and wishlists are loaded, filter the events
            if (this.userID && this.wishlists.length) {
                return this.events.filter(event =>
                    this.wishlists.some(wishlist => wishlist.eventID === event.id)
                );
            }
            console.log(this.wishlists); // Log wishlists for debugging
            return this.events; // Return all events if no userID or no wishlists
        }
    },


    methods: {
        handleScroll() {
            if (window.scrollY > 120) {
                this.showSearchBar = true;
            } else {
                this.showSearchBar = false;
            }
        },
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
            const auth = getAuth(); // Initialize Firebase auth here
            // Listen to the authentication state
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // User is signed in
                    this.userID = user.uid; // Get the user ID
                    try {
                        // Fetch itineraries using the UID
                        this.itineraries =
                            await itineraryService.getItineraryByUserID(
                                this.userID
                            );
                        console.log(this.itineraries);
                        await this.reloadWishlists(); // Reload wishlists after fetching itineraries
                    } catch (error) {
                        console.error('Failed to fetch itineraries:', error);
                    }
                } else {
                    // User is signed out
                    console.log('User is signed out');
                    // Optionally redirect to login page or handle sign-out logic here
                    // this.$router.push('/login');
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

        // Search
        async searchEvents(query) {
            console.log(query, "QUERY");

            // Check if the query is empty
            if (query && query.length > 0) {
                try {
                    this.events = await eventService.searchEventName(query);
                    console.log(this.events, "searched events");
                } catch (error) {
                    console.error('Error searching events:', error);
                    this.events = [];
                }
            } else {
                // If query is empty, fetch all events
                this.events = await eventService.displayEvents();
                console.log(this.events, "all events"); // Log the fetched events for clarity
            }
        }

    },
};
</script>

<style scoped>
.homepage {
    text-align: center;
    background: #f9f9f9;
    color: #333;
}

.hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    /* Adjust the height as needed */
    background-image: url('https://plus.unsplash.com/premium_photo-1661943659036-aa040d92ee64?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    /* Replace with your image URL */
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 1;
    /* Ensures it stays above the background */
    color: white;
    text-align: center;
}

.hero-content h1 {
    font-size: 3em;
    margin: 0;
}

.navy-box {
    position: absolute;
    bottom: -20px;
    /* Final position of the box */
    width: 70%;
    max-width: 1000px;
    background-color: #1a1a40;
    padding: 15px 20px;
    align-items: center;
    color: white;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.5s ease-in-out;
    z-index: 2;
    opacity: 0;
    /* Initially hidden */
    transform: translateY(100%);
    /* Initially moved below */
}

.navy-box.visible {
    opacity: 1;
    /* Make it visible */
    transform: translateY(0);
    /* Move to the final position */
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
    flex: 1;
    /* Makes the search bar take up more space */
}

.search-container input[type='text'] {
    padding: 10px 15px;
    padding-left: 40px;
    width: 100%;
    /* Takes full width of the .form-field */
    border: 2px solid #87cefa;
    /* Light blue border */
    border-radius: 25px;
    /* Fully rounded corners */
    font-size: 1em;
    color: #333;
    background-color: #f5f5f5;
    /* Light gray background */
    outline: none;
    transition: background-color 0.3s ease;
}

.search-container input[type='text']:hover {
    background-color: #e0e0e0;
    /* Slightly darker grey on hover */
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
    position: relative;
    /* Relative positioning for icon placement */
    display: inline-block;
}

.custom-dropdown {
    padding: 10px 40px 10px 20px;
    /* Add right padding for the icon */
    font-size: 1em;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 12px;
    background-color: #f9f9f9;
    appearance: none;
    /* Removes default arrow */
    outline: none;
    cursor: pointer;
    font-weight: bold;
    width: 150px;
    /* Adjust width as needed */
}

.dropdown-icon {
    position: absolute;
    right: 15px;
    /* Position inside the dropdown box */
    top: 50%;
    transform: translateY(-40%);
    font-size: 0.8em;
    color: #888;
    pointer-events: none;
    /* Make the icon unclickable */
}

.custom-dropdown:hover {
    border-color: #bbb;
}

.custom-dropdown option:hover {
    background-color: #26f501;
    /* Light blue on hover */
    color: #333;
    /* Text color on hover */
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
    max-width: 300px;
    /* Set a max-width to ensure the image does not exceed the card width */
    margin: 0 auto;
    /* Center align each card */
}

.event:hover {
    transform: scale(1.03);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

/* Event Image Styling */
.event-image {
    width: 100%;
    /* Ensure the image fills the width of the card */
    height: auto;
    display: block;
    margin: 0 auto;
    object-fit: cover;
    /* Maintain aspect ratio while covering the area */
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
