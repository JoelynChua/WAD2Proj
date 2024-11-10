<template>
    <div>
        <div v-if="loading" class="loading">
            <img class="loading-image" src="../assets/logo.png"/>
            <p>Loading...</p>
        </div>
        <div v-else>
            <div class="row event-hero-wrapper">
                <div class="col-2"></div>
                <div class="col-8 ">
                    <!-- Ticketmaster event image -->
                    <img 
                        :src="attractionDetails.images?.[0]?.url" 
                        class="event-hero-image"
                        alt="Event Image"/>
                </div>
                <div class="col-2"></div>
            </div>

            <div class="event-details">
                <div class="row mt-5">
                    <div class="col-2"></div>
                    <div class="col-6 text-start">
                        <div class="event-title">
                            {{ attractionDetails.name }}
                        </div>
                        <div class="event-container">
                            <div class="event-header">Genre</div>
                            {{ attractionDetails.classifications?.[0]?.segment.name }}, 
                            {{ attractionDetails.classifications?.[0]?.genre.name }} ({{ attractionDetails.classifications?.[0]?.subGenre.name }})
                        </div>

                        <div class="event-container" v-if="attractionDetails.externalLinks?.homepage?.[0]?.url?.length">
                            <div class="event-header">Check Out {{ attractionDetails.name }}'s Website</div>
                            <i class="fi fi-rr-globe"></i>
                            <a :href="attractionDetails.externalLinks?.homepage?.[0]?.url" target="_blank" style="text-decoration: none; font-size: large; margin: 0px 8px; ">{{ attractionDetails.externalLinks?.homepage?.[0]?.url }}</a>
                        </div>
                        <div class="event-container">
                            <div v-if="attractionDetails.externalLinks?.facebook?.length || attractionDetails.externalLinks?.instagram?.length || attractionDetails.externalLinks?.twitter?.length || attractionDetails.externalLinks?.youtube?.length" 
                            class="event-header">Socials</div>
                            <div>
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
                    <div class="col-2" v-if="isCustomer">
                        <div class="fixed-icon-container">
                            <font-awesome-icon v-if="userID"
                                :icon="isBookmarked(attractionDetails.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                                class="bookmark-icon fs-1 mt-5" @click.stop="toggleWishlist(attractionDetails.id)" />
                        </div>
                    </div>
                </div>
            </div>
            <AttractionNaviBar v-if="isCustomer" :event="attractionDetails"></AttractionNaviBar>
        </div>
    </div>
</template>

<script>
import attractionService from "../services/attractionService"; 
import itineraryService from '../services/itineraryService';

import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap'; 
import { library } from '@fortawesome/fontawesome-svg-core'; 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; 
import { faFacebook, faInstagram, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import AttractionNaviBar from "../components/AttractionDetails_navibar.vue"
import { ref as dbRef, getDatabase, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

library.add(faFacebook, faInstagram, faXTwitter, faYoutube);


export default {
    components: {
        FontAwesomeIcon,
        AttractionNaviBar,
    },
    data() {
        return {
            attractionDetails: {}, // Initialize as an empty object
            loading: true,
            isCustomer: false,
            isOrganiserEvent: true,
            wishlists: [],
            userID: null,
        };
    },
    
    async created() {
        await this.checkUserType();
        this.fetchAttractionDetails();
    },
    methods: {
        async checkUserType() {
            const auth = getAuth();
            const user = auth.currentUser;

            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.userID = user.uid;
                    try {
                        await this.reloadWishlists();
                    } catch (error) {
                        console.error('Failed to fetch wishlists:', error);
                    }
                } else {
                    this.userID = null;
                    this.wishlists = [];
                }
            });
            
            if (user) {
                const db = getDatabase();
                const userRef = dbRef(db, `users/${user.uid}`);
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        this.isCustomer = snapshot.val().userType === 'customer';
                    }
                } catch (error) {
                    console.error("Error checking user type:", error);
                }
            }
        },

        isBookmarked(attractionID) {
            // console.log(this.wishlist.eventID)
        
            return this.wishlists.some(
                (wishlist) => wishlist.attractionID === attractionID
            );
        },
        async toggleWishlist(attractionID) {
            const existingWishlist = this.wishlists.find(
                (wishlist) => wishlist.attractionID === attractionID
            );
            const wishlistID = existingWishlist ? existingWishlist.id : null;

            const newWishlist = {
                userID: this.userID,
                attractionID,
            };

            try {
                if (!wishlistID) {
                    // If not bookmarked, add to wishlist
                    const addedWishlist = await itineraryService.addWishlist(newWishlist);
                    this.wishlists = [...this.wishlists, addedWishlist];
                } else {
                    // If already bookmarked, remove from wishlist
                    await itineraryService.deleteWishlist(wishlistID);
                    this.wishlists = this.wishlists.filter(
                        (wishlist) => wishlist.id !== wishlistID
                    );
                }
            } catch (error) {
                console.error('Failed to update wishlist:', error);
            }
        },

        // Reload wishlist items for the user
        async reloadWishlists() {
            if (!this.userID) return;
            try {
                const wishlists = await itineraryService.getUserWishlist(this.userID);
                this.wishlists = [...wishlists];
                console.log('Wishlists reloaded:', this.wishlists);
            } catch (error) {
                console.error('Failed to reload wishlists:', error);
            }
        },
        
        async fetchAttractionDetails() {
            const id = this.$route.params.id; // Get the id from the route parameters
            try {
                this.loading = true;
                this.attractionDetails = await attractionService.goToAttractionDetails(id); // Fetch attraction details
            } catch (error) {
                console.error("Failed to fetch attraction details:", error);
            }
            finally {
                this.loading = false;
            }
        },
    },
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
    max-height: 450px;
    border-radius: 20px;
    overflow: hidden;

}
.event-hero-image {
  width: 100%;
  max-height: 450px;

  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  object-position: center;
}
.event-container {
    margin: 80px 0px;
}
.event-header {
    color: #39364f;
    font-size: 30px;
    font-weight: bold;
}
.event-date {
    font-size: 25px;
}
.event-title {
    margin: 20px 0px;
    color: #39364f;
    text-transform: uppercase;
    font-size: 60px;
    font-weight: 900;
    line-height: 1; 
}

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
