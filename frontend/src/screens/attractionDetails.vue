<template>
    <div class="container d-flex justify-content-center align-items-center">
        <div class="row justify-content-center">
            <div class="col-md-12 text-center">
                <!-- Attraction Details -->
                <div class="d-flex align-items-start">
                    <img v-if="attractionDetails.images?.length" :src="attractionDetails.images[1].url" class="img-fluid me-3"
                    alt="Attraction Image" style="margin: 30px; width: 500px; height: 300px" />

                    <!-- Ticket Box -->
                    <div class="col-auto ticket-box text-center container-fluid">
                        <p class="ticket-title">Learn More</p>
                        <button class="btn btn-danger get-tickets-btn" @click="openTickets">TicketMaster</button>
                    </div>
                </div>

                

                <h1 v-if="attractionDetails.name">{{ attractionDetails.name }}</h1>
                <p v-if="attractionDetails.type">Type: {{ attractionDetails.type }}</p>
                <p v-if="attractionDetails.classifications?.[0]?.genre?.name">Genre: {{
                    attractionDetails.classifications[0].genre.name }}</p>
                <hr />
                <h3>Socials:</h3>
                <div>
                    <!--rel="noopener noreferrer": protects your site's users against having the site you've linked to potentially hijacking the browser (via rogue JS). -->
                    <a v-if="attractionDetails.externalLinks?.facebook?.length"
                        :href="attractionDetails.externalLinks.facebook[0].url" target="_blank"
                        rel="noopener noreferrer">
                        <font-awesome-icon :icon="['fab', 'facebook']" class="fa-2x"
                            style="margin: 10px; color: #1877F2;" />
                    </a>

                    <a v-if="attractionDetails.externalLinks?.instagram?.length"
                        :href="attractionDetails.externalLinks.instagram[0].url" target="_blank"
                        rel="noopener noreferrer">
                        <font-awesome-icon :icon="['fab', 'instagram']" class="fa-2x instagram"
                            style="margin: 10px; color: #000000" />

                    </a>

                    <a v-if="attractionDetails.externalLinks?.twitter?.length"
                        :href="attractionDetails.externalLinks.twitter[0].url" target="_blank"
                        rel="noopener noreferrer">
                        <font-awesome-icon :icon="['fab', 'x-twitter']" class="fa-2x"
                            style="margin: 10px; color: #000000;" />
                    </a>

                    <a v-if="attractionDetails.externalLinks?.youtube?.length"
                        :href="attractionDetails.externalLinks.youtube[0].url" target="_blank"
                        rel="noopener noreferrer">
                        <font-awesome-icon :icon="['fab', 'youtube']" class="fa-2x"
                            style="margin: 10px; color: #FF0000;" />
                    </a>
                </div>


            </div>
        </div>

    </div>
</template>

<script>
import attractionService from "../services/attractionService"; // Update to your attraction service
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap'; // Import Bootstrap JS
import { library } from '@fortawesome/fontawesome-svg-core'; // FontAwesome core
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Vue component for FontAwesome
import { faFacebook, faInstagram, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'; // Icons

// Add icons to the library
library.add(faFacebook, faInstagram, faXTwitter, faYoutube);


export default {
    components: {
        FontAwesomeIcon, // Register FontAwesome component
    },
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
        openTickets() {
            window.open(this.attractionDetails.url, '_blank');
        },
    },
};
</script>

<style>
.aligned {
    text-align: center;
}

.instagram {
    border-radius: 6px;
    background: #f09433;
    background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    background: -webkit-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f09433', endColorstr='#bc1888', GradientType=1);
}

.ticket-box {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 30px;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Ensure it appears above other content */
}

/* Media query for viewports larger than md */
@media (min-width: 1100px) {
    .ticket-box {
        /* Optional adjustments for larger viewports */
        margin-right: 100px; /* Space between image and ticket box */
        position: fixed; /* Adjusted to use relative positioning */
        right: 0;
    }
}

/* Media query for viewports smaller than md */
@media (max-width: 1100px) {
    .ticket-box {
        width: 100%; /* Cover the full width of the viewport */
        height: auto; /* Height can be auto or a specific value */
        position: fixed; /* Fixed positioning for bottom placement */
        bottom: 0; /* Place it at the bottom of the viewport */
        left: 0; /* Align to the left */
        margin: 0; /* Remove margin to cover full width */
        padding: 20px; /* Add padding if needed */
        box-shadow: none; /* Optional: remove shadow for a flatter design */
    }
}

/* Ensure the container has padding to prevent content overlap */
.container {
    padding-bottom: 150px;
    /* Adjust as needed for fixed ticket box */
}

.ticket-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.get-tickets-btn {
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.get-tickets-btn:hover {
    background-color: #f5a358;
    transform: scale(1.10);
}
</style>
