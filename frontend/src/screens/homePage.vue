<template>
    <div class="homepage">
        <h1>Upcoming Events</h1>
        <GoogleLogin />
        <div class="event-container" v-if="events.length">
            <div
                class="event"
                v-for="event in events"
                :key="event.id"
                @click="goToEventDetails(event.id)"
                style="cursor: pointer"
            >
                <h2>{{ event.name }}</h2>
                <p>Type: {{ event.type }}</p>
                <p>
                    Age Restrictions:
                    {{ event.ageRestrictions.legalAgeEnforced }}
                </p>
            </div>
        </div>
        <p v-else>No events available.</p>
    </div>
</template>

<script>
import eventService from '../services/eventService'; // Import the event service

export default {
    name: 'HomePage',
    data() {
        return {
            events: [], // Initialize events as an empty array
        };
    },

    /* mounted() hook is part of Vue's lifecycle methods. It is called when the component is fully 
    mounted (i.e., inserted into the DOM). This is a good place to perform actions like fetching data from APIs.
    runs when the component is fully loaded and shown to the user. It's often used to load data from a server or API.*/
    async mounted() {
        try {
            this.events = await eventService.displayEvents(); // Fetch events from the service
            console.log(this.events);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    },

    methods: {
        goToEventDetails(id) {
            // Use Vue Router's 'push' method to navigate to EventDetails page
            this.$router.push({ name: 'EventDetails', params: { id } });
        },
    },
};
</script>

<script setup>
import GoogleLogin from '../components/GoogleLogin.vue';
</script>

<style>
.homepage {
    text-align: center;
    padding: 20px;
}

.event-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
}

.event {
    border: 1px solid #2c3e50;
    border-radius: 8px;
    padding: 15px;
    margin: 10px;
    width: 80%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.event:hover {
    transform: scale(1.02);
}

h2 {
    color: #2c3e50;
}

p {
    color: #555;
}
</style>
