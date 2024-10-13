<template>
    <div class="container vh-100 d-flex justify-content-center align-items-center">
        <div class="row justify-content-center">
            <div class="col-md-12 text-center">
                <!-- Attraction Details -->
                <h1 v-if="attractionDetails.name">{{ attractionDetails.name }}</h1>
                <!-- <p v-if="attractionDetails.type">Type: {{ attractionDetails.type }}</p> -->
                <p v-if="attractionDetails.classifications?.[0]?.genre?.name">Genre: {{
                    attractionDetails.classifications[0].genre.name }}</p>
                <hr />
                <!-- <h3>Sales:</h3>
                <p v-if="attractionDetails.sales?.public?.startDateTime">Start date: {{ attractionDetails.sales.public.startDateTime }}</p>
                <p v-if="attractionDetails.sales?.public?.endDateTime">End date: {{ attractionDetails.sales.public.endDateTime }}</p>
                <p v-if="attractionDetails.priceRanges">
                    Price range:
                    {{
                        `${attractionDetails.priceRanges[0].min || 'N/A'} to ${attractionDetails.priceRanges[0].max || 'N/A'} ${attractionDetails.priceRanges[0].currency || ''}`
                    }}
                </p> -->


            </div>
        </div>

    </div>
</template>

<script>
import attractionService from "../services/attractionService"; // Update to your attraction service
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap'; // Import Bootstrap JS

export default {
    data() {
        return {
            attractionDetails: {}, // Initialize as an empty object
        };
    },
    created() {
        // Fetch attraction details immediately upon creation
        this.fetchAttractionDetails();
    },
    methods: {
        async fetchAttractionDetails() {
            const id = this.$route.params.id; // Get the id from the route parameters
            try {
                this.attractionDetails = await attractionService.goToAttractionDetails(id); // Fetch attraction details
            } catch (error) {
                console.error("Failed to fetch attraction details:", error);
            }
        },
    },
};
</script>

<style>
.aligned {
    text-align: center;
}
</style>
