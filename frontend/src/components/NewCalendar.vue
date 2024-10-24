<template>
    <div>
        <button @click="handleAuthClick">Authorize Google Calendar</button>
        <button @click="listUpcomingEvents">List Upcoming Events</button>
        <ul v-if="events.length">
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

export default {
    data() {
        return {
            CLIENT_ID: '', // Replace with your Google Client ID
            API_KEY: '', // Replace with your Google API Key
            DISCOVERY_DOCS: [
                'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
            ],
            SCOPES: 'https://www.googleapis.com/auth/calendar',
            events: [],
        };
    },
    async mounted() {
        // This is used to send a HTTP request to retrieve data that will be rendered by the component
        // Load Google API libraries
        const gapiData = await getGoogleClientId();
        this.CLIENT_ID = gapiData.clientId;
        this.API_KEY = gapiData.clientSecret;

        this.loadScript(
            'https://apis.google.com/js/api.js',
            this.handleClientLoad
        );
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
            console.log(this.API_KEY);
            console.log(this.CLIENT_ID);
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
            if (isSignedIn) {
                this.listUpcomingEvents();
            }
        },
        handleAuthClick() {
            gapi.auth2.getAuthInstance().signIn();
        },
        listUpcomingEvents() {
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
                    console.log(events);
                    if (events.length > 0) {
                        this.events = events;
                    } else {
                        console.log('No upcoming events found.');
                    }
                });
        },
    },
};
</script>

<style scoped>
/* Add your styles */
</style>
