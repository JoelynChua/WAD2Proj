<template>
    <div class="homepage">

        <div class="hero-section">
            <video ref="backgroundVideo" autoplay muted loop playsinline id="background-video">
                <source src="https://videos.pexels.com/video-files/4916813/4916813-hd_1920_1080_30fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div class="hero-content">                
                <div class="display-1 z-1">Find Attractions Around You</div>
            </div>

            <!-- Navy Blue Box -->
            <div class="navy-box" :class="{ 'visible': showSearchBar }">
                <div class="form-field search-bar">
                    <div class="search-container">
                        <i class="fi fi-rr-search search-icon"></i>
                        <input type="text" placeholder="Search for attractions..." aria-label="Search" v-model="searchQuery"
                            @keyup="searchAttractions(searchQuery)" />
                    </div>
                </div>
            </div>
        </div>

        <transition name="popular-event-slide-fade">
            <PopularEvents v-if="!searchQuery" :events="pop_events" :event_attraction="false" />
        </transition>

         <!-- Events filter -->
         <div v-if="userID" class="filter-container">
            <h1>Attractions</h1>
            <div class="dropdown-container">
                <i class="fi fi-rr-angle-small-down dropdown-icon"></i>
                <select id="event-filter" class="custom-dropdown" v-model="selectedFilter">
                    <option value="all">All Attractions</option>
                    <option value="wishlist">Bookmarked</option>
                </select>
            </div>
        </div>
        <div v-else style="padding-top: 135px;">
            <h1>Attractions</h1>
        </div>

        <!-- Wishlist Filtered Events -->
        <div class="container mt-4" v-if="selectedFilter === 'wishlist' && filteredAttractions.length">
            <div class="row">
                <div class="col-lg-4 col-md-6 col-12 mb-4" v-for="attraction in filteredAttractions" :key="attraction.id">
                    <div class="card event" @click="goToAttractionDetails(attraction.id)"
                        style="cursor: pointer; position: relative;">

                        <!-- Image -->
                        <img :src="attraction.images[0].url" alt="Attraction image" class="ticketmaster-image" />
                        
                        <!-- Bookmark Icon -->
                        <div class="icon-container" v-if="!isBookmarked(attraction.id)">
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(attraction.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(attraction.id)" />
                        </div>
                        <div class="fixed-icon-container" v-else>
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(attraction.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(attraction.id)" />
                        </div>

                        <!-- Event Details -->
                        <div class="card-body text-start">
                            <h5 class="card-title">{{ attraction.name }}</h5>
                            <p class="card-text">Genre: {{ attraction.classifications[0].genre?.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- All Events (Default View) -->
        <div v-else class="container mt-4">
            <div class="row" v-if="sortedEvents.length">
                <div class="col-lg-4 col-md-6 col-12 mb-4" v-for="attraction in sortedEvents" :key="attraction.id">
                    <div class="card event" @click="goToAttractionDetails(attraction.id)" style="cursor: pointer; position: relative">

                        <!-- Image -->
                        <img :src="attraction.images[0].url" alt="Attraction image" class="ticketmaster-image" />
                        
                        <!-- Bookmark Icon -->
                        <div class="icon-container" v-if="!isBookmarked(attraction.id)">
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(attraction.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(attraction.id)" />
                        </div>
                        <div class="fixed-icon-container" v-else>
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(attraction.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon" @click.stop="toggleWishlist(attraction.id)" />
                        </div>

                         <!-- Event Details -->
                         <div class="card-body text-start">
                            <h5 class="card-title">{{ attraction.name }}</h5>
                            <p class="card-text">Genre: {{ attraction.classifications[0].genre?.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-else>No attractions available.</p>
        </div>
    </div>
</template>

<script>
import attractionService from '../services/attractionService';
import itineraryService from '../services/itineraryService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { getAuth } from 'firebase/auth';

import PopularEvents from '../components/PopularEvents.vue';


library.add(faBookmark, farBookmark);

export default {
    name: 'attractionList',
    components: {
        FontAwesomeIcon,
        PopularEvents,

    },
    data() {
        return {
            attractions: [],
            wishlists: [],
            pop_events: [],
            searchFiltered: [],
            userID: null,
            showSearchBar: false,
            selectedFilter: 'all',
            searchQuery: '',

        };
    },
    computed: {
        sortedEvents() {

            const eventsToUse = this.searchQuery ?
                this.searchFiltered:
                this.attractions
            return eventsToUse
        },
        filteredAttractions() {
            if (this.userID && this.wishlists.length) {
                console.log("this happened: ",this.attractions.filter(event =>
                this.wishlists.some(wishlist => wishlist.attractionID === event.id)))
                return this.attractions.filter(event =>
                    this.wishlists.some(wishlist => wishlist.attractionID === event.id)
                );
            }
            return this.attractions;
        }
    },
    async created() {
        this.authListener();
        try {
            this.attractions = await attractionService.displayAttractions();
            console.log(this.attractions);
            this.pop_events = this.attractions.slice(0, 8);
        } catch (error) {
            console.error('Failed to fetch attractions:', error);
        }
    },

    mounted() {
        
        window.addEventListener('scroll', this.handleScroll);
    },

    methods: {
        handleScroll() {
            if (window.scrollY > 80) {
                this.showSearchBar = true;
            } else {
                this.showSearchBar = false;
            }
        },

        goToAttractionDetails(id) {
            this.$router.push({ name: 'AttractionDetails', params: { id } });
        },

        isBookmarked(attractionID) {
            return this.wishlists.some(
                (wishlist) => wishlist.attractionID === attractionID
            );
        },

        authListener() {
            const auth = getAuth();
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.userID = user.uid;
                    try {
                        await this.reloadWishlists();
                    } catch (error) {
                        console.error('Failed to fetch wishlists:', error);
                    }
                } else {
                    this.userID = null;
                    this.wishlists = [];
                }
            });
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

        async toggleWishlist(attractionID) {
            const existingWishlist = this.wishlists.find(
                (wishlist) => wishlist.attractionID === attractionID
            );
            const wishlistID = existingWishlist ? existingWishlist.id : null;

            const newWishlist = {
                userID: this.userID,
                attractionID,
            };

            try {
                if (!wishlistID) {
                    // Add to wishlist and update wishlists array
                    const addedWishlist = await itineraryService.addWishlist(newWishlist);
                    this.wishlists = [...this.wishlists, addedWishlist]; // Spread to update reactivity
                } else {
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

        async searchAttractions (query) {
            console.log('Searching with query:', query);
            if (query && query.length > 0) {
                try {
                    this.searchFiltered = await attractionService.searchAttractionName(query);
                } catch (error) {
                    console.error('Error searching events:', error);
                }
            } 
        }
    },
};
</script>

<style scoped>
/* Container styling */
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

.popular-event-slide-fade-enter-active, .popular-event-slide-fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease; /* Adjust timing as needed */
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
    width: 170px;
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
    height: 410px;
}

.event:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.custom-event-image {
    width: 100%;
    height: 250px;
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
    height: 250px;
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
