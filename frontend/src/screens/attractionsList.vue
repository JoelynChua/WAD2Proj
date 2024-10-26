<template>
  <div class="homepage">
    <h1>Upcoming Attractions</h1>
    <div class="attraction-container" v-if="attractions.length">
      <div class="attraction" v-for="attraction in attractions" :key="attraction.id"
        @click="goToAttractionDetails(attraction.id)" style="cursor: pointer; position: relative;">
        <!-- Bookmark Icon Positioned in the Top Right -->
        <font-awesome-icon :icon="isBookmarked(attraction.id) ? ['fas', 'bookmark'] : ['far', 'bookmark']"
          class="bookmark-icon" @click.stop="toggleWishlist(attraction.id)" />
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
import { getAuth} from 'firebase/auth';


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

  async mounted() {
    try {
      // Fetch attractions first
      this.attractions = await attractionService.displayAttractions();
      console.log(this.attractions);

      this.authListener();
    }

    catch (error) {
      console.error("Failed to fetch attractions or wishlists:", error);
    }


  },

  methods: {
    goToAttractionDetails(id) {
      this.$router.push({ name: 'AttractionDetails', params: { id } });
    },

    isBookmarked(attractionID) {
      return this.wishlists.some(wishlist => wishlist.attractionID === attractionID);
    },

    authListener() {
      const auth = getAuth(); // Initialize Firebase auth here
      // Listen to the authentication state
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          // User is signed in
          this.userID = user.uid; // Get the user ID
          try {
            // Fetch itineraries using the UID
            this.itineraries = await itineraryService.getItineraryByUserID(this.userID);
            console.log(this.itineraries);
            await this.reloadWishlists(); // Reload wishlists after fetching itineraries
          } catch (error) {
            console.error("Failed to fetch itineraries:", error);
          }
        } else {
          // User is signed out
          console.log('User is signed out');
          // Optionally redirect to login page or handle sign-out logic here
          this.$router.push('/login');
        }
      });
    },


    async reloadWishlists() {
      try {
        if (this.userID) {
          this.wishlists = await itineraryService.getUserWishlist(this.userID); // Fetch updated wishlists
        }
      } catch (error) {
        console.error("Failed to reload wishlists:", error);
      }
    },

    async toggleWishlist(attractionID) {
      const existingWishlist = this.wishlists.find(wishlist => wishlist.attractionID === attractionID);
      const wishlistID = existingWishlist ? existingWishlist.id : null; // Safely access id

      console.log("Existing Wishlist:", existingWishlist); // Log existing wishlist
      console.log("Wishlist ID:", wishlistID); // Log the wishlist ID

      const newWishlist = {
        userID: this.userID,
        attractionID,
      };

      try {
        if (!wishlistID) {
          // If not found, add to wishlist
          await itineraryService.addWishlist(newWishlist);
          console.log("Wishlist added:", newWishlist);
          // Update wishlists array
          this.wishlists.push({ ...newWishlist, id: newWishlist.id }); // Assuming the response has the new ID
        } else {
          // If found, delete from wishlist
          await itineraryService.deleteWishlist(wishlistID);
          console.log("Wishlist deleted:", wishlistID);
          // Update wishlists by removing the deleted one
          this.wishlists = this.wishlists.filter(wishlist => wishlist.id !== wishlistID);
        }

        // Reload the wishlists after adding or deleting
        await this.reloadWishlists();
      } catch (error) {
        console.error("Failed to update wishlist:", error);
      }
    }
  },
}
</script>

<style>
.attractionList {
  text-align: center;
  padding: 20px;
}

.attraction-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.attraction {
  border: 1px solid #2c3e50;
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  width: 80%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.attraction:hover {
  transform: scale(1.02);
}

h2 {
  color: #2c3e50;
}

p {
  color: #555;
}

.bookmark-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #2c3e50;
}
</style>
