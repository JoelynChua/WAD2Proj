<template>
    <div class="container vh-100 d-flex justify-content-center align-items-center">
        <div class="row justify-content-center">
            <div class="col-md-12 text-center">
                <!-- Itinerary Details -->
                <h1 v-if="itineraryDetails.title">{{ itineraryDetails.title }}</h1>
                <p v-else>No details available.</p> <!-- Fallback message if title is not available -->

                <!-- Loop through events and display them -->
                <div v-if="itineraryDetails.events && itineraryDetails.events.length">
                    <h2>Events</h2>
                    <div class="row">
                        <div class="col-md-6" v-for="event in itineraryDetails.events" :key="event.eventID">
                            <div class="event-box">
                                <!-- Find event details based on eventID -->
                                <div v-if="eventDetails[event.eventID]">
                                    <p>
                                        <strong>{{ eventDetails[event.eventID].type }}:</strong> {{ eventDetails[event.eventID].name }}<br />
                                        {{ eventDetails[event.eventID].priceRanges[0]?.min || 'N/A' }} to 
                                        {{ eventDetails[event.eventID].priceRanges[0]?.max || 'N/A' }} 
                                        {{ eventDetails[event.eventID].priceRanges[0]?.currency || '' }}
                                    </p>
                                </div>
                                <div v-else-if="attractionDetails[event.eventID]">
                                    <p>
                                        <strong>{{ attractionDetails[event.eventID].type }}:</strong> {{ attractionDetails[event.eventID].name }}<br />
                                        {{ attractionDetails[event.eventID].classifications[0]?.genre.name || 'N/A' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import itineraryService from "../services/itineraryService"; // Update to your itinerary service
import eventService from "../services/eventService"; // Import event service
import attractionService from "../services/attractionService"; // Import attraction service

export default {
    data() {
        return {
            itineraryDetails: {}, // Initialize as an empty object
            eventDetails: {}, // To hold event details keyed by eventID
            attractionDetails: {}, // To hold attraction details keyed by eventID
        };
    },
    created() {
        // Fetch itinerary details immediately upon creation
        this.fetchItineraryDetails();
    },
    methods: {
        async fetchItineraryDetails() {
            const id = this.$route.params.id; // Get the id from the route parameters
            try {
                this.itineraryDetails = await itineraryService.getItineraryByID(id); // Fetch itinerary details

                // Automatically fetch details for each event after itinerary details are loaded
                console.log(this.itineraryDetails);
                this.itineraryDetails.events.forEach(event => {
                    const eventID = event.eventID; // Access eventID
                    this.fetchDetails(eventID); // Fetch details for each eventID
                });
            } catch (error) {
                console.error("Failed to fetch itinerary details:", error);
            }
        },
        async fetchDetails(eventID) {
            try {
                const eventDetails = await eventService.goToEventDetails(eventID);
                console.log("Event Details:", eventDetails);
                this.eventDetails[eventID] = eventDetails; // Store event details keyed by eventID
            } catch (error) {
                console.error("Failed to fetch event details:", error);

                // If fetching event details fails, try fetching attraction details
                try {
                    const attractionDetails = await attractionService.goToAttractionDetails(eventID);
                    console.log("Attraction Details:", attractionDetails);
                    this.attractionDetails[eventID] = attractionDetails; // Store attraction details keyed by eventID
                } catch (error) {
                    console.error("Failed to fetch attraction details:", error);
                }
            }
        },
    },
};
</script>

<style scoped>
.event-box {
    border: 1px solid #ccc; /* Light grey border */
    border-radius: 5px; /* Rounded corners */
    padding: 15px; /* Spacing inside the box */
    margin: 10px 0; /* Spacing between boxes */
    background-color: #f9f9f9; /* Light background color */
}
</style>
