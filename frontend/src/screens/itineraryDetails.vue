<template>
    <div class="container-fluid" ref="containerFluid">
        <!-- PixiJS canvas -->
        <canvas ref="pixiCanvas"></canvas>

        <google-calendar-a-p-i :itinerary="itineraryDetails.title" :date="itineraryDetails.date" />

        <div class="row" style="position: relative; z-index: 2;">
            <!-- Main Content Section -->
            <div class="col-md-9">
                <div class="row">
                    <div class="col-lg-12 justify-content-center text-center">
                        <!-- Message -->
                        <div style="margin-top: 10px; position: sticky; top: 0;">
                            <div v-if="updateMessage" class="popNotif success">{{ updateMessage }}</div>
                            <div v-if="updateError" class="popNotif error">{{ updateError }}</div>
                        </div>
                    </div>

                    <!-- Itinerary Update Form -->
                    <div class="row text-center">
                        <form @submit.prevent="handleUpdate">
                            <div class="row">
                                <div class="col-lg-4"></div>
                                <div class="col-lg-6 d-flex justify-content-center" style="margin-top: 30px;">
                                    <div class="w-50 ">
                                        <input type="text" class="form-control text-center titleInput" id="title"
                                            v-model="itineraryDetails.title"
                                            style="width: auto; padding: 0.375rem 1rem;" required />
                                    </div>
                                </div>
                            </div>

                            <div class="row col-lg-12 mb-3 d-flex justify-content-center" style="margin: 20px;">
                                <div class="col-6 d-flex justify-content-center">
                                    <label for="date" class="form-label mb-0 me-2">Date:</label>
                                    <input type="date" class="form-control" style="width: auto; display: inline-block;"
                                        id="date" v-model="itineraryDetails.date" :min="today" required />
                                </div>
                            </div>

                            <div class="row col-lg-12 mb-3 d-flex justify-content-center">
                                <div class="col-6 d-flex justify-content-center">
                                    <label for="budget" class="form-label mb-0 me-2">Planned Budget:</label>
                                    <input type="number" class="form-control"
                                        style="width: auto; display: inline-block;" id="budget"
                                        v-model="itineraryDetails.budget" required />
                                </div>
                            </div>

                            <!-- Table content -->
                            <div class="row">
                                <div class="col-lg-4"></div>
                                <div class="col-lg-8" v-if="itineraryDetails.events && itineraryDetails.events.length">
                                    <h3>Events</h3>
                                    <table class="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Timing</th>
                                                <th>Event Name</th>
                                            </tr>
                                        </thead>


                                        <tbody @drop="onDrop($event)" @dragover="allowDrop">
                                            <tr v-for="event in sortedEvents" :key="event.eventID" :draggable="true"
                                                @dragstart="onDragStart($event, event)" :data-event-id="event.eventID"
                                                class="draggable-item">

                                                <!-- Timing Column (Fixed, Non-resizable) -->
                                                <td>
                                                    {{ event.time }}
                                                </td>

                                                <!-- Event Details Section (Resizable Column) -->
                                                <template
                                                    v-if="eventDetails[event.eventID] || organiserEventDetails[event.eventID]">
                                                    <td colspan=1 :rowspan="getEventRowspan(event)"
                                                        :style="getColumnStyle(event)" class="event-details-wrapper">
                                                        <div>
                                                            <strong>{{ eventDetails[event.eventID]?.name ||
                                                                organiserEventDetails[event.eventID]?.title
                                                                }}</strong><br>
                                                            {{ eventDetails[event.eventID]?.type ||
                                                                organiserEventDetails[event.eventID]?.type }}<br>
                                                            <div v-if="eventDetails[event.eventID]">
                                                                Status: {{
                                                                    eventDetails[event.eventID].dates?.status?.code }}
                                                            </div>
                                                            <div v-else-if="organiserEventDetails[event.eventID]">
                                                                Genre: {{ organiserEventDetails[event.eventID]?.genre ||
                                                                    'N/A' }}
                                                            </div>

                                                            <!-- Remove Icon -->
                                                            <font-awesome-icon :icon="['fas', 'minus']"
                                                                @click="onRemoveEvent(event.eventID)"
                                                                class="remove-icon" />

                                                            <!-- Resize Handle -->
                                                            <div class="resize-handle"
                                                                @mousedown="startResize($event, event)"></div>
                                                        </div>
                                                    </td>
                                                </template>

                                                <!-- Attraction Details Section (Resizable Column) -->
                                                <template v-else-if="attractionDetails[event.eventID]">
                                                    <td colspan=1 :rowspan="getEventRowspan(event)"
                                                        :style="getColumnStyle(event)"
                                                        class="attraction-details-wrapper">
                                                        <div>
                                                            <strong>{{ attractionDetails[event.eventID].name
                                                                }}</strong><br>
                                                            {{ attractionDetails[event.eventID].type || 'N/A' }}<br>
                                                            Genre: {{
                                                                attractionDetails[event.eventID].classifications?.[0]?.genre?.name
                                                                || 'N/A' }}

                                                            <!-- Remove Icon -->
                                                            <font-awesome-icon :icon="['fas', 'minus']"
                                                                @click="onRemoveEvent(event.eventID)"
                                                                class="remove-icon" />

                                                            <!-- Resize Handle -->
                                                            <div class="resize-handle"
                                                                @mousedown="startResize($event, event)"></div>
                                                        </div>
                                                    </td>
                                                </template>

                                                <!-- Default Placeholder Section -->
                                                <template v-else>
                                                    <td class="placeholder-td">
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
            <div class="sidebar-container">
                <font-awesome-icon :icon="['fas', 'bars']" @click="toggleExpand" class="expand-icon"
                    :class="{ 'icon-expanded': isExpanded }" />
                <div ref="wishlistSidebar" class="wishlist-sidebar" :class="{ expanded: isExpanded }">
                    <h3 style="text-decoration: underline;">Wishlist</h3>

                    <ul v-if="wishlists.length">
                        <li v-for="wishlist in wishlists" :key="wishlist.id" :draggable="true"
                            @dragstart="onDragStart($event, wishlist)" class="draggable-item"
                            style="border: 1px solid; margin: 5px; border-radius: 5px; padding: 10px;">
                            <!-- Wishlist Content Here -->
                            <template v-if="eventDetails[wishlist.eventID]">
                                <span>{{ eventDetails[wishlist.eventID].name || eventDetails[wishlist.eventID].title
                                    }}</span>
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
import organiserEventService from "../services/organiserEventService";
import eventService from "../services/eventService"; // Import event service
import attractionService from "../services/attractionService"; // Import attraction service
import { debounce } from "lodash";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMinus, faBars } from '@fortawesome/free-solid-svg-icons'; // Import the icon you want to use
import { getAuth } from "firebase/auth";
// import { Graphics } from 'pixi.js';
import * as PIXI from 'pixi.js'

import GoogleCalendarAPI from "../components/GoogleCalendar.vue"

// Add the icon to the library
library.add(faMinus, faBars);


export default {
    components: {
        FontAwesomeIcon,
        GoogleCalendarAPI
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
            organiserEventDetails: {},

            updateMessage: null, // Initialize the success message
            updateError: null,   // Initialize the error message
            wishlists: [], // Initialize wishlist as an empty array
            userID: null,

            // For the wishlist side bar to be expandable
            isExpanded: false,

            // Used for allowing scrolling when dragging
            isDragging: false,
            autoScrollSpeed: 5,
            autoScrollInterval: null,
            currentClientY: 0,


            app: null,
            circle: null,
            // trailImage: [require('@/assets/pencil.png'), 50, 30], // image path, width, height
            // offsetFromMouse: [10, -20], // x, y offsets from cursor position
            // displayDuration: 0, // duration in seconds

            resizingEvent: null,
            initialMouseX: 0,
            initialRowspan: 1,
            rowspans: {} // Stores the calculated rowspans for each eventID

        };
    },
    mounted() {
        this.initializeTrail();
        this.authListener();


        const sidebar = this.$refs.wishlistSidebar;
        const eventsTable = this.$refs.eventsTable; // Add ref to events table in template

        // Log references to ensure they're defined
        console.log('Sidebar ref:', sidebar);
        console.log('Events table ref:', eventsTable);

        // Listen to dragover events on sidebar and events table separately
        if (sidebar) {
            sidebar.addEventListener('dragover', this.handleDragOverSidebar);
            sidebar.addEventListener('dragend', this.onDragEnd);
        } else {
            console.error('wishlistSidebar reference is missing');
        }

        if (eventsTable) {
            eventsTable.addEventListener('dragover', this.handleDragOverTable);
        }
        else {
            console.error('eventsTable reference is missing');
        }
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


        eventRowspans() {
            const rowspans = {};
            this.sortedEvents.forEach(event => {
                if (!rowspans[event.eventID]) {
                    rowspans[event.eventID] = this.getEventRowspan(event);
                }
            });
            return rowspans;
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
            handler() {
                // Handle the update logic here
                this.handleUpdate(); // Automatically call handleUpdate on change

                // Log new and old values to track changes
                // console.log('Itinerary details updated:', newValue);
                // console.log('Previous itinerary details:', oldValue);
            },
            deep: true, // Watch nested properties within itineraryDetails
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
                    console.log(this.userID, "AUTHLISTENER");

                    try {
                        // Fetch the wishlist after the user ID is available
                        await this.fetchWishlist();

                        // Fetch itineraries using the UID
                        this.itineraries = await itineraryService.getItineraryByUserID(this.userID);
                        console.log("ITINERARIES", this.itineraries);



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
            console.log(this.userID, "FETCHWISHLIST");

            // Ensure userID is available before proceeding
            if (!this.userID) {
                console.error("User ID is not available. Make sure the user is authenticated.");
                return; // Exit early if userID is not available
            }

            console.log(this.userID, "WISHLISTID");

            try {
                console.log("Entered fetchWishlist method");

                // Fetch the wishlist
                const wishlist = await itineraryService.getUserWishlist(this.userID);
                this.wishlists = wishlist;
                console.log("Fetched wishlist:", this.wishlists);

                // Loop through the wishlist to fetch event or attraction details
                for (const wishlistItem of this.wishlists) {
                    console.log("Processing wishlist item:", wishlistItem);
                    // Check if the item has eventID
                    if (wishlistItem.eventID) {
                        try {
                            let eventDetails = null;

                            // Attempt to fetch event details from event service
                            try {
                                eventDetails = await eventService.goToEventDetails(wishlistItem.eventID);
                                console.log("Wishlist Event Details:", eventDetails);
                                this.eventDetails[wishlistItem.eventID] = eventDetails;
                            } catch (eventError) {
                                console.log("Failed to fetch event details, skipping...:", eventError.message);
                            }

                            // If no event details, fallback to organiser event service
                            if (!eventDetails) {
                                try {
                                    const organiserEvent = await organiserEventService.getEventById(wishlistItem.eventID);
                                    console.log("Organiser Event Details:", organiserEvent);
                                    this.eventDetails[wishlistItem.eventID] = organiserEvent;
                                    this.isOrganiserEvent = true; // Mark as organiser event
                                } catch (organiserError) {
                                    console.log("Failed to fetch organiser event details:", organiserError.message);
                                }
                            }
                        } catch (error) {
                            console.error("Failed to fetch event or organiser event details:", error);
                        }
                    }
                    // Check if the item has attractionID
                    else if (wishlistItem.attractionID) {
                        try {
                            const attractionDetails = await attractionService.goToAttractionDetails(wishlistItem.attractionID);
                            console.log("Wishlist Attraction Details:", attractionDetails);
                            this.attractionDetails[wishlistItem.attractionID] = attractionDetails; // Store attraction details
                        } catch (error) {
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
                // First, try to fetch event details
                const eventDetails = await eventService.goToEventDetails(eventID);
                console.log("Event Details:", eventDetails);
                this.eventDetails[eventID] = eventDetails; // Store event details keyed by eventID
                this.errorState = false; // Reset error state since event details are found
                return; // Stop further execution as we have found the event details
            } catch (error) {
                console.error("Failed to fetch event details:", error);
            }

            try {
                // If event details not found, try to fetch attraction details
                const attractionDetails = await attractionService.goToAttractionDetails(eventID);
                console.log("Attraction Details:", attractionDetails);
                this.attractionDetails[eventID] = attractionDetails; // Store attraction details keyed by eventID
                this.errorState = false; // Reset error state since attraction details are found
                return; // Stop further execution as we have found the attraction details
            } catch (error) {
                console.error("Failed to fetch attraction details:", error);
            }

            try {
                // If both event and attraction details are not found, try fetching organiser event details
                const organiserEventDetails = await organiserEventService.getEventById(eventID);
                console.log("Organiser Event Details:", organiserEventDetails);
                this.organiserEventDetails[eventID] = organiserEventDetails; // Store organiser event details keyed by eventID
                this.errorState = false; // Reset error state since organiser event details are found
                // title will be updated once drop
                this.$nextTick(() => {
                    console.log("Updated organiser event details", this.organiserEventDetails);
                });
                return; // Stop further execution as we have found the organiser event details
            } catch (error) {
                console.error("Failed to fetch organiser event details:", error);
            }

            // If all fetch attempts failed, set error state
            this.errorState = true;
            console.error("All fetch attempts failed for eventID:", eventID);
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
                    location.reload();
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
                // Ensure sortedEvents contains the latest dragged event details
                const updatedEvents = this.sortedEvents.map(event => ({
                    time: event.time, // Using event object's time
                    eventID: event.eventID, // Ensure eventID is the correct one after drag
                }));

                // Prepare updated itinerary details
                const updatedData = {
                    title: this.itineraryDetails.title,
                    date: this.itineraryDetails.date, // Access date directly from itineraryDetails
                    budget: this.itineraryDetails.budget, // Access budget directly from itineraryDetails
                    collaborators: this.itineraryDetails.collaborators || [], // Access collaborators
                    events: updatedEvents, // Make sure to use the updated events
                };

                // Call update itinerary service with the latest event data
                const id = this.$route.params.id;
                await itineraryService.updateItinerary(id, updatedData);

                console.log("UPDATEDEVENTS", updatedEvents)

                this.updateMessage = "Itinerary updated successfully."; // Success message
                this.firstLoad = false;

                // Clear the success message after 2 seconds
                setTimeout(() => {
                    this.updateMessage = null;
                    // location.reload();
                }, 2000);
            }
            catch (error) {
                // Only show the error if the wishlist is not empty
                if (this.wishlists && this.wishlists.length > 0) {
                    this.updateError = "Error updating itinerary: " + error.message; // Error message
                    console.error("Error updating itinerary:", error);
                }
                this.firstLoad = false;
            }
        },



        // Toggle sidebar expansion
        toggleExpand() {
            this.isExpanded = !this.isExpanded;
            this.reapplyListenersOnSidebarToggle(); // Reapply listeners when sidebar is toggled
        },

        // Function to reattach drag and drop listeners
        reattachDragListeners() {
            const rows = document.querySelectorAll('.event-row');
            rows.forEach(row => {
                row.addEventListener('dragover', this.allowDrop);  // `this` makes sure you're calling the correct method
                row.addEventListener('drop', this.onDrop);          // `this` makes sure you're calling the correct method
            });
        },

        // Method to handle reattaching listeners when sidebar is toggled
        reapplyListenersOnSidebarToggle() {
            this.reattachDragListeners();       // Reattach drag listeners
        },


        // Methods for drag and drop of wishlist item into events table

        handleDragOverSidebar(event) {
            // Prevent default to allow drop in sidebar
            event.preventDefault();

            // Get the sidebar element
            const sidebar = document.querySelector('.wishlist-sidebar');

            // Get the bounding rect of the sidebar
            const sidebarTop = sidebar.getBoundingClientRect().top;
            const sidebarBottom = sidebar.getBoundingClientRect().bottom;

            // Calculate the mouse's position relative to the sidebar
            const mouseY = event.clientY;
            const topDiff = mouseY - sidebarTop;
            const bottomDiff = sidebarBottom - mouseY;

            // Log the differences for debugging
            console.log('auto-scroll conditions:', { topDiff, bottomDiff });

            // Scroll the sidebar down when the mouse is near the bottom
            if (bottomDiff < 20) { // Adjust this threshold as needed
                sidebar.scrollTop += 5; // Scroll down slowly
            }

            // Scroll the sidebar up when the mouse is near the top
            if (topDiff < 20) { // Adjust this threshold as needed
                sidebar.scrollTop -= 5; // Scroll up slowly
            }

            // Update currentClientY for future calculations if needed
            this.currentClientY = event.clientY;
        },

        handleDragOverTable(event) {
            // Only handle dragover for events table, without affecting sidebar
            event.preventDefault();
        },



        // Start auto-scroll only for sidebar if close to top or bottom
        startAutoScroll() {
            if (this.isDragging) {
                const sidebar = this.$refs.wishlistSidebar;

                if (sidebar) {
                    const boundingRect = sidebar.getBoundingClientRect();
                    // console.log('Auto-scroll conditions:', {
                    //     bottomDiff: boundingRect.bottom - this.currentClientY,
                    //     topDiff: this.currentClientY - boundingRect.top
                    // });

                    // Scroll down if close to bottom
                    if (boundingRect.bottom - this.currentClientY < 50) {
                        sidebar.scrollTop += this.autoScrollSpeed;
                        // console.log('Scrolling down');
                    }
                    // Scroll up if close to top
                    if (this.currentClientY - boundingRect.top < 50) {
                        sidebar.scrollTop -= this.autoScrollSpeed;
                        // console.log('Scrolling up');
                    }
                } else {
                    console.log('Sidebar reference is undefined');
                }
            } else {
                console.log('isDragging is false, skipping auto-scroll');
            }
        },





        // Make the event item width dynamic
        // Method to return dynamic styles and attributes for the event column based on its timing
        getColumnStyle(event) {
            const rowspan = this.getEventRowspan(event);
            console.log(rowspan, "ROWSPAN STYLE");

            return {
                rowspan: `${rowspan}`,
                backgroundColor: 'lightblue' // Example of conditional styling
            };
        },

        getEventRowspan(event) {
            const eventIndex = this.sortedEvents.findIndex(e => e.eventID === event.eventID);
            const currentTime = event.time; // e.g., '01:00'
            let totalRowspan = 1; // Initialize with the minimum rowspan of 1

            // Iterate to find only the first next event with the same eventID
            for (let i = eventIndex + 1; i < this.sortedEvents.length; i++) {
                if (this.sortedEvents[i].eventID === event.eventID) {
                    const nextEvent = this.sortedEvents[i];
                    const nextTime = nextEvent.time; // e.g., '03:00'
                    console.log(`Next event found for eventID: ${event.eventID}, nextTime: ${nextTime}`);

                    if (nextTime) {
                        const [currentHour, currentMinute] = currentTime.split(':').map(Number);
                        const [nextHour, nextMinute] = nextTime.split(':').map(Number);

                        const currentTimeInMinutes = currentHour * 60 + currentMinute;
                        const nextTimeInMinutes = nextHour * 60 + nextMinute;

                        // Calculate the time difference and convert to rows (+1 for inclusive counting)
                        const timeDifferenceInMinutes = nextTimeInMinutes - currentTimeInMinutes;
                        const rowspan = Math.max(1, Math.ceil(timeDifferenceInMinutes / 60) + 1); // Add 1 to include the start

                        console.log(`Calculated rowspan for eventID ${event.eventID}:`, rowspan);

                        // Confirming function exit after finding the first match
                        console.log(`Exiting function after processing eventID ${event.eventID} with calculated rowspan.`);

                        // Return the calculated rowspan and stop further iterations
                        return rowspan;
                    }
                }
            }

            console.log(`Total calculated rowspan for eventID ${event.eventID}:`, totalRowspan);
            return totalRowspan; // Default return if no next event is found
        },




        startResize(event, eventItem) {
            let startX = event.clientX; // Get the initial mouse position
            const startRowspan = this.getEventRowspan(eventItem); // Get current rowspan

            const onMouseMove = (e) => {
                const diff = e.clientX - startX; // Calculate the difference in mouse position
                const newRowspan = Math.max(startRowspan + Math.floor(diff / 40), 1); // Update rowspan, ensure minimum 1
                this.updateRowspan(eventItem, newRowspan); // Update rowspan in the data model
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        },

        updateRowspan(eventItem, newRowspan) {
            eventItem.rowspan = newRowspan; // Only update rowspan
            console.log(`Updated rowspan for eventID ${eventItem.eventID}:`, newRowspan);
        },









        // Method to handle the drag start event
        onDragStart(event, draggedItemData) {
            console.log("Drag started", draggedItemData);
            event.dataTransfer.setData('text/plain', JSON.stringify(draggedItemData));

            // If screen width is below 768px, close the sidebar during drag
            if (window.innerWidth <= 768) {
                this.closeSidebar();
            }

            this.isDragging = true;
            // Capture the initial position of the mouse when the drag starts
            this.currentClientY = event.clientY;
            console.log('Starting auto-scroll interval');
            this.autoScrollInterval = setInterval(this.startAutoScroll, 30);
        },

        // Method to track the mouse position during dragging
        onMouseMove(event) {
            if (this.isDragging) {
                this.currentClientY = event.clientY; // Update mouse Y position
            }
        },

        onDragEnd() {
            console.log("Drag ended");
            clearInterval(this.autoScrollInterval);
            this.isDragging = false;
        },



        // For responsive to close wishlist sidebar when dragging in mobile view
        closeSidebar() {
            const sidebar = document.querySelector('.wishlist-sidebar');
            sidebar.classList.remove('expanded'); // Close sidebar by removing expanded class
        },
        openSidebar() {
            const sidebar = document.querySelector('.wishlist-sidebar');
            sidebar.classList.add('expanded'); // Open sidebar by adding expanded class
        },




        async onDrop(event) {
            // Optional: Reopen sidebar if needed (after the drop)
            if (window.innerWidth <= 768) {
                this.openSidebar();
            }
            this.isDragging = false;
            clearInterval(this.autoScrollInterval);

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
                        console.log("Dragging within the table, updating event timing.", wishlistItem.eventID, time);
                        await this.updateEventTiming(wishlistItem.eventID, time); // Await here

                        // Instead of location.reload(), we can update the state and re-render the component
                        this.$nextTick(() => {
                            console.log("Event timing updated. DOM should reflect changes.");
                        });
                    } else {
                        // Otherwise, treat it as coming from the wishlist
                        console.log("Dragging from the wishlist, adding to event.", wishlistItem, { eventID, time });
                        await this.addToEvent(wishlistItem, { eventID, time }); // Await here

                        // Optionally, update the state after adding to the event
                        this.$nextTick(() => {
                            console.log("Wishlist item added to event. DOM should reflect changes.");
                        });
                    }
                } else {
                    console.error("Wishlist item does not have a valid eventID or attractionID.");
                }
            } else {
                console.error("Dropped event does not have a valid row.");
            }
        },


        async removeFromWishlist(wishlistItem) {
            try {
                // Delete the item from the backend using itineraryService
                await itineraryService.deleteWishlist(wishlistItem.id);

                // Remove the item from the wishlist array locally
                const index = this.wishlists.findIndex(item => item.id === wishlistItem.id);
                if (index !== -1) {
                    this.wishlists.splice(index, 1);
                } else {
                    console.error("Wishlist item not found locally.");
                }
            } catch (error) {
                console.error("Error removing wishlist item:", error);
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
            const id = wishlistItem.eventID || wishlistItem.attractionID;
            let existingEvent = this.sortedEvents.find(event => event.time === time);

            if (existingEvent) {
                // Update the existing event with details from the wishlist
                existingEvent.eventID = id;
                existingEvent.name = this.eventDetails[id]?.name || this.attractionDetails[id]?.name;
            } else {
                // If the event does not exist, create a new one
                this.sortedEvents.push({
                    time: time,
                    eventID: eventID,
                    name: this.eventDetails[eventID]?.name || this.attractionDetails[id]?.name,
                });
            }

            console.log("Updated sortedEvents:", this.sortedEvents); // Verify updated events

            // Delete from wishlist
            try {
                await itineraryService.deleteWishlist(wishlistItem.id);
                this.wishlists = this.wishlists.filter(wishlist => wishlist.id !== wishlistItem.id);
            } catch (error) {
                console.error("Failed to delete wishlist item:", error);
            }

            // Update the itinerary with the latest state
            try {
                console.log("Before handleUpdate:", this.sortedEvents);
                await this.handleUpdate(); // Make sure handleUpdate reflects the latest sortedEvents
                console.log("Update completed.");
            } catch (error) {
                console.error("Failed to update itinerary:", error);
            }
        },





        // Cursor trial with pixi.js
        initializeTrail() {
            try {
                // Ensure the canvas reference is available
                if (!this.$refs.pixiCanvas) {
                    console.error('Pixi canvas reference is not available.');
                    return;
                }

                // Create a new PixiJS application
                this.app = new PIXI.Application({
                    view: this.$refs.pixiCanvas,
                    antialias: true,
                    resizeTo: window,
                    backgroundColor: 0xFFFFFF,
                });

                // Load the Font Awesome pencil icon as an SVG texture
                const pencilTexture = PIXI.Texture.from(require('@/assets/pencil-solid.svg')); // Use require to load the SVG

                // Create a sprite for the pencil icon
                this.pencilIcon = new PIXI.Sprite(pencilTexture);
                this.pencilIcon.anchor.set(0.5);
                this.pencilIcon.width = 32; // Set the desired width
                this.pencilIcon.height = 32; // Set the desired height
                this.app.stage.addChild(this.pencilIcon);

                // Enable interactivity
                this.app.stage.interactive = true;
                this.app.stage.hitArea = this.app.screen;

                // Follow the pointer
                this.app.stage.on('pointermove', (e) => {
                    this.pencilIcon.position.copyFrom(e.global);
                });

                // Resize the canvas when the window is resized
                this.onResize = () => {
                    if (this.app) {
                        this.app.renderer.resize(window.innerWidth, window.innerHeight);
                    }
                };
                window.addEventListener('resize', this.onResize);

                // Initial resize
                this.app.renderer.resize(window.innerWidth, window.innerHeight);
            } catch (error) {
                console.error('Error initializing trail:', error);
            }

        },
    },


    // use beforeUnmount to reflect the updated Vue lifecycle hook.
    beforeUnmount() {
        // Clean up the PixiJS application when the component is unmounted
        if (this.app) {
            this.app.stage.off('pointermove', this.onPointerMove); // Remove pointer move event listener
            window.removeEventListener('resize', this.onResize); // Remove resize event listener
            this.app.destroy(true, { children: true }); // Clean up the app
        }
    },


};
</script>


<style scoped>
/* Jumbotron -- wishlist */
/* Regular sidebar styles */
.sidebar-container {
    position: relative;
    z-index: 10;
    height: 100vh;
    /* Ensure the container takes full height */
    overflow-y: auto;
    /* Allow vertical scrolling */
}

.wishlist-sidebar {
    position: fixed;
    top: 150px;
    left: -250px;
    height: calc(100% - 20px);
    width: 250px;
    background-color: #edefec;
    padding: 1rem;
    margin-top: 10px;
    margin-bottom: 10px;
    transition: left 0.3s ease;
    overflow-y: auto;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}


.wishlist-sidebar.expanded {
    left: 0;
}

.expand-icon {
    position: fixed;
    top: 150px;
    left: 10px;
    font-size: 24px;
    color: #000;
    cursor: pointer;
    transition: left 0.3s ease;
    z-index: 1100;
    margin: 10px;
    /* Add margin here */
}

.expand-icon.icon-expanded {
    left: 260px;
}



/* Table row style when dragging */
tr.drag-over {
    background-color: rgba(0, 0, 0, 0.1);
    /* Light gray */
    border: 1px dashed #000;
    /* Optional dashed border */
}

/* Table rows are above the sidebar */
.table-row {
    position: relative;
    z-index: 10;
}

/* Sidebar positioning to allow drop events */
.sidebar {
    z-index: 5;
    position: relative;
}

/* Responsive CSS for screens with max-width 768px */
@media (max-width: 768px) {
    .wishlist-sidebar {
        left: -250px;
        /* Hidden sidebar initially */
    }

    .wishlist-sidebar.expanded {
        left: 0;
        /* Show sidebar */
    }

    .expand-icon {
        left: 10px;
        /* Position icon at the top-left */
    }

    .expand-icon.icon-expanded {
        left: 260px;
        /* Icon position when sidebar is expanded */
    }
}







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
    right: 10px;
    cursor: pointer;
    color: #f00;
    font-size: 1.2em;
    z-index: 10;
    /* Ensures it is on top of other elements */
}

.draggable-item {
    cursor: grab;
}





canvas {
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    position: fixed;
    /* Fixed to stay in view while scrolling */
    top: 0;
    left: 0;
    z-index: 0;
    /* Lower than other content */
}


/* CSS for Cursor Trail */
#trailimageid {
    position: fixed;
    /* Change to fixed to follow the viewport */
    visibility: visible;
    pointer-events: none;
    left: 0;
    top: 0;
    width: 1px;
    height: 1px;
    z-index: 1000;
}

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
    position: fixed;
    pointer-events: none;
    transition: none;
    /* Reduce to minimal delay for faster movement */
}

/* Pop notification */
/* Base style for pop-up notification */
.popNotif {
    position: fixed;
    top: 120px;
    right: 20px;
    z-index: 1000;
    padding: 15px 20px;
    border-radius: 5px;
    color: #fff;
    transform: translateX(100%);
    opacity: 0;
    transition: transform 0.4s ease, opacity 0.4s ease;
    font-size: 1rem;
}

.popNotif {
    transform: translateX(0);
    opacity: 1;
    background-color: #F9F9F9;
    /* Grey background */
    color: black;
    border-left: 15px solid transparent;
    /* Accent border for success or error */
    border-radius: 4px;

}

/* Success and Error Notification Styles */
.popNotif.success {
    border-left-color: #28a745;
    /* Green accent border for success */
}

.popNotif.error {
    border-left-color: #dc3545;
    /* Red accent border for error */
}

/* Responsive styling for screens up to 768px */
@media (max-width: 768px) {
    .popNotif {
        margin-top: 100px;
        /* Space for navigation bar */
        margin: 0;
        /* Margin for notifications */
        position: fixed;
        /* Keep notifications in fixed position */
        left: 10px;
        /* Space from the left edge */
        right: 10px;
        /* Space from the right edge */
        bottom: auto;
        /* Reset bottom */
        width: calc(100% - 20px);
        /* Full width minus left and right margins */
        max-width: none;
        /* Remove max-width */
        border-radius: 0;
        /* Remove border radius for flush look */
        box-sizing: border-box;
        /* Include padding in width calculation */
    }

    /* Success and Error Notification Styles on smaller screens */
    .popNotif.success {
        background-color: #F9F9F9;
        /* Background color */
        border: 2px solid green;
        /* Green border for success */
        border-radius: 10px;
        /* Rounded corners */
    }

    .popNotif.error {
        background-color: #F9F9F9;
        /* Background color */
        border: 2px solid red;
        /* Red border for error */
        border-radius: 3%;
        /* Slightly rounded corners */
    }

}


/* Styling for the resizable column */
/* Styling for resizable column */
.event-details-wrapper,
.attraction-details-wrapper {
    position: relative;
    border: 1px solid #ccc;
    transition: width 0.2s ease;
}

/* Resize Handle */
.resize-handle {
    position: absolute;
    bottom: 0;
    /* Position at the bottom edge of the cell */
    left: 0;
    width: 100%;
    /* Span the entire width of the cell */
    height: 10px;
    /* Height of the resize handle */
    cursor: ns-resize;
    /* Vertical resize cursor */
    background-color: rgba(0, 0, 0, 0.1);
    /* Light background for the resize handle */
}

/* Show resize handle on hover */
.event-details-wrapper:hover .resize-handle,
.attraction-details-wrapper:hover .resize-handle {
    opacity: 1;
}

/* Updated Keyframes for resizing animation */
@keyframes resizeAnimation {
    0% {
        background-color: rgba(0, 0, 0, 0.05);
        transform: scale(1);
    }

    50% {
        background-color: rgba(0, 0, 0, 0.1);
        transform: scale(1.01);
        /* Slight scale for a subtle effect */
    }

    100% {
        background-color: rgba(0, 0, 0, 0.05);
        transform: scale(1);
    }
}

/* Apply the animation to the resizable column during resize */
.event-details-wrapper.resizing,
.attraction-details-wrapper.resizing {
    animation: resizeAnimation 0.4s ease-in-out;
}

/* Styling for when an element is being dragged */
.event-details-wrapper.dragging,
.attraction-details-wrapper.dragging {
    animation: draggingAnimation 0.3s ease-in-out;
}

/* Optional styling for the placeholder row */
.placeholder-td {
    text-align: center;
    padding: 10px;
    background: #f5f5f5;
}
</style>
