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
                <input type="number" class="form-control" id="budget" v-model.number="formData.budget" required />
            </div>

            <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <input type="date" class="form-control" id="date" v-model="formData.date" required />
            </div>

            <div class="mb-3">
                <label for="collaborators" class="form-label">Collaborators</label>
                <input type="text" class="form-control" id="collaborators" v-model="formData.collaborators"
                    placeholder="Comma-separated names" required />
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
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>



<script>
import ItineraryService from '../services/itineraryService';

export default {
    data() {
        return {
            formData: {
                title: '',
                budget: null,
                totalCost: null,
                date: '',
                collaborators: '',
                events: {}, // Initialize as an empty object
            },
            hours: [],  // Initialize empty and populate in created hook
        };
    },
    created() {
        this.hours = this.generateHours(); // Generate the hour slots
        this.formData.events = this.initializeTimetable(); // Initialize events after hours is populated
    },

    methods: {
        async handleSubmit() {
            console.log(this.formData);

            // Transform events object into an array of objects with "time" and "eventID"
            const eventsArray = Object.keys(this.formData.events).map(hour => ({
                time: hour,
                eventID: this.formData.events[hour],
            }));

            // Update formData to include the new eventsArray structure
            const dataToSubmit = {
                ...this.formData,
                events: eventsArray, // Replace events object with eventsArray
            };
            console.log(dataToSubmit);
            try {
                console.log("enter")
                const response = await ItineraryService.postItinerary(dataToSubmit);
                console.log('Itinerary successfully added:', response);
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
                collaborators: '',
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
