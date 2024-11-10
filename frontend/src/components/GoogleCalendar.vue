<template>
    <div>
        <button v-if="!loggedIn && !successMessage" @click="handleAuthClick" class="btn btn-info" style="position: fixed; left: 50px;">
            Connect to Google Calendar
        </button>
        <button v-if="loggedIn && !successMessage" @click="checkAndAddOrUpdateEvent" class="btn btn-info" style="position: fixed; left: 50px;">Add Itinerary</button>

        <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
        </div>

    </div>
</template>

<script>
import { gapi } from 'gapi-script';
import { getGoogleClientId } from '../services/getGoogleClientId';
import EventBus from '../utils/eventBus.js';

export default {
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
                console.error('Error during Google sign-in:', error)});
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
                start: {date: this.date, timeZone: 'Asia/Singapore'},
                end: {date: this.date, timeZone: 'Asia/Singapore'},
                reminders: {useDefault: false, overrides: 
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
.btn {
    z-index: 3;
}

.alert-success {
    color: #155724;
    border-color: #c3e6cb;
    border-radius: 5px;
}
</style>
