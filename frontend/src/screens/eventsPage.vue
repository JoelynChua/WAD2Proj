<template>
    <div class="homepage">
        <div class="hero-section">
            <video ref="backgroundVideo" autoplay muted loop playsinline id="background-video">
                <source src="https://videos.pexels.com/video-files/4916813/4916813-hd_1920_1080_30fps.mp4"
                    type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div class="hero-content">
                <div class="display-1 z-1">Find Your <span style="color: red">Event</span></div>
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

        <transition name="popular-event-slide-fade">
            <PopularEvents v-if="!searchQuery" :events="pop_events" :isEvent="true" />
        </transition>

        <!-- Events filter -->
        <div v-if="userID" class="filter-container">
            <h1>Upcoming Events</h1>
            <div class="dropdown-container" v-if="isCustomer">
                <i class="fi fi-rr-angle-small-down dropdown-icon"></i>
                <select id="event-filter" class="custom-dropdown" v-model="selectedFilter">
                    <option value="all">All Events</option>
                    <option value="wishlist">My Wishlist</option>
                </select>
            </div>
        </div>
        <div v-else style="padding-top: 135px;">
            <h1>Upcoming Events</h1>
        </div>

        <!-- Wishlist Filtered Events -->
        <div class="container mt-4" v-if="selectedFilter === 'wishlist' && filteredEvents.length">
            <div class="row">
                <div class="col-lg-4 col-md-6 col-12 mb-4" v-for="event in filteredEvents" :key="event.id">
                    <div class="card event" @click="goToEventDetails(event.id)"
                        style="cursor: pointer; position: relative;">
                        <!-- Event Image Section -->
                        <div v-if="event.type === 'Organiser Event'" class="custom-event-image"
                            :style="{ backgroundColor: event.colour || '#1a1a40' }">
                            <img src="../assets/logo.png" alt="Event logo" class="event-logo" />
                        </div>
                        <img v-else :src="event.images[0].url" alt="Event image" class="ticketmaster-image" />

                        <!-- Bookmark Icon -->
                        <div class="icon-container" v-if="!isBookmarked(event.id)">
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(event.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(event.id)" />
                        </div>
                        <div class="fixed-icon-container" v-else>
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(event.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(event.id)" />
                        </div>

                        <!-- Event Details -->
                        <div class="card-body text-start">
                            <p class="card-text">{{ event.classifications && event.classifications[0] ?
                                event.classifications[0].genre.name : event.type }}</p>
                            <h5 class="card-title fs-4 mb-0">
                                <span>
                                    {{ event.name.length > 48 ? event.name.substring(0, 48) + '...' : event.name }}
                                </span>
                            </h5>
                            <p class="card-text mt-0">
                                {{ new Date(event.dates?.start?.dateTime || event.start).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) }}
                            </p>
                            <p v-if="event.type == 'Organiser Event'" class="card-text" style="position: absolute;
                            color: rgb(51, 51, 51);
                            font-size: 16px;
                            bottom: 5px;
                            right: 25px;
                            padding: 5px 10px">
                                <b>From S${{ event.price }}</b>
                            </p>

                            <p v-else class="card-text" style="position: absolute;
                            color: rgb(51, 51, 51);
                            font-size: 16px;
                            bottom: 5px;
                            right: 25px;
                            padding: 5px 10px">
                                <b>From {{ event.priceRanges[0].currency == "USD" ? 'US$': event.priceRanges[0].currency  }}{{ event.priceRanges[0].min }}</b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- All Events (Default View) -->
        <div class="container mt-4" v-else>
            <div class="row" v-if="sortedEvents.length">
                <div class="col-lg-4 col-md-6 col-12 mb-4" v-for="event in sortedEvents" :key="event.id">
                    <div class="card event" @click="goToEventDetails(event.id)"
                        style="cursor: pointer; position: relative;">
                        <!-- Event Image Section -->
                        <div v-if="event.type === 'Organiser Event'" class="custom-event-image"
                            :style="{ backgroundColor: event.colour || '#1a1a40' }">
                            <img src="../assets/logo.png" alt="Event logo" class="event-logo" />
                        </div>
                        <img v-else :src="event.images[0].url" alt="Event image" class="ticketmaster-image" />

                        <!-- Bookmark Icon -->
                        <div class="icon-container" v-if="!isBookmarked(event.id) && isCustomer">
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(event.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(event.id)" />
                        </div>
                        <div class="fixed-icon-container" v-if="isBookmarked(event.id) && isCustomer">
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(event.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(event.id)" />
                        </div>

                        <!-- Event Details -->
                        <div class="card-body text-start">
                            <p class="card-text">{{ event.classifications && event.classifications[0] ?
                                event.classifications[0].genre.name : event.type }}</p>
                            <h5 class="card-title fs-4 mb-0">
                                <span>
                                    {{ event.name.length > 48 ? event.name.substring(0, 48) + '...' : event.name }}
                                </span>
                            </h5>
                            <p class="card-text mt-0">
                                {{ new Date(event.dates?.start?.dateTime || event.start).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) }}
                            </p>
                            <p v-if="event.type == 'Organiser Event'" class="card-text" style="position: absolute;
                            color: rgb(51, 51, 51);
                            font-size: 16px;
                            bottom: 5px;
                            right: 25px;
                            padding: 5px 10px">
                                <b>From S${{ event.price }}</b>
                            </p>

                            <p v-else class="card-text" style="position: absolute;
                            color: rgb(51, 51, 51);
                            font-size: 16px;
                            bottom: 5px;
                            right: 25px;
                            padding: 5px 10px">
                                <b>From {{ event.priceRanges[0].currency == "USD" ? 'US$': event.priceRanges[0].currency  }}{{ event.priceRanges[0].min }}</b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-else>No events available.</p>
        </div>
    </div>
</template>

<script>
import eventService from '../services/eventService'; // Import the event service
import organiserEventService from '../services/organiserEventService';
import itineraryService from '../services/itineraryService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { getAuth } from 'firebase/auth';
import { ref as dbRef, getDatabase, get } from 'firebase/database';

// import axios from 'axios';


import PopularEvents from '../components/PopularEvents.vue';

library.add(faBookmark, farBookmark); // Add the icons to the library

export default {
    components: {
        FontAwesomeIcon,
        PopularEvents,
    },
    data() {
        return {
            events: [], // Initialize events as an empty array, ticket master events
            organiserEvents: [], // organiser events from firebase
            eventDateMap: [], // Master list of both event origin types -> {id, date} objects
            wishlists: [],
            userID: null, // Store userID in data
            showSearchBar: false,
            selectedFilter: 'all', // Default filter to show all events
            searchQuery: '', // Bind to the search input
            pop_events: [],
            filteredTicketmasterEvents: [], // New property to store filtered Ticketmaster events
            filteredOrganiserEvents: [], // New property to store filtered organizer events
            isCustomer: false,


        };
    },

    async created() {
        this.authListener();
        try {
            // Fetch both types of events
            const [ticketmasterEvents, organiserEvents] = await Promise.all([
                eventService.displayEvents(),
                organiserEventService.getAllEvents()
            ]);

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

            // Filter out organiserEvents that are in the past
            this.organiserEvents = organiserEvents.filter(event => {
                const eventDate = new Date(event.start);
                eventDate.setHours(0, 0, 0, 0); // Set to midnight for comparison
                return eventDate >= today; // Only keep events that are today or in the future
            });

            this.events = ticketmasterEvents;

            // Create the master date-sorted list
            this.eventDateMap = [
                ...ticketmasterEvents.map(event => ({
                    id: event.id,
                    date: new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate),
                    type: 'ticketmaster'
                })),
                ...organiserEvents.map(event => ({
                    id: event.id,
                    date: new Date(event.start),
                    type: 'organiser'
                }))
            ].sort((a, b) => a.date - b.date);

            console.log("Raw organiserEvents data:", JSON.parse(JSON.stringify(organiserEvents)));
            console.log("Raw eventDateMap data:", JSON.parse(JSON.stringify(this.eventDateMap)));

            this.pop_events = this.events.slice(0, 8);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    },


    async mounted() {
        try {
            // Set up the authentication listener first
            // Fetch events only after the user state has been set
            if (this.userID) {
                this.events = await eventService.displayEvents();
                console.log("events: ", this.events);
                this.wishlists = await itineraryService.getUserWishlist(this.userID); // Fetch wishlists if userID exists
            } else {
                // If userID is not available yet, you might want to fetch events without wishlists
                this.events = await eventService.displayEvents();
                console.log("Events, without userID: ", this.events);
            }
        } catch (error) {
            console.error('Failed to fetch events or wishlists:', error);
        }

        window.addEventListener('scroll', this.handleScroll);
    },
    computed: {
        sortedEvents() {

            const eventsToUse = this.searchQuery ?
                {
                    ticketmaster: this.filteredTicketmasterEvents,
                    organiser: this.filteredOrganiserEvents
                } :
                {
                    ticketmaster: this.events,
                    organiser: this.organiserEvents
                };

            return this.eventDateMap
                .map(item => {
                    if (item.type === 'ticketmaster') {
                        return eventsToUse.ticketmaster.find(e => e.id === item.id);
                    } else {
                        const orgEvent = eventsToUse.organiser.find(e => e.id === item.id);
                        return orgEvent ? {
                            ...orgEvent,
                            name: orgEvent.title,
                            type: 'Organiser Event',
                            colour: orgEvent.colour || '#1a1a40'
                        } : null;
                    }
                })
                .filter(Boolean);
        },

        filteredEvents() {
            if (this.userID && this.wishlists.length) {
                return this.sortedEvents.filter(event =>
                    this.wishlists.some(wishlist => wishlist.eventID === event.id)
                );
            }
            return this.sortedEvents;
        }
    },


    methods: {
        handleScroll() {
            if (window.scrollY > 80) {
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

                    const db = getDatabase();
                    const userRef = dbRef(db, `users/${user.uid}`);
                    try {
                        const snapshot = await get(userRef);
                        if (snapshot.exists()) {
                            this.isCustomer = snapshot.val().userType === 'customer';
                        }
                    } catch (error) {
                        console.error("Error checking user type:", error);
                    }

                    this.userID = user.uid;
                    try {
                        await this.reloadWishlists();

                        // Fetch itineraries using the UID
                        this.itineraries = await itineraryService.getItineraryByUserID(this.userID);
                        console.log(this.itineraries);

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
                    const addedWishlist = await itineraryService.addWishlist(newWishlist);
                    this.wishlists = [...this.wishlists, addedWishlist];
                } else {
                    // If already bookmarked, delete from wishlist
                    // Delete from wishlist and update wishlists array
                    await itineraryService.deleteWishlist(wishlistID);
                    this.wishlists = this.wishlists.filter(
                        (wishlist) => wishlist.id !== wishlistID
                    );
                }
            } catch (error) {
                console.error('Failed to update wishlist:', error);
            }
        },

        async reloadWishlists() {
            if (!this.userID) return; // Ensure userID is set
            try {
                const wishlists = await itineraryService.getUserWishlist(this.userID);
                this.wishlists = [...wishlists]; // Spread operator to ensure reactivity
                console.log('Wishlists reloaded:', this.wishlists);
            } catch (error) {
                console.error('Failed to reload wishlists:', error);
            }
        },

        // Search
        async searchEvents(query) {
            console.log('Searching with query:', query);

            if (query && query.length > 0) {
                try {
                    // Search Ticketmaster events
                    this.filteredTicketmasterEvents = await eventService.searchEventName(query);

                    // Search organizer events locally
                    this.filteredOrganiserEvents = this.organiserEvents.filter(event =>
                        event.title.toLowerCase().includes(query.toLowerCase()) ||
                        (event.description && event.description.toLowerCase().includes(query.toLowerCase()))
                    );

                    // Update eventDateMap for the filtered results
                    this.eventDateMap = [
                        ...this.filteredTicketmasterEvents.map(event => ({
                            id: event.id,
                            date: new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate),
                            type: 'ticketmaster'
                        })),
                        ...this.filteredOrganiserEvents.map(event => ({
                            id: event.id,
                            date: new Date(event.start),
                            type: 'organiser'
                        }))
                    ].sort((a, b) => a.date - b.date);

                } catch (error) {
                    console.error('Error searching events:', error);
                    this.filteredTicketmasterEvents = [];
                    this.filteredOrganiserEvents = [];
                }
            } else {
                // Reset to original state when search query is empty
                this.filteredTicketmasterEvents = [];
                this.filteredOrganiserEvents = [];

                // Restore original eventDateMap
                this.eventDateMap = [
                    ...this.events.map(event => ({
                        id: event.id,
                        date: new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate),
                        type: 'ticketmaster'
                    })),
                    ...this.organiserEvents.map(event => ({
                        id: event.id,
                        date: new Date(event.start),
                        type: 'organiser'
                    }))
                ].sort((a, b) => a.date - b.date);
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
    padding-top: 135px;
}

.hero-section {
    position: relative;
    width: 80%;
    height: 600px;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    z-index: 1;
    margin: auto;
}

#background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    filter: brightness(30%);
}

.hero-content {
    position: relative;
    z-index: 1;
    color: white;
    text-align: center;
}

.hero-content .display-1 {
    animation: scale-up 1.5s ease forwards;
    transform-origin: center;
    opacity: 0;
}

@keyframes scale-up {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.navy-box {
    position: absolute;
    bottom: -30px;
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
    transform: translateY(50%);
}

.navy-box.visible {
    opacity: 1;
    transform: translateY(0);
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

.search-container input[type='text'] {
    padding: 10px 15px;
    padding-left: 40px;
    width: 100%;
    border: 2px solid #87cefa;
    border-radius: 25px;
    font-size: 1em;
    color: #333;
    background-color: #f5f5f5;
    outline: none;
    transition: background-color 0.3s ease;
}

.search-container input[type='text']:hover {
    background-color: #e0e0e0;
}

.popular-event-slide-fade-enter-active,
.popular-event-slide-fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
    /* Adjust timing as needed */
}

.popular-event-slide-fade-enter,
.popular-event-slide-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
    /* Slide in from below */
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
    display: inline-block;
}

.custom-dropdown {
    padding: 10px 40px 10px 20px;
    font-size: 1em;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 12px;
    background-color: #f9f9f9;
    appearance: none;
    outline: none;
    cursor: pointer;
    font-weight: bold;
    width: 150px;
}

.dropdown-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-40%);
    font-size: 0.8em;
    color: #888;
    pointer-events: none;
}

.custom-dropdown:hover {
    border-color: #bbb;
}

.event {
    position: relative;
    border: none;
    border-radius: 15px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    margin: 0 auto;
    height: 350px;
}

.event:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.custom-event-image {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* Use a gradient background instead of solid color
    background: linear-gradient(45deg, rgba(26, 26, 64, 0.9), rgba(26, 26, 64, 0.7)); */
}

.event-logo {
    width: 80px;
    height: 80px;
    object-fit: contain;
    opacity: 0.9;
}

.card-body {
    padding: 1.5rem;
    background: white;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.75rem;
}

.card-text {
    color: #718096;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

/* Add some spacing between cards */
.col-lg-4,
.col-md-6,
.col-12 {
    padding: 1rem;
}

/* Optional: Add a subtle transition when cards appear */
.row>div {
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ticketmaster-image {
    width: 100%;
    height: 160px;
    /* Same height as custom-event-image */
    object-fit: cover;
}

.event:hover {
    transform: scale(1.03);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

.event:hover .icon-container {
    opacity: 1;
}

.event-image {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    object-fit: cover;
}

.icon-container {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    top: 10px;
    right: 15px;
    font-size: 25px;
    color: #34495e;
    opacity: 0;
    padding: 10px 10px;
    transition: opacity 0.3s ease;
    display: flex
}

.fixed-icon-container {
    position: absolute;
    border-radius: 50%;
    background-color: white;
    top: 10px;
    right: 15px;
    font-size: 25px;
    color: #34495e;
    padding: 10px 10px;
    transition: opacity 0.3s ease;
    display: flex
}

.bookmark-icon {
    opacity: 1;
    transition: color 0.3 ease;
}

.bookmark-icon:hover {
    color: #e74c3c;
}
</style>
