<template>
    <div>
        <div v-if="loading" class="loading">
            <img class="loading-image" src="../assets/logo.png"/>
            <p>Loading...</p>
        </div>
        <div v-else>
            <div class="d-flex justify-content-center">
                <div class="col-8 container-fluid">
                        <div ref="topFocusElement" tabindex="-1"></div>
                        <div class="event-hero-wrapper">
                            <img :src="eventDetails.images[0].url" class="event-hero-image"
                                alt="Event Image" aria/>
                        </div>
                </div>
            </div>
            <div class="event-details">
                <h1>{{ eventDetails.name }}</h1>
                    <p>Type: {{ eventDetails.type }}</p>
                    <p>Date: {{ eventDetails.dates.start.localDate }}</p>
                    <p>Time: {{ eventDetails.dates.start.localTime }}</p>
                    <p>Timezone: {{ eventDetails.dates.timezone }}</p>
                    <p>Status: {{ eventDetails.dates.status.code }}</p>
                    <hr />
                    <h3>Sales:</h3>
                    <p>Start date:
                        {{ eventDetails.sales.public.startDateTime }}</p>
                    <p>End date: {{ eventDetails.sales.public.endDateTime }}
                    </p>
                    <p>
                        Price range:
                        {{ `${eventDetails.priceRanges[0].min || 'N/A'} to ${eventDetails.priceRanges[0].max || 'N/A'}
                        ${eventDetails.priceRanges[0].currency || ''}` }}
                    </p>
            </div>
        </div>
        <EventNaviBar :event="eventDetails"></EventNaviBar>
    </div>      
</template>


<script>
import eventService from "../services/eventService"; // Adjust the import to your event service
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap'; // Import Bootstrap JS
import EventNaviBar from "../components/EventDetails_navibar.vue"

export default {
    data() {
        return {
            eventDetails: {}, // Initialize as an empty object
            loading: true,
        };
    },
    components: {
        EventNaviBar,
    },
    // Created hook -- lifecycle method
    async created() {
        // ensure that the data loading happens immediately and does not require the user to click a button or perform another action first.
        this.fetchEventDetails();
    },
    methods: {
        async fetchEventDetails() {
            const id = this.$route.params.id; // Get the id from the route parameters
            console.log(id)
            try {
                this.loading = true;
                this.eventDetails = await eventService.goToEventDetails(id); // Fetch event details
            } catch (error) {
                console.error("Failed to fetch event details:", error);
            } finally {
                this.loading = false; // Set loading to false after data is fetched
            }
        },
    },
};
</script>

<style>
@keyframes bob {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px); /* Adjust the height as needed */
    }
}
.loading {
    width: 50px; /* Adjust the size as needed */
    animation: bob 1.5s ease-in-out infinite;
    display: block;
    margin: 50px auto; 
    display: flex;
    align-items: center
}
.loading p {
    margin: 0 auto;
}
.loading-image {
    width: 100%
}

.event-hero-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px; 
  max-height: 400px;
  height: auto; 
  border-radius: 20px;
  overflow: hidden;
  margin: 20px auto;
}

.event-hero-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}
</style>