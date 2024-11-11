<template>
    <div>
        <button v-if="!loggedIn && !successMessage" @click="handleAuthClick" class="btn btn-custom" style="position: fixed; left: 50px;">
            <span class="google-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3C34.9 32.7 30.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.8-5.8C33.5 5.1 28.1 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c10.2 0 18.3-7.2 19.6-16.5.1-.5.4-2.3.4-3.5z"/>
                    <path fill="#e53935" d="M6.3 14.9l6.6 4.8C14.5 16 18.9 13 24 13c3 0 5.7 1.1 7.8 2.9l5.8-5.8C33.5 5.1 28.1 3 24 3c-7.4 0-13.7 3.6-17.7 9.1z"/>
                    <path fill="#4caf50" d="M24 43c5.4 0 10-1.8 13.7-4.8l-6.3-5.2c-1.8 1.3-4.1 2.1-7.4 2.1-4.7 0-8.7-2.7-10.7-6.6l-6.4 4.9C10.1 39.8 16.6 43 24 43z"/>
                    <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.6 4.5-4.9 5.9l6.3 5.2c.4-.4 8-5.9 8-17.1 0-1.2-.1-2.4-.4-3.5z"/>
                </svg>
            </span>
            Connect to Google Calendar
        </button>
        <button v-if="loggedIn && !successMessage" @click="checkAndAddOrUpdateEvent" class="btn btn-custom" style="position: fixed; left: 50px;">
            <font-awesome-icon :icon="['fas', 'calendar-plus']" /> Add Itinerary
        </button>

        <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
        </div>
    </div>
</template>


<script>
import { gapi } from 'gapi-script';
import { getGoogleClientId } from '../services/getGoogleClientId';
import EventBus from '../utils/eventBus.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons'; // Import the icon you want to use
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

// Add the icon to the library
library.add(faCalendarPlus, faGoogle);

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            CLIENT_ID: '',
            API_KEY: '',
            DISCOVERY_DOCS: [
                'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
            ],
            SCOPES: 'https://www.googleapis.com/auth/calendar',
            events: [],
            loggedIn: false,
            successMessage: null,
        };
    },
    async mounted() {
        const gapiData = await getGoogleClientId();
        this.CLIENT_ID = gapiData.clientId;
        this.API_KEY = gapiData.clientSecret;

        this.loadScript(
            'https://apis.google.com/js/api.js',
            this.handleClientLoad
        );
        EventBus.on('google-oauth2-sign-out', this.handleSignOutClick);
    },
    props: ['itinerary', 'date'],
    methods: {
        loadScript(src, onload) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onload = onload;
            document.head.appendChild(script);
        },
        handleClientLoad() {
            gapi.load('client:auth2', this.initClient);
        },
        initClient() {
            gapi.client
                .init({
                    apiKey: this.API_KEY,
                    clientId: this.CLIENT_ID,
                    discoveryDocs: this.DISCOVERY_DOCS,
                    scope: this.SCOPES,
                })
                .then(() => {
                    gapi.auth2
                        .getAuthInstance()
                        .isSignedIn.listen(this.updateSigninStatus);
                    this.updateSigninStatus(
                        gapi.auth2.getAuthInstance().isSignedIn.get()
                    );
                });
        },
        updateSigninStatus(isSignedIn) {
            this.loggedIn = isSignedIn;
            if (isSignedIn) {
                console.log('authorised google calendar');
                this.listUpcomingEvents();
            }
        },
        handleAuthClick() {
            gapi.auth2.getAuthInstance().signIn().catch((error) => {
                console.error('Error during Google sign-in:', error)
            });
        },
        async handleSignOutClick() {
            await gapi.auth2
                .getAuthInstance()
                .signOut()
                .then(() => {
                    this.events = [];
                    this.loggedIn = false;
                });
        },

        async checkAndAddOrUpdateEvent() {
            // Fetch upcoming events to check for a matching event
            await gapi.client.calendar.events
                .list({
                    calendarId: 'primary',
                    // timeMin: new Date().toISOString(),
                    showDeleted: false,
                    singleEvents: true,
                    orderBy: 'startTime',
                })
                .then((response) => {
                    const events = response.result.items;

                    console.log(events)
                    // Check if an event with the same title and date already exists
                    const matchingEvent = events.find((event) =>
                        event.summary === this.itinerary &&
                        event.start.date === this.date
                    );

                    console.log(matchingEvent)

                    if (matchingEvent) {
                        // If a matching event is found, update it
                        this.updateEvent(matchingEvent.id);
                    } else {
                        // If no matching event is found, create a new event
                        console.log("this is a new event")
                        this.addEvent();
                    }
                })
                .catch((error) => {
                    console.error('Error fetching events:', error);
                });
        },

        addEvent() {
            const event = {
                summary: this.itinerary,
                description: 'Log in to Activity.ai for more details on this itinerary',
                start: { date: this.date, timeZone: 'Asia/Singapore' },
                end: { date: this.date, timeZone: 'Asia/Singapore' },
                reminders: {
                    useDefault: false, overrides:
                        [{ method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 }],
                },
            };
            gapi.client.calendar.events
                .insert({
                    calendarId: 'primary',
                    resource: event,
                })
                .then((response) => {
                    console.log('Event created: ', response.result);
                    this.events.push(response.result);

                    // success message
                    this.successMessage = "Itinerary successfully added to Your Google Calendar.";
                    setTimeout(() => {
                        this.successMessage = null;
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Error creating event:', error);
                });
        },

        updateEvent(eventId) {
            const updatedEvent = {
                summary: this.itinerary,
                description: 'Log in to Activity.ai for updated details on this itinerary',
                start: { date: this.date, timeZone: 'Asia/Singapore' },
                end: { date: this.date, timeZone: 'Asia/Singapore' },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 }
                    ],
                },
            };

            gapi.client.calendar.events
                .update({
                    calendarId: 'primary',
                    eventId: eventId,
                    resource: updatedEvent,
                })
                .then((response) => {
                    console.log('Event updated: ', response.result);
                    this.successMessage = "Itinerary successfully updated.";
                    setTimeout(() => {
                        this.successMessage = null;
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Error updating event:', error);
                });
        },
        listUpcomingEvents() {
            if (this.loggedIn) {
                gapi.client.calendar.events
                    .list({
                        calendarId: 'primary',
                        // timeMin: new Date().toISOString(),
                        showDeleted: false,
                        singleEvents: true,
                        maxResults: 10,
                        orderBy: 'startTime',
                    })
                    .then((response) => {
                        const events = response.result.items;
                        if (events.length > 0) {
                            this.events = events;
                            for (
                                let i = 0;
                                i < Math.min(events.length, 3);
                                i++
                            ) {
                                // console.log(events[i]);
                            }
                        } else {
                            console.log('No upcoming events found.');
                        }
                    });
            } else {
                console.log('You have not logged into Google Calendar');
            }
        },
    },
    onUnmounted() {
        // Cleanup the event listener
        EventBus.off('google-oauth2-sign-out', this.handleSignOutClick);
    },
};
</script>

<style scoped>
/* Add your styles */
.btn-custom {
    z-index: 3;
    background-color: #4285F4;
    /* Google blue */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    /* Space between icon and text */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
}

.btn-custom:hover {
    background-color: #357AE8;
    /* Darker blue for hover */
    transform: translateY(-2px);
}

.btn-custom:active {
    background-color: #2a68c1;
    /* Even darker for active state */
}
.google-icon svg {
    width: 20px;
    height: 20px;
}


.alert-success {
    color: #155724;
    border-color: #c3e6cb;
    border-radius: 5px;
}
</style>
