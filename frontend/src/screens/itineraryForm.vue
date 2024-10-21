<template>
    <div class="container mt-5">
        <h2>Event Submission Form</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" id="title" v-model="formData.title" required />
            </div>

            <div class="mb-3">
                <label for="budget" class="form-label">Budget</label>
                <input type="number" class="form-control" id="budget" v-model.number="formData.budget" />
            </div>

            <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <input type="date" class="form-control" id="date" v-model="formData.date" :min="today" required />
            </div>

            <div class="mb-3">
                <label for="collaborators" class="form-label">Collaborators</label>
                <input type="text" class="form-control" id="collaborators" v-model="displayedEmail"
                    placeholder="Comma-separated names" />
            </div>

            <h3>Timetable</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Event ID</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="hour in hours" :key="hour">
                        <td>{{ hour }}</td>
                        <td>
                            <input type="text" v-model="formData.events[hour]" class="form-control"
                                placeholder="Event ID" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <br>
            <button type="submit" class="btn btn-primary">Create</button>
        </form>
    </div>
</template>

<script>
import ItineraryService from '../services/itineraryService';
import { getAuth } from 'firebase/auth';


export default {
    data() {
        return {
            formData: {
                title: '',
                budget: null,
                totalCost: null,
                date: '',
                collaborators: '',  // Will be populated from sessionStorage
                events: {}, // Initialize as an empty object
                displayedEmail: "", //create a displayedEmail variable
            },
            hours: [],  // Initialize empty and populate in created hook
            isLoading: true
        };
    },
    created() {
        this.hours = this.generateHours();
        this.formData.events = this.initializeTimetable();

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const uid = sessionStorage.getItem('uid');
            this.formData.collaborators = uid || ''; // Check if uid exists
            this.formData.email = user.email || ''; // Default to empty string if email is not available
            this.displayedEmail = user.email|| '';
            console.log('User email:', this.formData.email);
        } else {
            console.log('No user is signed in');
        }

        this.isLoading = false; // Set loading to false after data retrieval
    },

    computed: {
        today() {
            const today = new Date(); // Get today's date
            const dd = String(today.getDate()).padStart(2, '0'); // Day
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month
            const yyyy = today.getFullYear(); // Year
            return `${yyyy}-${mm}-${dd}`; // Return in YYYY-MM-DD format
        },
    },

    methods: {
        async handleSubmit() {
            console.log(this.formData);

            // Split the collaborators string into an array
            const collaboratorsArray = this.formData.collaborators.split(',').map(name => name.trim());

            // Transform events object into an array of objects with "time" and "eventID"
            const eventsArray = Object.keys(this.formData.events).map(hour => ({
                time: hour,
                eventID: this.formData.events[hour],
            }));

            // Update formData to include the collaborators array and events array
            const dataToSubmit = {
                ...this.formData,
                collaborators: collaboratorsArray, // Replace the string with an array
                events: eventsArray, // Replace events object with eventsArray
            };
            console.log(dataToSubmit);
            try {
                const response = await ItineraryService.postItinerary(dataToSubmit);
                console.log('Itinerary successfully added:', response);

                // Redirect to the itinerary details page using the ID from the response
                this.$router.push(`/ItineraryDetails/${response.id}`); // Use the appropriate key for ID in the response

                this.resetForm();
            } catch (error) {
                console.error('Error adding itinerary:', error);
            }
        },

        generateHours() {
            const hours = [];
            for (let i = 0; i < 24; i++) {
                const hour = i < 10 ? `0${i}:00` : `${i}:00`;
                hours.push(hour);
            }
            return hours;
        },
        initializeTimetable() {
            return this.hours.reduce((acc, hour) => {
                acc[hour] = '';  // Set default value for each hour
                return acc;
            }, {});
        },
        resetForm() {
            this.formData = {
                title: '',
                budget: null,
                totalCost: null,
                date: '',
                collaborators: sessionStorage.getItem('uid') || '',  // Reset to sessionStorage value
                events: this.initializeTimetable(),
            };
        }
    }
};
</script>

<style scoped>
.table {
    margin-top: 20px;
}
</style>
