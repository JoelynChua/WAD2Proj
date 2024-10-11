<template>
    <div class="container vh-100 d-flex justify-content-center align-items-center">
        <div class="row justify-content-center">
            <div class="col-md-12 text-center">
                <!-- Due to the error of: Cannot read properties of undefined (reading 'start')
                TypeError: Cannot read properties of undefined (reading 'start') 
                need to do the v-if to prevent error if the scenario that the attribute is not found-->
                <!-- Event Details -->
                <h1 v-if="eventDetails.name">{{ eventDetails.name }}</h1>
                <p v-if="eventDetails.type">Type: {{ eventDetails.type }}</p>
                <p v-if="eventDetails.dates?.start?.localDate">Date: {{ eventDetails.dates.start.localDate }}</p>
                <p v-if="eventDetails.dates?.start?.localTime">Time: {{ eventDetails.dates.start.localTime }}</p>
                <p v-if="eventDetails.dates?.timezone">Timezone: {{ eventDetails.dates.timezone }}</p>
                <p v-if="eventDetails.dates?.status?.code">Status: {{ eventDetails.dates.status.code }}</p>
                <hr />
                <h3>Sales:</h3>
                <p v-if="eventDetails.sales?.public?.startDateTime">Start date: {{
                    eventDetails.sales.public.startDateTime }}</p>
                <p v-if="eventDetails.sales?.public?.endDateTime">End date: {{ eventDetails.sales.public.endDateTime }}
                </p>
                <p v-if="eventDetails.priceRanges">
                    Price range:
                    {{
                        `${eventDetails.priceRanges[0].min || 'N/A'} to ${eventDetails.priceRanges[0].max || 'N/A'}
                    ${eventDetails.priceRanges[0].currency || ''}`
                    }}
                </p>

                <!-- Button trigger modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    Seatmap
                </button>
            </div>
        </div>

        <!-- Modal for Seatmap -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Seatmap</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- For vue
                        Use {{ }} inside elements to display text values directly.
                        Use : or v-bind to bind dynamic values to attributes (like src, href, class, etc.)-->
                        <img v-if="eventDetails.seatmap?.staticUrl" :src="eventDetails.seatmap.staticUrl"
                            class="img-fluid" alt="Seatmap" />
                        <!-- optional chaining operator (?.) is a feature in JavaScript that allows you to safely access 
                             deeply nested properties without having to explicitly check each level of the object. -->
                        <!-- ?: save time in the case of not having a seatmapURL -> immediate go to the else part -->
                        <p v-else>No seatmap available.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from "bootstrap";
import eventService from "../services/eventService"; // Adjust the import to your event service
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap'; // Import Bootstrap JS

export default {
    data() {
        return {
            eventDetails: {}, // Initialize as an empty object
            //eventDetails is an empty object where the details of the event will be stored after they are fetched.
        };
    },
    // Created hook -- lifecycle method
    created() {
        // ensure that the data loading happens immediately and does not require the user to click a button or perform another action first.
        this.fetchEventDetails();
    },
    methods: {
        async fetchEventDetails() {
            const id = this.$route.params.id; // Get the id from the route parameters
            console.log(id)
            try {
                this.eventDetails = await eventService.goToEventDetails(id); // Fetch event details
            } catch (error) {
                console.error("Failed to fetch event details:", error);
            }
        },
        showSeatmap() {
            const myModal = new Modal(document.getElementById("staticBackdrop"));
            myModal.show();
        },
    },
};
</script>

<style>
.aligned {
    text-align: center;
}
</style>