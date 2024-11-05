<template>
    <div>
        <div v-if="loading" class="loading">
            <img class="loading-image" src="../assets/logo.png"/>
            <p>Loading...</p>
        </div>
        <div v-else>
            <div class="d-flex justify-content-center">
                <div class="col-8 container-fluid">
                    <div ref="topFocusElement" tabindex="-1"></div>
                    <div class="event-hero-wrapper">
                        <!-- Custom event image handling -->
                        <div v-if="isOrganiserEvent" 
                            class="custom-event-image" 
                            :style="{ backgroundColor: eventDetails.colour || '#1a1a40' }">
                            <img src="../assets/logo.png" alt="Event logo" class="event-logo" />
                        </div>
                        <!-- Ticketmaster event image -->
                        <img v-else
                            :src="eventDetails.images?.[0]?.url" 
                            class="event-hero-image"
                            alt="Event Image"/>
                    </div>
                </div>
            </div>
            <div class="event-details">
                <!-- Common details -->
                <h1>{{ isOrganiserEvent ? eventDetails.title : eventDetails.name }}</h1>
                <p>Type: {{ isOrganiserEvent ? 'Organiser Event' : eventDetails.type }}</p>
                
                <!-- Organiser Event specific details -->
                <div v-if="isOrganiserEvent">
                    <p>Date: {{ formatDate(eventDetails.start) }}</p>
                    <p>Time: {{ formatTime(eventDetails.start) }}</p>
                    <p v-if="eventDetails.description">Description: {{ eventDetails.description }}</p>
                    <p v-if="eventDetails.location">Location: {{ eventDetails.location }}</p>
                </div>
                
                <!-- Ticketmaster specific details -->
                <div v-else>
                    <p>Date: {{ eventDetails.dates?.start?.localDate }}</p>
                    <p>Time: {{ eventDetails.dates?.start?.localTime }}</p>
                    <p>Timezone: {{ eventDetails.dates?.timezone }}</p>
                    <p>Status: {{ eventDetails.dates?.status?.code }}</p>
                    <hr />
                    <div v-if="eventDetails.sales">
                        <h3>Sales:</h3>
                        <p>Start date: {{ eventDetails.sales.public?.startDateTime }}</p>
                        <p>End date: {{ eventDetails.sales.public?.endDateTime }}</p>
                    </div>
                    <p v-if="eventDetails.priceRanges?.length">
                        Price range:
                        {{ `${eventDetails.priceRanges[0].min || 'N/A'} to ${eventDetails.priceRanges[0].max || 'N/A'}
                        ${eventDetails.priceRanges[0].currency || ''}` }}
                    </p>
                </div>
            </div>
        </div>
        <EventNaviBar :event="eventDetails" :isOrganiserEvent="isOrganiserEvent"></EventNaviBar>
    </div>      
</template>

<script>
import eventService from "../services/eventService";
import organiserEventService from "../services/organiserEventService";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import EventNaviBar from "../components/EventDetails_navibar.vue"

export default {
    data() {
        return {
            eventDetails: {},
            loading: true,
            isOrganiserEvent: false
        };
    },
    components: {
        EventNaviBar,
    },
    async created() {
        this.fetchEventDetails();
    },
    methods: {
        async fetchEventDetails() {
            const id = this.$route.params.id;
            console.log('Fetching event details for ID:', id);
            
            try {
                this.loading = true;
                
                // Try to fetch from organiser events first
                try {
                    const organiserEvent = await organiserEventService.getEventById(id);
                    if (organiserEvent) {
                        this.eventDetails = organiserEvent;
                        this.isOrganiserEvent = true;
                        return;
                    }
                } catch (error) {
                    console.log('Not an organiser event, trying Ticketmaster...');
                }
                
                // If not found in organiser events, try Ticketmaster
                const ticketmasterEvent = await eventService.goToEventDetails(id);
                if (ticketmasterEvent) {
                    this.eventDetails = ticketmasterEvent;
                    this.isOrganiserEvent = false;
                } else {
                    throw new Error('Event not found');
                }
                
            } catch (error) {
                console.error("Failed to fetch event details:", error);
                // You might want to show an error message to the user here
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        formatTime(dateString) {
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
</script>

<style scoped>
@keyframes bob {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.loading {
    width: 50px;
    animation: bob 1.5s ease-in-out infinite;
    display: flex;
    align-items: center;
    margin: 50px auto;
}

.loading p {
    margin: 0 auto;
}

.loading-image {
    width: 100%
}

.event-hero-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 800px;
    max-height: 400px;
    height: auto;
    border-radius: 20px;
    overflow: hidden;
    margin: 20px auto;
}

.event-hero-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

.custom-event-image {
    width: 100%;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.event-logo {
    width: 120px;
    height: 120px;
    object-fit: contain;
}

.event-details {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}
</style>