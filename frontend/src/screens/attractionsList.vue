<template>
    <div class="homepage">
        <h1>Upcoming Attractions</h1>
        <div class="attraction-container" v-if="attractions.length">
            <div class="attraction" v-for="attraction in attractions" :key="attraction.id"
                @click="goToAttractionDetails(attraction.id)" style="cursor: pointer; position: relative">
                <!-- Bookmark Icon Positioned in the Top Right -->
                <font-awesome-icon v-if="userID" :icon="isBookmarked(attraction.id)
                    ? ['fas', 'bookmark']
                    : ['far', 'bookmark']
                    " class="bookmark-icon" @click.stop="toggleWishlist(attraction.id)" />
                <h2>{{ attraction.name }}</h2>
                <p>Type: {{ attraction.type }}</p>
                <p>Genre: {{ attraction.classifications[0].genre?.name }}</p>
            </div>
        </div>
        <p v-else>No attractions available.</p>
    </div>
</template>

<script>
import attractionService from '../services/attractionService';
import itineraryService from '../services/itineraryService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { getAuth } from 'firebase/auth';

library.add(faBookmark, farBookmark);

export default {
    name: 'attractionList',
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            attractions: [],
            wishlists: [],
            userID: null,
        };
    },
    async created() {
        try {
            this.attractions = await attractionService.displayAttractions();
            console.log(this.attractions);
        } catch (error) {
            console.error('Failed to fetch attractions:', error);
        }
    },

    mounted() {
        this.authListener(); // Set up the authentication listener
        window.addEventListener('scroll', this.handleScroll);
    },

    methods: {
        goToAttractionDetails(id) {
            this.$router.push({ name: 'AttractionDetails', params: { id } });
        },

        isBookmarked(attractionID) {
            return this.wishlists.some(
                (wishlist) => wishlist.attractionID === attractionID
            );
        },

        authListener() {
            const auth = getAuth();
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
        },

        async reloadWishlists() {
            if (!this.userID) return; // Ensure userID is set
            try {
                const wishlists = await itineraryService.getUserWishlist(this.userID);
                this.wishlists = [...wishlists]; // Spread operator to ensure reactivity
                console.log('Wishlists reloaded:', this.wishlists);
            } catch (error) {
                console.error('Failed to reload wishlists:', error);
            }
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
                    // Add to wishlist and update wishlists array
                    const addedWishlist = await itineraryService.addWishlist(newWishlist);
                    this.wishlists = [...this.wishlists, addedWishlist]; // Spread to update reactivity
                } else {
                    // Delete from wishlist and update wishlists array
                    await itineraryService.deleteWishlist(wishlistID);
                    this.wishlists = this.wishlists.filter(
                        (wishlist) => wishlist.id !== wishlistID
                    );
                }
            } catch (error) {
                console.error('Failed to update wishlist:', error);
            }
        },
    },
};
</script>

<style scoped>
/* Container styling */
.homepage {
    text-align: center;
    padding: 20px;
    background: #f9f9f9;
    color: #2c3e50;
}

.attraction-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    padding: 20px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Card styling */
.attraction {
    position: relative;
    border: 1px solid #d3d3d3;
    border-radius: 10px;
    background-color: #ffffff;
    padding: 20px;
    padding-top: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.1s ease;
    cursor: pointer;
}

.attraction:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Header and text styling */
h1 {
    color: #34495e;
    font-size: 2rem;
    margin-bottom: 20px;
}

h2 {
    color: #34495e;
    font-size: 1.5rem;
    margin-top: 0;
}

p {
    color: #666;
    font-size: 1rem;
    margin: 5px 0;
}

/* Bookmark icon styling */
.bookmark-icon {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 22px;
    color: #34495e;
    transition: color 0.3s ease;
}

.bookmark-icon:hover {
    color: #e74c3c;
}

.bookmark-icon.active {
    color: #34495e;
    /* Active color when bookmarked */
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .attraction {
        width: 90%;
        margin: 10px auto;
    }

    .attraction-container {
        flex-direction: column;
        align-items: center;
    }
}
</style>
