<template>
    <div class="container d-flex flex-column align-items-center">
        <div class="row justify-content-center">
            <div class="col-md-12 text-center">
                <div class="d-flex align-items-start">
                    <img v-if="eventDetails.images?.length" :src="eventDetails.images[0].url" class="img-fluid me-3"
                        alt="Event Image" style="margin: 30px; width: 500px; height: 300px" />

                    <!-- Ticket Box -->
                    <div class="col-auto ticket-box text-center container-fluid">
                        <p class="ticket-title">Learn More</p>
                        <button class="btn btn-danger get-tickets-btn" @click="openTickets">TicketMaster</button>
                        
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-primary get-tickets-btn" data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop">Seatmap</button>
                    </div>
                </div>

                <h1 v-if="eventDetails.name">{{ eventDetails.name }}</h1>
                <p v-if="eventDetails.type">Type: {{ eventDetails.type }}</p>
                <p v-if="eventDetails.dates?.start?.localDate">Date: {{ eventDetails.dates.start.localDate }}</p>
                <p v-if="eventDetails.dates?.start?.localTime">Time: {{ eventDetails.dates.start.localTime }}</p>
                <p v-if="eventDetails.dates?.timezone">Timezone: {{ eventDetails.dates.timezone }}</p>
                <p v-if="eventDetails.dates?.status?.code">Status: {{ eventDetails.dates.status.code }}</p>
                <hr />
                <h3>Sales:</h3>
                <p v-if="eventDetails.sales?.public?.startDateTime">Start date:
                    {{ eventDetails.sales.public.startDateTime }}</p>
                <p v-if="eventDetails.sales?.public?.endDateTime">End date: {{ eventDetails.sales.public.endDateTime }}
                </p>
                <p v-if="eventDetails.priceRanges">
                    Price range:
                    {{ `${eventDetails.priceRanges[0].min || 'N/A'} to ${eventDetails.priceRanges[0].max || 'N/A'}
                    ${eventDetails.priceRanges[0].currency || ''}` }}
                </p>

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
                        <img v-if="eventDetails.seatmap?.staticUrl" :src="eventDetails.seatmap.staticUrl"
                            class="img-fluid" alt="Seatmap" />
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
        openTickets() {
            window.open(this.eventDetails.url, '_blank');
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

.ticket-box {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 30px;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Ensure it appears above other content */
}

/* Media query for viewports larger than md */
@media (min-width: 1100px) {
    .ticket-box {
        /* Optional adjustments for larger viewports */
        margin-right: 100px; /* Space between image and ticket box */
        position: fixed; /* Adjusted to use relative positioning */
        right: 0;
    }
}

/* Media query for viewports smaller than md */
@media (max-width: 1100px) {
    .ticket-box {
        width: 100%; /* Cover the full width of the viewport */
        height: auto; /* Height can be auto or a specific value */
        position: fixed; /* Fixed positioning for bottom placement */
        bottom: 0; /* Place it at the bottom of the viewport */
        left: 0; /* Align to the left */
        margin: 0; /* Remove margin to cover full width */
        padding: 20px; /* Add padding if needed */
        box-shadow: none; /* Optional: remove shadow for a flatter design */
    }
}

/* Ensure the container has padding to prevent content overlap */
.container {
    padding-bottom: 150px;
    /* Adjust as needed for fixed ticket box */
}

.ticket-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.get-tickets-btn {
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.get-tickets-btn:hover {
    background-color: #f5a358;
    transform: scale(1.10);
}
</style>