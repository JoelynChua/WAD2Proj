<template>
    <div>
        <div v-if="loading" class="loading">
            <img class="loading-image" src="../assets/logo.png"/>
            <p>Loading...</p>
        </div>
        <div v-else>
            <!-- Custom event image handling -->
            <div v-if="isOrganiserEvent" 
                            class="custom-event-image" 
                            :style="{ backgroundColor: eventDetails.colour || '#1a1a40' }">
                            <img src="../assets/logo.png" alt="Event logo" class="event-logo" />
                        </div>
            <div v-else class="row event-hero-wrapper v-else">
                    <div class="col-2"></div>
                    <div class="col-8 ">
                        <!-- Ticketmaster event image -->
                        <img 
                            :src="eventDetails.images?.[0]?.url" 
                            class="event-hero-image"
                            alt="Event Image"/>
                    </div>
                    <div class="col-2"></div>
            </div>
             <!-- Organiser Event specific details -->
             <div v-if="isOrganiserEvent">
                <!-- Common details -->
                <h1>{{ isOrganiserEvent ? eventDetails.title : eventDetails.name }}</h1>
                <p>Type: {{ isOrganiserEvent ? 'Organiser Event' : eventDetails.type }}</p>
                <p>Date: {{ formatDate(eventDetails.start) }}</p>
                <p>Time: {{ formatTime(eventDetails.start) }}</p>
                <p v-if="eventDetails.description">Description: {{ eventDetails.description }}</p>
                <p v-if="eventDetails.location">Location: {{ eventDetails.location }}</p>
                <p v-if="eventDetails.price">Price: ${{ eventDetails.price }}</p>
            </div>
            <div class="event-details" v-else>
                <div class="row mt-5">
                    <div class="col-2"></div>
                    <div class="col-6">
                        <div class="text-start">
                            <div class="event-date">
                                {{ eventDate }}
                            </div>
                            <div class="event-title">
                                {{ eventDetails.name }}
                            </div>
                            <div class="event-container">
                                <div class="event-header">Date and Time</div>
                                <i class="fi fi-rr-calendar-day" style="margin: 0px 8px;"></i>
                                <span> {{ eventDetails.dates.start.localDate }} {{ eventDetails.dates.start.localTime.slice(0,5) }} {{ eventDetails.dates.timezone }}</span>
                            </div>

                            <div class="event-container">
                                <div class="event-header">Location</div>
                                <i class="fi fi-rs-marker" style="margin: 0px 8px;"></i>
                                <span> {{ eventDetails._embedded.venues[0].name }}</span>
                                <div style="margin: 0px 30px; color: grey;">{{ eventDetails._embedded.venues[0].address.line1 }}, {{ eventDetails._embedded.venues[0].postalCode }}</div>

                                <a href="#" @click.prevent="toggleMap" class="toggle-map-link">{{ showMap ? 'Hide map' : 'Show map' }}</a>
                                <div 
                                    id="map" 
                                    :style="{ display: showMap ? 'block' : 'none' }">
                                </div>

                            </div>
                            <div class="event-container">
                                <div class="event-header">Price Range</div>
                                <i class="fi fi-rr-dollar" style="margin: 0px 8px;"></i>
                                <span>
                                    {{ eventDetails.priceRanges[0].min }}{{ eventDetails.priceRanges[0].currency}} 
                                    - 
                                    {{ eventDetails.priceRanges[0].max }}{{ eventDetails.priceRanges[0].currency }}
                                </span>
                            </div>

                            <div class="event-container">
                                <div class="event-header">Ticket Sales</div>
                                <div class="d-inline-block"> {{ formatDateTime(eventDetails.sales.public.startDateTime) }} </div>
                                <div class="d-inline-block">&nbsp;&nbsp; - &nbsp;&nbsp; </div>
                                <div class="d-inline-block"> {{ formatDateTime(eventDetails.sales.public.endDateTime) }} </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <EventNaviBar v-if="isCustomer" :event="eventDetails" :isOrganiserEvent="isOrganiserEvent"></EventNaviBar>
    </div> 
</div>     
</template>


    

<script>
import eventService from "../services/eventService";
import organiserEventService from "../services/organiserEventService";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import EventNaviBar from "../components/EventDetails_navibar.vue"
import { Loader } from "@googlemaps/js-api-loader"
import { getGoogleClientId } from '../services/getGoogleClientId'
import { getAuth } from 'firebase/auth';
import { ref as dbRef, getDatabase, get } from 'firebase/database';

export default {
    data() {
        return {
            eventDetails: {},
            loading: true,
            isOrganiserEvent: false,
            map: null,
            showMap: false,
            isCustomer: false
        };
    },
    components: {
        EventNaviBar,
    },
    computed: {
        eventDate () {
            const date = new Date(this.eventDetails.dates.start.localDate)
            const formattedDate = date.toLocaleDateString(undefined, {
                weekday: 'long',  // e.g., "Sunday"
                month: 'long',    // e.g., "December"
                day: 'numeric'    // e.g., "8"
            });
            return formattedDate
        },
        
        
    },
    async created() {
        await this.checkUserType();
        this.fetchEventDetails();
    },
    async mounted() {
        // Load Google Maps script and initialize map after the component is mounted
        await this.loadGoogleMapsScript(); // Ensures Google Maps script is loaded
        if (this.eventDetails._embedded && this.eventDetails._embedded.venues) {
            this.initializeMap(); // Initializes map with venue location data
        }
    },

    methods: {
        async checkUserType() {
            const auth = getAuth();
            const user = auth.currentUser;
            
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
            }
        },
        async loadGoogleMapsScript() {
            // Fetch API Key dynamically if required
            const data = await getGoogleClientId(); // Assuming this function returns an object with apiKey
            const apiKey = data.clientSecret;
            console.log(apiKey)

            // Create a Loader instance with the API key
            const loader = new Loader({
                apiKey: apiKey,
                version: "weekly",
            });

            await loader.load();
        },
        async initializeMap() {
            const { latitude, longitude } = this.eventDetails._embedded.venues[0].location;
            console.log(latitude, longitude)

            /* global google */
            const { Map } = await google.maps.importLibrary("maps");
            console.log(document.getElementById("map"))
            this.map = new Map(document.getElementById("map"), {
                center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
                zoom: 15,
            });

            new google.maps.Marker({
                position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
                map: this.map,
            });
        },
        toggleMap() {
            this.showMap = !this.showMap;

            if (this.showMap) {
                // Delay to ensure display change is applied before resizing
                this.$nextTick(() => {
                    if (this.map) {
                        google.maps.event.trigger(this.map, 'resize'); // Trigger a resize event for the map
                        const { latitude, longitude } = this.eventDetails._embedded.venues[0].location;
                        this.map.setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
                    } else {
                        this.initializeMap(); // Initialize map if it doesn't exist
                    }
                });
            }
        },
        async fetchEventDetails() {
            const id = this.$route.params.id;
            console.log('Fetching event details for ID:', id);
            try {
                this.loading = true;
                
                // Try to fetch from organiser events first
                try {
                    const organiserEvent = await organiserEventService.getEventById(id);
                    if (organiserEvent) {
                        this.eventDetails = organiserEvent;
                        this.isOrganiserEvent = true;
                        return;
                    }
                } catch (error) {
                    console.log('Not an organiser event, trying Ticketmaster...');
                }
                
                // If not found in organiser events, try Ticketmaster
                const ticketmasterEvent = await eventService.goToEventDetails(id);
                if (ticketmasterEvent) {
                    this.eventDetails = ticketmasterEvent;
                    this.isOrganiserEvent = false;
                } else {
                    throw new Error('Event not found');
                }
                
            } catch (error) {
                console.error("Failed to fetch event details:", error);
                // You might want to show an error message to the user here
            } finally {
                this.loading = false;
            }
        },
            
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        formatTime(dateString) {
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        formatDateTime(dateString) {
            return new Date(dateString).toLocaleTimeString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
</script>



<style scoped>
@keyframes bob {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.loading {
    width: 50px;
    animation: bob 1.5s ease-in-out infinite;
    display: flex;
    align-items: center;
    margin: 50px auto;
}

.loading p {
    margin: 0 auto;
}

.loading-image {
    width: 100%
}

.custom-event-image {
    max-width: 800px;
    height: auto;
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 450px;
    height: auto; 
    border-radius: 20px;
    overflow: hidden;

}
.event-hero-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    /* max-width: 800px; */
    max-height: 450px;
    /* height: auto; */
    border-radius: 20px;
    overflow: hidden;
    /* margin: 20px auto; */
    /* display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 450px;
    height: auto; 
    border-radius: 20px;
    overflow: hidden; */
}
.event-hero-image {
  width: 100%;
  max-height: 450px;

  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  object-position: center;
}
.event-container {
    margin: 80px 0px;
}
.event-header {
    color: #39364f;
    font-size: 30px;
    font-weight: bold;
}
.event-date {
    font-size: 25px;
}
.event-title {
    margin: 20px 0px;
    color: #39364f;
    text-transform: uppercase;
    font-size: 60px;
    font-weight: 900;
    line-height: 1; 
}
.toggle-map-link {
  color: #1a73e8; /* Set to your preferred blue color */
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  position: relative;
  margin: 0px 30px
}

.toggle-map-link::after {
  content: '▼'; /* Downward arrow */
  font-size: 0.8em;
  margin-left: 5px;
  transform: rotate(0deg);
  transition: transform 0.3s;
}

.toggle-map-link:hover::after {
  transform: rotate(180deg); /* Rotate for 'Hide map' */
}

.toggle-map-link:hover {
  color: #125bb5; /* Darker blue on hover */
}
#map {
    width: 100%;
    height: 400px;
    border-radius: 10px;
    border: 1px solid black;
    margin: 0px 30px;

}

</style>