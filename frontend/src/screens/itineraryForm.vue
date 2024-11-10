<template>
    <div class="container mt-5" style="max-width: 500px;">
        <!-- Display form only if user is signed in -->
        <form v-if="uid" @submit.prevent="handleSubmit">
            <div class="mt-3 shadow p-5 bg-body hover-effect text-start">
                <h2 class="text-start">New Itinerary</h2>
                <div class="mb-3 mt-4">
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
                    <input type="text" class="form-control" id="collaborators" v-model="formData.collaborators"
                        placeholder="Comma-separated collaborator emails" />
                </div>
                <br />
                <button class="btn back" @click="goToPrevPage">Back</button>
                <button type="submit" class="btn create">Create</button>
            </div>
            <!-- <h3>Timetable</h3>
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
            </table> -->
        </form>

        <!-- Message displayed if user is not signed in -->
        <div v-else>
            <p>Please log in to submit an event.</p>
        </div>
    </div>
</template>

<script>
import ItineraryService from '../services/itineraryService';
import { auth } from '../firebase/firebaseClientConfig';

export default {
    data() {
        return {
            formData: {
                title: '',
                budget: 0,
                totalCost: null,
                date: '',
                collaborators: '', // Will be populated with email addresses
                events: {}, // Initialize as an empty object
            },
            uid: null,
            hours: [], // Initialize empty and populate in created hook
            isLoading: true,
        };
    },
    created() {
        this.authListener();

        this.hours = this.generateHours();
        this.formData.events = this.initializeTimetable();

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
        goToPrevPage () {
            this.$router.back();
        },
        authListener() {
            // Listen to the authentication state
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // User is signed in
                    this.uid = user.uid; // Get the user ID
                    this.fetchUserEmail(); // Fetch and set the user's email
                    console.log(this.uid, "UID");
                } else {
                    // User is signed out
                    console.log("User is signed out");
                    this.$router.push("/login-for-users");
                }
            });
        },

        // Fetch user email using UID
        async fetchUserEmail() {
            if (this.uid) {
                try {
                    const user = auth.currentUser; // Get the currently signed-in user
                    if (user) {
                        this.email = user.email; // Get the user's email directly from Firebase Auth
                        console.log("User Email:", this.email);

                        // Initialize the collaborators field with the user's email
                    } else {
                        console.log("No user is currently signed in.");
                    }
                } catch (error) {
                    console.error("Error fetching user email:", error);
                }
            }
        },

        async getUIDByEmail(email) {
            try {
                const userRecord = await auth.getUserByEmail(email); // Fetch user by email
                return userRecord.uid; // Return the UID
            } catch (error) {
                console.error("Error fetching UID by email:", error);
                return null;
            }
        },


        async handleSubmit() {
            console.log(this.formData, "FORMDATA");

            // Split the collaborators string into an array of emails
            const user = auth.currentUser; // Get the currently signed-in user
            this.email = user.email;
            let collaboratorsArray = this.formData.collaborators
                    .split(',')
                    .map(collaborator => collaborator.trim());

            if (collaboratorsArray.length > 0) {
                collaboratorsArray.push(this.email)
            } else {
                collaboratorsArray = [this.email];
            }

            console.log("Array", collaboratorsArray);

            // Onitialize the collaborators object with the current user's UID and email
            let collaboratorsObj = { [this.uid]: this.email }; // Use let so we can modify the object

            // Function to sanitize email by replacing '@' with '_' and other potential issues
            const sanitizeEmail = (email) => {
                // You can add more sanitization if needed (like removing dots or other special chars)
                return email.replace(/[@.]/g, '_'); // Replaces '@' and '.' with '_'
            };

            // Add the typed email as a key-value pair if it's provided and it's not the current user's email
            if (this.formData.typedEmail && this.formData.typedEmail !== this.email) {
                collaboratorsObj[sanitizeEmail(this.formData.typedEmail)] = this.formData.typedEmail;
            }

            // Add each collaborator email to the object if it's not the current user's email
            collaboratorsArray.forEach(email => {
                if (email && email !== this.email) {
                    collaboratorsObj[sanitizeEmail(email)] = email; // Add sanitized email as key-value pair
                }
            });

            console.log(collaboratorsObj, "Collaborators Object");

            // Transform events object into an array of objects with "time" and "eventID"
            const eventsArray = Object.keys(this.formData.events).map(hour => ({
                time: hour,
                eventID: this.formData.events[hour],
            }));

            // Update formData to include the collaborators object and events array
            const dataToSubmit = {
                ...this.formData,
                budget: Number(this.formData.budget),
                collaborators: collaboratorsObj, // Save the sanitized key-value object of emails
                events: eventsArray, // Replace events object with eventsArray
            };
            console.log(dataToSubmit);

            try {
                const response = await ItineraryService.postItinerary(dataToSubmit);
                console.log('Itinerary successfully added:', response);

                // Redirect to the itinerary details page using the ID from the response
                this.$router.push(`/ItineraryDetails/${response.id}`); // Use the appropriate key for ID in the response
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
                acc[hour] = ''; // Set default value for each hour
                return acc;
            }, {});
        },
        resetForm() {
            this.formData = {
                title: '',
                budget: null,
                totalCost: null,
                date: '',
                collaborators: '', // Reset to empty string
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

h2 {
    font-size: 1.8rem;
    color: #333;
    font-weight: bold;
    margin-bottom: 1rem;
}

.form-label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #555;
}

.form-control {
    border-radius: 5px;
    border: 1px solid #ced4da;
    padding: 0.75rem;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    border-color: #7a5c85; /* Accent color */
    box-shadow: 0 0 0 0.2rem rgba(122, 92, 133, 0.25); /* Light shadow on focus */
}

.container {
    max-width: 500px;
    margin: 0 auto; /* Center container on the page */
    padding: 20px;
}

.shadow {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for a modern look */
    border-radius: 8px; /* Rounded corners */
}

.btn {
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.back{
    font-weight: bold;
    color: #fff;
    background-color: #000; 
    padding: 8px 16px; 
    margin-right: 20px;
}

.back:hover {
    background-color: #333;
    transform: scale(1.05); /* Slight scale on hover */
}

.create {
    font-weight: bold;
    color: #fff;
    background-color: #7a5c85; 
    padding: 8px 16px; 
}

.create:hover {
    background-color: #5a3e64;
    transform: scale(1.05); /* Slight scale on hover */
}

.hover-effect {
    transition: transform 0.2s ease;
}

.hover-effect:hover {
    transform: translateY(-5px); /* Slight lift on hover */
}

p {
    color: #777;
    font-size: 1rem;
    text-align: center;
    margin-top: 2rem;
}

.placeholder {
    color: #aaa;
    font-style: italic;
}

</style>
