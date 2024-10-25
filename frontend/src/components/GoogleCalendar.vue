<template>
    <div>
        <button v-if="!loggedIn" @click="handleAuthClick">
            Authorize Google Calendar
        </button>
        <!-- <button v-else @click="listUpcomingEvents">List Upcoming Events</button> -->
        <ul v-if="events.length" style="list-style: none">
            <li v-for="event in events" :key="event.id">
                {{ event.summary }} -
                {{ event.start.dateTime || event.start.date }}
            </li>
        </ul>
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
            gapi.auth2.getAuthInstance().signIn();
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
                                console.log(events[i]);
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
</style>
