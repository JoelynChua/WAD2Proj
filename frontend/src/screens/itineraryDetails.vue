<template>
    <div class="container-fluid" ref="trailContainer">
        <!-- Image trail -->
        <div id="trailimageid"
            style="position: absolute; visibility: visible; left: 0px; top: 0px; width: 1px; height: 1px; pointer-events: none;">
            <img :src="trailImage[0]" border="0" :width="trailImage[1] + 'px'" :height="trailImage[2] + 'px'" />
        </div>


        <div class="row">
            <!-- Main Content Section -->
            <div class="col-md-9">
                <div class="row">
                    <div class="col-lg-12 justify-content-center text-center">
                        <!-- Message -->
                        <div style="margin-top: 10px; position: sticky; top: 0;">
                            <div v-if="updateMessage" class="alert alert-success">{{ updateMessage }}</div>
                            <div v-if="updateError" class="alert alert-danger">{{ updateError }}</div>
                        </div>
                    </div>

                    <!-- Itinerary Update Form -->
                    <div class="row text-center">
                        <form @submit.prevent="handleUpdate">
                            <div class="row">
                                <div class="col-lg-4"></div>
                                <div class="col-lg-8 d-flex justify-content-center" style="margin-top: 30px;">
                                    <div class="w-50">
                                        <input type="text" class="form-control text-center titleInput" id="title"
                                            v-model="itineraryDetails.title" required />
                                    </div>
                                </div>
                            </div>

                            <div class="row col-lg-12 mb-3 d-flex justify-content-center" style="margin: 20px;">
                                <div class="col-6 d-flex align-items-center">
                                    <label for="date" class="form-label mb-0 me-2">Date:</label>
                                    <input type="date" class="form-control" style="width: auto; display: inline-block;"
                                        id="date" v-model="itineraryDetails.date" :min="today" required />
                                </div>
                            </div>

                            <div class="row col-lg-12 mb-3 d-flex justify-content-center">
                                <div class="col-6 d-flex align-items-center">
                                    <label for="budget" class="form-label mb-0 me-2">Planned Budget:</label>
                                    <input type="number" class="form-control"
                                        style="width: auto; display: inline-block;" id="budget"
                                        v-model="itineraryDetails.budget" required />
                                </div>
                            </div>


                            <!-- Table content -->
                            <div class="row">
                                <div class="col-lg-3"></div>
                                <div class="col-lg-8" v-if="itineraryDetails.events && itineraryDetails.events.length">
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
                                                @dragstart="onDragStart($event, event)" :data-event-id="event.eventID"
                                                class="draggable-item">

                                                <td>{{ event.time }}</td>

                                                <template v-if="eventDetails[event.eventID]">
                                                    <td class="event-details-wrapper"
                                                        style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px;">
                                                        <div>
                                                            <strong>{{ eventDetails[event.eventID].name }}</strong><br>
                                                            {{ eventDetails[event.eventID].type }}<br>
                                                            Status: {{ eventDetails[event.eventID].dates.status.code ||
                                                                'N/A' }}

                                                            <!-- Remove Icon at top-right -->
                                                            <font-awesome-icon :icon="['fas', 'minus']"
                                                                @click="onRemoveEvent(event.eventID)"
                                                                class="remove-icon" />
                                                        </div>
                                                    </td>
                                                </template>

                                                <template v-else-if="attractionDetails[event.eventID]">
                                                    <td class="attraction-details-wrapper"
                                                        style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px;">
                                                        <div>
                                                            <strong>{{ attractionDetails[event.eventID].name
                                                                }}</strong><br>
                                                            {{ attractionDetails[event.eventID].type }}<br>
                                                            Genre: {{
                                                                attractionDetails[event.eventID].classifications[0]?.genre.name
                                                                || 'N/A' }}

                                                            <!-- Remove Icon at top-right -->
                                                            <font-awesome-icon :icon="['fas', 'minus']"
                                                                @click="onRemoveEvent(event.eventID)"
                                                                class="remove-icon" />
                                                        </div>


                                                    </td>
                                                </template>

                                                <template v-else>
                                                    <td
                                                        style="border: 1px solid #ccc; border-radius: 10px; padding: 10px; margin: 10px;">
                                                        <span style="color: #aaa; font-style: italic;">Drag and
                                                            drop</span>
                                                    </td>
                                                </template>

                                            </tr>
                                        </tbody>

                                    </table>
                                </div>
                                <div v-else>
                                    <p>No events scheduled.</p>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

            </div>

            <!-- Jumbotron (Wishlist) -->
            <div class="col-md-3">
                <div class="text-dark p-3"
                    style="position: absolute; top: 300px; right: 0; height: auto; width: 25%; background-color: #edefec">
                    <h3 style="text-decoration: underline;">Wishlist</h3>
                    <ul v-if="wishlists.length">
                        <li v-for="wishlist in wishlists" :key="wishlist.id" :draggable="true"
                            @dragstart="onDragStart($event, wishlist)" class="draggable-item"
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons'; // Import the icon you want to use
import { getAuth } from "firebase/auth";

// Add the icon to the library
library.add(faMinus);


export default {
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            itineraryDetails: {
                title: '',
                date: '',
                budget: 0,  // Initialize budget to ensure reactivity
                events: []
            }, // Initialize as an empty object
            eventDetails: {}, // To hold event details keyed by eventID
            attractionDetails: {}, // To hold attraction details keyed by eventID
            updateMessage: null, // Initialize the success message
            updateError: null,   // Initialize the error message
            wishlists: [], // Initialize wishlist as an empty array
            userID: null,
            trailImage: [require('@/assets/pencil.png'), 50, 30], // image path, width, height
            offsetFromMouse: [10, -20], // x, y offsets from cursor position
            displayDuration: 0, // duration in seconds

        };
    },
    mounted() {
        this.initializeTrail();
        this.authListener();
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
        // this.fetchWishlist();
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
        authListener() {
            const auth = getAuth(); // Initialize Firebase auth here
            // Listen to the authentication state
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // User is signed in
                    this.userID = user.uid; // Get the user ID
                    console.log(this.userID, "AUTHLISTERNER")
                    try {
                        // Fetch itineraries using the UID
                        this.itineraries = await itineraryService.getItineraryByUserID(this.userID);
                        console.log(this.itineraries);
                        this.fetchWishlist();
                        await this.reloadWishlists(); // Reload wishlists after fetching itineraries
                    } catch (error) {
                        console.error("Failed to fetch itineraries:", error);
                    }
                } else {
                    // User is signed out
                    console.log('User is signed out');
                    // Optionally redirect to login page or handle sign-out logic here
                    this.$router.push('/login');
                }
            });
        },
        async fetchWishlist() {
            console.log(this.userID, "FETCHWISHLIST")
            // Directly use the uid from currentUser already set in authListener
            if (!this.userID) {
                console.error("User ID is not available. Make sure the user is authenticated.");
                return; // Exit early if userID is not available
            }

            console.log(this.userID, "WISHLISTID");

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
                    } else {
                        try {
                            const attractionDetails = await attractionService.goToAttractionDetails(wishlistItem.attractionID);
                            console.log("Wishlist Attraction Details:", attractionDetails);
                            this.attractionDetails[wishlistItem.attractionID] = attractionDetails; // Store attraction details
                        } catch (error) {
                            // Skip logging the error for attraction details
                            console.error("Failed to fetch attraction details:", error);
                            this.errorState = true; // Example of setting an error state
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch wishlist:", error);
            }
        },



        async fetchItineraryDetails() {
            const id = this.$route.params.id; // Get the id from the route parameters
            console.log(id, "ITINERARYid")
            try {
                this.itineraryDetails = await itineraryService.getItineraryByID(id); // Fetch itinerary details

                // Automatically fetch details for each event after itinerary details are loaded
                console.log(this.itineraryDetails.events, "DETAILS");

                // Initialize a counter for tracking fetch calls
                this.fetchDetailsCounter = 0;

                this.itineraryDetails.events.forEach(event => {
                    // Access eventID -- only runs when eventID is not empty
                    const eventID = event.eventID;
                    if (eventID !== null && eventID !== undefined && eventID.trim() !== "") {
                        console.log(eventID, "COUNTER");
                        this.fetchDetails(eventID); // Fetch details for each eventID
                        this.fetchDetailsCounter++; // Increment the counter
                    }
                });

                // Log the total number of fetch calls after processing all events
                console.log("Total fetchDetails calls made:", this.fetchDetailsCounter);

            } catch (error) {
                console.error("Failed to fetch itinerary details:", error);
            }
        },


        async fetchDetails(eventID) {
            try {
                const eventDetails = await eventService.goToEventDetails(eventID);
                console.log("Event Details:", eventDetails);
                this.eventDetails[eventID] = eventDetails; // Store event details keyed by eventID
            }

            catch {
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

        async updateEventTiming(draggedEventID, newTime) {
            try {
                // Prepare updated itinerary details with eventID null for the old event and new eventID for the new time
                const updatedData = {
                    title: this.itineraryDetails.title,
                    date: this.itineraryDetails.date,
                    budget: this.itineraryDetails.budget,
                    collaborators: this.itineraryDetails.collaborators || [],
                    events: this.sortedEvents.map(event => {
                        if (event.eventID === draggedEventID) {
                            // Clear the eventID from the old event
                            return {
                                ...event,
                                eventID: null, // Old event: set eventID to null
                            };
                        } else if (event.time === newTime) {
                            // Assign the dragged eventID to the new time slot
                            return {
                                ...event,
                                eventID: draggedEventID, // New event: assign dragged eventID
                            };
                        }
                        return event; // For other events, leave them unchanged
                    }),
                };

                // Call update itinerary service to save changes
                const id = this.$route.params.id;
                await itineraryService.updateItinerary(id, updatedData);

                this.updateMessage = "Event timing updated successfully."; // Success message
                setTimeout(() => {
                    this.updateMessage = null;
                }, 2000);

            } catch (error) {
                this.updateError = "Error updating event timing: " + error.message; // Error message
                console.error("Error updating event timing:", error);
            }
        },


        // Method to remove the eventID of a specific event without removing the entire row
        onRemoveEvent(eventID) {
            const eventToUpdate = this.sortedEvents.find(event => event.eventID === eventID);

            if (eventToUpdate) {
                eventToUpdate.eventID = null; // Clear the eventID, keep other details intact
                eventToUpdate.name = null; // Optionally, clear the name or any other related fields
                console.log(`Event ${eventID} removed from the itinerary.`);

                // Optionally, call a service to update the state on the server if needed
                this.handleUpdate(); // Call the update method to save the changes
            } else {
                console.error(`Event with eventID ${eventID} not found.`);
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
                        time: event.time, // Using event object's time
                        eventID: event.eventID,
                    })),
                };

                // Call update itinerary service
                const id = this.$route.params.id;
                await itineraryService.updateItinerary(id, updatedData);

                this.updateMessage = "Itinerary updated successfully."; // Success message
                this.firstLoad = false;

                // Clear the success message after 2 seconds
                setTimeout(() => {
                    this.updateMessage = null;
                }, 2000);
            } catch (error) {
                // Only show the error if the wishlist is not empty
                if (this.wishlists && this.wishlists.length > 0) {
                    this.updateError = "Error updating itinerary: " + error.message; // Error message
                    console.error("Error updating itinerary:", error);
                }
                this.firstLoad = false;
            }
        },


        // Methods for drag and drop of wishlist item into events table
        // Method to handle the drag start event
        onDragStart(event, draggedItemData) {
            console.log("Drag started", draggedItemData);
            // event.dataTransfer.setData('dragSource', 'table');
            event.dataTransfer.setData('text/plain', JSON.stringify(draggedItemData));
        },


        onDrop(event) {
            event.preventDefault(); // Prevent default behavior

            // Get the dragged item data
            const wishlistItem = JSON.parse(event.dataTransfer.getData('text/plain'));
            console.log(wishlistItem, "EVENT DRAGGED");

            // Find the closest row element that is the target for the drop
            const droppedRow = event.target.closest('tr');

            if (droppedRow) {
                const time = droppedRow.querySelector('td:first-child').textContent; // Get the timing from the first cell

                console.log("Dropped row:", droppedRow);
                console.log("Time:", time);
                console.log("Wishlist Item:", wishlistItem);

                const eventID = wishlistItem.eventID || wishlistItem.attractionID;

                // Check the length of the dragged item data to determine the source
                if (eventID) {
                    if (Object.keys(wishlistItem).length === 2) {
                        // If length is 2, treat it as coming from the table
                        console.log("Dragging within the table, updating event timing.");
                        this.updateEventTiming(wishlistItem.eventID, time);
                        // Reload the page after updating the event timing
                        location.reload(true);
                    } else {
                        // Otherwise, treat it as coming from the wishlist
                        console.log("Dragging from the wishlist, adding to event.");
                        this.addToEvent(wishlistItem, { eventID, time });
                    }
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

        // Method to allow dropping
        allowDrop(event) {
            event.preventDefault(); // Prevent default behavior to allow drop
        },



         // Method to handle adding the item to the event
         async addToEvent(wishlistItem, { eventID, time }) {
            // Use either eventID or attractionID
            const id = wishlistItem.eventID || wishlistItem.attractionID;

            // Check if an event already exists in the itinerary with the same time
            const existingEvent = this.sortedEvents.find(event => event.time === time);

            if (existingEvent) {
                // Update the existing event with details from the wishlist
                existingEvent.eventID = id; // Update eventID if necessary
                existingEvent.name = this.eventDetails[id]?.name || this.attractionDetails[id]?.name; // Update name
                // Update other details if needed
            } else {
                // If the event does not exist, create a new one
                this.sortedEvents.push({
                    time: time, // Set time as a string
                    eventID: eventID,
                    name: this.eventDetails[eventID]?.name || this.attractionDetails[id]?.name,
                });
            }

            // Attempt to delete the added item from the wishlist
            try {
                await itineraryService.deleteWishlist(wishlistItem.id); // Remove from server

                // Remove from local state
                this.wishlists = this.wishlists.filter(wishlist => wishlist.id !== wishlistItem.id);
            } catch (error) {
                console.error("Failed to delete wishlist item:", error);
                // Optionally handle the error, such as showing a message to the user
            }

            try {
                await this.handleUpdate(); // Await the completion of the update

                // Confirm that the update is completed before reloading
                console.log("Update completed, reloading page...");

                // Display the success message and wait for a few seconds before reloading
                setTimeout(() => {
                    location.reload(); // Reload after the message is displayed
                }, 2000); // Adjust the time as necessary

                // location.reload(); // Reload only after the update is confirmed
            } catch (error) {
                console.error("Failed to update itinerary:", error);
                // Optionally handle the error (e.g., show an error message)
            }
        },



        // trackMouse(event) {
        //     const ghostElements = this.$refs.trailContainer.querySelectorAll(".ghost");
        //     const offsetX = -80; // Adjust this value for horizontal offset
        //     const offsetY = -100; // Adjust this value for vertical offset

        //     ghostElements.forEach((ghost, index) => {
        //         //const delay = index * 50; // Staggered delay for each ghost
        //         ghost.style.transform = `translate(${event.pageX + offsetX}px, ${event.pageY + offsetY}px)`;
        //         ghost.style.transition = `${0.1 + index / 20}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;

        //     });
        // },
        initializeTrail() {
            document.onmousemove = this.followMouse;

            if (this.displayDuration > 0) {
                setTimeout(this.hideTrail, this.displayDuration * 1000);
            }
        },
        // getTrailObj() {
        //     return document.getElementById("trailimageid").style;
        // },
        getTrailObj() {
            const trailImageElement = document.getElementById("trailimageid");
            if (!trailImageElement) {
                console.error("Element with ID 'trailimageid' not found.");
                return null; // Return null if the element is not found
            }
            return trailImageElement.style; // Return the style object if found
        },


        trueBody() {
            return (!window.opera && document.compatMode && document.compatMode != "BackCompat")
                ? document.documentElement : document.body;
        },
        hideTrail() {
            this.getTrailObj().visibility = "hidden";
            document.onmousemove = null;
        },

        followMouse(e) {
            let xcoord = this.offsetFromMouse[0];
            let ycoord = this.offsetFromMouse[1];

            if (typeof e !== "undefined") {
                xcoord += e.pageX;
                ycoord += e.pageY;
            } else if (typeof window.event !== "undefined") {
                xcoord += this.trueBody().scrollLeft + event.clientX;
                ycoord += this.trueBody().scrollTop + event.clientY;
            }

            const docwidth = document.all ? this.trueBody().scrollLeft + this.trueBody().clientWidth : pageXOffset + window.innerWidth - 15;
            const docheight = document.all ? Math.max(this.trueBody().scrollHeight, this.trueBody().clientHeight) : Math.max(document.body.offsetHeight, window.innerHeight);

            const trailObj = this.getTrailObj(); // Get the trail image style object

            if (trailObj) { // Check if the object is not null
                // Set display based on coordinates
                if (xcoord + this.trailImage[1] + 3 > docwidth || ycoord + this.trailImage[2] > docheight) {
                    trailObj.display = "none"; // Hide the element
                } else {
                    trailObj.display = ""; // Show the element
                }

                // Update position of the trail image
                trailObj.left = xcoord + "px";
                trailObj.top = ycoord + "px";
            } else {
                console.warn("Trail object is null, cannot set properties."); // Log a warning if trailObj is null
            }
        }
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

.event-details-wrapper,
.attraction-details-wrapper {
    position: relative;
    /* Required for absolute positioning of child elements */
    padding: 10px;
    /* Ensure padding is included for content */
}

.remove-icon {
    position: absolute;
    top: 10px;
    /* Adjust as needed */
    right: 10px;
    /* Adjust as needed */
    cursor: pointer;
    color: #f00;
    /* Change color as needed */
    font-size: 1.2em;
    /* Adjust size as needed */
}

.draggable-item {
    cursor: grab;
}



/* CSS for Cursor Trail */
.trail-container {
    position: relative;
    pointer-events: none;
    /* Allows mouse events to pass through */
}


.ghost {
    width: 80px;
    height: 100px;
    background-image: url('../assets/pencil_line.png');
    background-size: cover;
    position: absolute;
    pointer-events: none;
    transition: transform 0.1s ease;
}
</style>
