<template>
    <div class="container-fluid">
        <div class="row">
            <!-- Main Content Section -->
            <div class="col-md-9">
                <div class="row">
                    <div class="col-md-6 justify-content-center text-center">
                        <!-- Message -->
                        <div style="margin-top: 10px; position: sticky; top: 0;">
                            <div v-if="updateMessage" class="alert alert-success">{{ updateMessage }}</div>
                            <div v-if="updateError" class="alert alert-danger">{{ updateError }}</div>
                        </div>
                    </div>

                    <!-- Itinerary Update Form -->
                    <div class="row text-center">
                        <form @submit.prevent="handleUpdate">
                            <div class="row col-lg-12 d-flex justify-content-center" style="margin-top: 30px;">
                                <div class="w-50">
                                    <input type="text" class="form-control text-center titleInput" id="title"
                                        v-model="itineraryDetails.title" required />
                                </div>
                            </div>

                            <div class="row col-lg-12 mb-3 d-flex justify-content-center" style="margin: 20px;">
                                <div class="w-50">
                                    <label for="date" class="form-label">Date</label>
                                    <input type="date" class="form-control text-center" style="border: 0;" id="date"
                                        v-model="itineraryDetails.date" :min="today" required />
                                </div>
                            </div>

                            <div class="budget-container d-flex flex-column align-items-center">
                                <label for="budget" class="form-label">Planned Budget:</label>
                                <div class="budget-box d-flex justify-content-center align-items-center">
                                    <input type="text" class="form-control text-center" id="budget"
                                        v-model="itineraryDetails.budget" required />
                                </div>
                            </div>

                            <!-- Table content -->
                            <div class="row col-lg-8" v-if="itineraryDetails.events && itineraryDetails.events.length">
                                <h3>Events</h3>
                                <table class="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Timing</th>
                                            <th>Event Name</th>
                                        </tr>
                                    </thead>

                                    <tbody @drop="onDrop($event, event)" @dragover="allowDrop">
                                        <tr v-for="event in sortedEvents" :key="event.eventID" :draggable="true"
                                            @dragstart="onDragStart($event, event)" :data-event-id="event.eventID">
                                            <td>{{ event.time }}</td>
                                            <template v-if="eventDetails[event.eventID]">
                                                <td class="event-details-wrapper"
                                                    style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px;">
                                                    <div>
                                                        <strong>{{ eventDetails[event.eventID].name }}</strong><br>
                                                        {{ eventDetails[event.eventID].type }}<br>
                                                        Status: {{ eventDetails[event.eventID].dates.status.code ||
                                                            'N/A' }}
                                                    </div>
                                                </td>
                                            </template>
                                            <template v-else-if="attractionDetails[event.eventID]">
                                                <td class="attraction-details-wrapper"
                                                    style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px;">
                                                    <div>
                                                        <strong>{{ attractionDetails[event.eventID].name }}</strong><br>
                                                        {{ attractionDetails[event.eventID].type }}<br>
                                                        Genre: {{
                                                            attractionDetails[event.eventID].classifications[0]?.genre.name
                                                            || 'N/A' }}
                                                    </div>
                                                </td>
                                            </template>
                                            <template v-else>
                                                <td
                                                    style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px;">
                                                    <!-- Empty cell for unmatched event -->
                                                </td>
                                            </template>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                            <div v-else>
                                <p>No events scheduled.</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Jumbotron (Wishlist) -->
            <div class="col-md-3">
                <div class="bg-warning text-light p-3"
                    style="position: absolute; top: 300px; right: 0; height: fit-content; width: 25%;">
                    <h3>Wishlist</h3>
                    <ul v-if="wishlists.length">
                        <li v-for="wishlist in wishlists" :key="wishlist.id" :draggable="true"
                            @dragstart="onDragStart($event, wishlist)"
                            style="border: 1px solid; margin: 5px; border-radius: 5px; padding: 10px;">
                            <template v-if="eventDetails[wishlist.eventID]">
                                {{ eventDetails[wishlist.eventID].name }}
                            </template>
                            <template v-else-if="attractionDetails[wishlist.attractionID]">
                                {{ attractionDetails[wishlist.attractionID].name }}
                            </template>
                            <template v-else>
                                No details available.
                            </template>
                        </li>
                    </ul>
                    <p v-else>No items in wishlist.</p>
                </div>
            </div>
        </div>
    </div>
</template>




<script>
import itineraryService from "../services/itineraryService"; // Update to your itinerary service
import eventService from "../services/eventService"; // Import event service
import attractionService from "../services/attractionService"; // Import attraction service
import { debounce } from "lodash";

export default {
    data() {
        return {
            itineraryDetails: {}, // Initialize as an empty object
            eventDetails: {}, // To hold event details keyed by eventID
            attractionDetails: {}, // To hold attraction details keyed by eventID
            updateMessage: null, // Initialize the success message
            updateError: null,   // Initialize the error message
            wishlists: [], // Initialize wishlist as an empty array
            userID: null,
        };
    },
    computed: {
        sortedEvents() {
            // Sort events based on their timing
            return this.itineraryDetails.events
                ? this.itineraryDetails.events.slice().sort((a, b) => new Date(a.timing) - new Date(b.timing))
                : [];
        },
        today() {
            const today = new Date(); // Get today's date
            const dd = String(today.getDate()).padStart(2, '0'); // Day
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month
            const yyyy = today.getFullYear(); // Year
            return `${yyyy}-${mm}-${dd}`; // Return in YYYY-MM-DD format
        },
    },
    async created() {
        // Fetch itinerary details and wishlist when component is created
        this.fetchItineraryDetails();
        this.fetchWishlist();
        this.handleUpdate = debounce(this.handleUpdate.bind(this), 500); // Debounce handleUpdate
    },
    watch: {
        itineraryDetails: {
            handler(newValue) {
                this.handleUpdate(); // Automatically call handleUpdate on change
                console.log('Itinerary details updated:', newValue);
            },
            deep: true,
        },
    },
    methods: {
        async fetchWishlist() {
            this.userID = sessionStorage.getItem('uid');
            try {
                this.wishlists = await itineraryService.getUserWishlist(this.userID); // Fetch the wishlist
                console.log("Fetched wishlist:", this.wishlists);

                // Loop through the wishlist to fetch event or attraction details based on the eventID
                for (const wishlistItem of this.wishlists) {
                    if (wishlistItem.eventID) {
                        try {
                            const eventDetails = await eventService.goToEventDetails(wishlistItem.eventID);
                            console.log("Wishlist Event Details:", eventDetails);
                            this.eventDetails[wishlistItem.eventID] = eventDetails; // Store event details
                        } catch (error) {
                            console.error("Failed to fetch event details for wishlist:", error);
                        }
                    }
                    else {
                        try {
                            const attractionDetails = await attractionService.goToAttractionDetails(wishlistItem.attractionID);
                            console.log("Wishlist Attraction Details:", attractionDetails);
                            this.attractionDetails[wishlistItem.attractionID] = attractionDetails; // Store attraction details
                        } catch (error) {
                            console.error("Failed to fetch attraction details for wishlist:", error);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
            }
        },

        async fetchItineraryDetails() {
            const id = this.$route.params.id; // Get the id from the route parameters
            try {
                this.itineraryDetails = await itineraryService.getItineraryByID(id); // Fetch itinerary details

                // Automatically fetch details for each event after itinerary details are loaded
                console.log(this.itineraryDetails.events);
                this.itineraryDetails.events.forEach(event => {
                    const eventID = event.eventID; // Access eventID
                    if (eventID != "") {
                        this.fetchDetails(eventID); // Fetch details for each eventID
                    }
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
            } catch {
                // If fetching event details fails, try fetching attraction details
                try {
                    const attractionDetails = await attractionService.goToAttractionDetails(eventID);
                    console.log("Attraction Details:", attractionDetails);
                    this.attractionDetails[eventID] = attractionDetails; // Store attraction details keyed by eventID
                } catch {
                    // Skip logging the error for attraction details
                    // Optionally, you can set a state or flag to indicate failure
                    this.errorState = true; // Example of setting an error state
                }
            }
        },



        async handleUpdate() {
            this.updateMessage = null; // Reset previous success message
            this.updateError = null;   // Reset previous error message
            try {
                // Prepare updated itinerary details
                const updatedData = {
                    title: this.itineraryDetails.title,
                    date: this.itineraryDetails.date, // Access date directly from itineraryDetails
                    budget: this.itineraryDetails.budget, // Access budget directly from itineraryDetails
                    collaborators: this.itineraryDetails.collaborators || [], // Access collaborators
                    events: this.sortedEvents.map(event => ({
                        time: event.time, //using event object's time
                        eventID: event.eventID,
                        name: this.eventDetails[event.eventID]?.name,
                        type: this.eventDetails[event.eventID]?.type,
                        priceRanges: [
                            {
                                min: this.eventDetails[event.eventID]?.priceRanges[0]?.min,
                                max: this.eventDetails[event.eventID]?.priceRanges[0]?.max,
                            },
                        ],
                    })),
                };

                // Call update itinerary service
                const id = this.$route.params.id;
                await itineraryService.updateItinerary(id, updatedData);

                this.updateMessage = "Itinerary updated successfully."; // Success message
                this.firstLoad = false;
                setTimeout(() => {
                    this.updateMessage = null;
                }, 2000);

            } catch (error) {
                this.updateError = "Error updating itinerary: " + error.message; // Error message
                console.error("Error updating itinerary:", error);
                this.firstLoad = false;
            }
        },

        // Methods for drag and drop of wishlist item into events table
        // Method to handle the drag start event
        onDragStart(event, wishlistItem) {
            event.dataTransfer.setData('text/plain', JSON.stringify(wishlistItem)); // Store the dragged item data
        },

        onDrop(event) {
            event.preventDefault(); // Prevent default behavior (e.g., opening as a link)

            // Get the dragged item data
            const wishlistItem = JSON.parse(event.dataTransfer.getData('text/plain'));

            // Find the closest row element that is the target for the drop
            const droppedRow = event.target.closest('tr'); // Get the closest table row

            // Make sure droppedRow is defined
            if (droppedRow) {
                const time = droppedRow.querySelector('td:first-child').textContent; // Get the timing from the first cell

                console.log("Dropped row:", droppedRow);
                console.log("Time:", time);
                console.log("Wishlist Item:", wishlistItem);

                // Assign eventID based on the available ID in wishlistItem
                const eventID = wishlistItem.eventID || wishlistItem.attractionID;

                if (eventID) {
                    // Call addToEvent with the wishlist item and the time
                    this.addToEvent(wishlistItem, { eventID, time });
                } else {
                    console.error("Wishlist item does not have a valid eventID or attractionID.");
                }
            } else {
                console.error("Dropped event does not have a valid row.");
            }
        },



        //Dragging events within the events table
        // Handle when an event drag starts
        onEventDragStart(event) {
            event.dataTransfer.setData('eventID', event.eventID); // Pass eventID
        },

        // // Handle dropping the dragged event into a new time slot
        // onEventDrop(e, targetEvent) {
        //     e.preventDefault();
        //     const draggedEventID = e.dataTransfer.getData('eventID'); // Get the dragged event's eventID

        //     // Find the dragged event in the sortedEvents array
        //     const draggedEvent = this.sortedEvents.find(event => event.eventID === draggedEventID);

        //     if (draggedEvent && targetEvent) {
        //         // Swap the timings between draggedEvent and targetEvent
        //         const tempTime = draggedEvent.time;
        //         draggedEvent.time = targetEvent.time;
        //         targetEvent.time = tempTime;

        //         // Update the itinerary to reflect the new event timings
        //         this.handleUpdate();
        //     }
        // },
        // updateEventTiming(updatedEvent) {
        //     // Update the time of the dragged event in sortedEvents array
        //     const index = this.sortedEvents.findIndex(event => event.eventID === updatedEvent.eventID);
        //     if (index !== -1) {
        //         this.sortedEvents[index].time = updatedEvent.time;
        //     }
        // },
        //end



        // Method to allow dropping
        allowDrop(event) {
            event.preventDefault(); // Prevent default behavior to allow drop
        },


        // Method to handle adding the item to the event
        async addToEvent(wishlistItem, time) {
            const eventID = wishlistItem.eventID || wishlistItem.attractionID; // Use either eventID or attractionID

            // Check if an event already exists in the itinerary with the same time
            const existingEvent = this.sortedEvents.find(event => event.time === time.time); // Match by time

            if (existingEvent) {
                // Update the existing event with details from the wishlist
                existingEvent.eventID = eventID; // Update eventID if necessary
                existingEvent.name = this.eventDetails[eventID]?.name || this.attractionDetails[eventID]?.name; // Update name
                // Update other details if needed
            } else {
                // If the event does not exist, create a new one
                this.sortedEvents.push({
                    time: time.time, // Set time as a string (not an object)
                    eventID: eventID,
                    name: this.eventDetails[eventID]?.name || this.attractionDetails[eventID]?.name,
                });
            }

            // Attempt to delete the added item from the wishlist
            try {
                await itineraryService.deleteWishlist(wishlistItem.id); // Remove from server

                this.wishlists = this.wishlists.filter(wishlist => wishlist.id !== wishlistItem.id); // Remove from local state
            } catch (error) {
                console.error("Failed to delete wishlist item:", error);
                // Optionally handle the error, such as showing a message to the user
            }

            // Call the handleUpdate to save the changes
            this.handleUpdate();
        },

    },
};
</script>


<style scoped>
.event-box {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px;
    margin: 10px 0;
    background-color: #f9f9f9;
}

.titleInput {
    border: 0;
    font-size: 2.5rem;
}

.budget-container {
    margin: 30px;
}

.budget-box {
    border: 1px solid;
    /* Creates the square border */
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.budget-box input {
    border: none;
    font-size: 15px;
    text-align: center;
    width: 100%;
    /* Ensures the input takes full width */
}
</style>
