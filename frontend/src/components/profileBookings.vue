<template>
    <h5 class="text-start">Bookings</h5>

    <!-- Show the Upcoming Bookings section if there are any bookings -->
    <div v-if="bookings.length > 0">
        <div class="mt-3 shadow p-3 bg-body hover-effect">
            <h5 class="text-start">Upcoming Events</h5>
            <!-- Loop through bookings and display each booking's details -->
            <div v-for="(booking, index) in Object.values(bookings)" :key="index" class="booking-card mt-2 p-3 pb-1 shadow-sm text-start">
                <h6>{{ booking.title }}</h6>
                <p class="mb-0 mt-4">Date: {{ booking.date }}</p>
                <p class="mb-0">Time: {{ booking.time }}</p>
                <p class="text-end mt-4" style="font-size: 10px;;">*If you would like to make modifications to your booking, please contact the organiser.</p>
            </div>
        </div>
    </div>

    <!-- Message if no bookings are available -->
    <div v-else class="mt-3 p-3">
        <p>No upcoming bookings available.</p>
    </div>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get} from 'firebase/database';

export default {
    data() {
        return {
            bookings: [],
        };
    },
    mounted() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        this.displayName = user.displayName || 'No name available';
        this.email = user.email;

        // Fetch user bookings from the database
        const db = getDatabase();
        const profileRef = ref(db, 'users/' + user.uid);

        get(profileRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                this.bookings = data.bookings || [];
                this.bookings = this.bookings.filter(booking => new Date(booking.date) >= new Date());
                this.bookings.sort((a, b) => {
                    const dateA = new Date(a.date); 
                    const dateB = new Date(b.date);  
                    return dateA - dateB;  
                });
            } else {
                console.log('No profile data found for user.');
            }
        });
    } else {
        console.log('No user is currently logged in.');
    }
},
    methods: {
    },
};
</script>

<style scoped>
.booking-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    background-color: #ffffff;
}

.booking-card h6 {
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
