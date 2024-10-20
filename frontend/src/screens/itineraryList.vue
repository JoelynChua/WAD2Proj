<template>
  <div style="margin-top: 30px;" class="itinerary-list">
    <h1>My Itineraries</h1>
    <!-- Add itinerary -->
    <button style="margin-bottom: 20px; display: block;" @click="toItineraryForm()" class="btn btn-primary">
      <span class="plus-sign">+</span>
    </button>

    <div v-if="itineraries.length">
      <div class="carousel-client">
        <div class="slide" v-for="(itinerary, index) in itineraries" :key="index">
          <div class="itinerary-item" @click="getItineraryByID(itinerary.id)">
            <div class="itinerary-title">
              {{ itinerary.title }}
              <br />
              <span class="itinerary-date">{{ itinerary.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Loading itineraries...</div>
  </div>
</template>

<script>
import itineraryService from '../services/itineraryService'; // Adjust the path as needed

export default {
  name: 'itineraryList',
  //Data Function: The data function returns an object where itineraries is initialized as an empty array to store the itineraries fetched from the server.
  //Defining
  data() {
    return {
      itineraries: [], // Initialize itineraries as an empty array
    };
  },

  //Mounted Hook: This is a lifecycle method that runs when the component is first added to the DOM.
  /*Mounted vs created
  created hook: helps with the loading of data before it is displayed on the webpage
  mounted hook: load data with UI
  Created Hook: Focuses on data loading and initialization before the component is rendered. 
  Use it for preparing data that should be available as soon as the component is shown.
  
  Mounted Hook: Focuses on operations related to the UI and DOM after the component is displayed. 
  Use it for tasks that require the component to be present in the DOM.
*/
  async mounted() {
    try {
      //the properties defined in data() are accessible via this, which refers to the component instance.
      this.itineraries = await itineraryService.getItineraryByUserID(sessionStorage.getItem('uid')); // Fetch itineraries from the service
      console.log(this.itineraries);
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
    }
  },
  methods: {
    getItineraryByID(itineraryID) {
      this.$router.push({ name: 'ItineraryDetails', params: { id: itineraryID } }); // Ensure parameter name matches route
    },
    toItineraryForm() {
      this.$router.push({ name: 'ItineraryForm' });
    }
  },
};
</script>

<style scoped>
body {
  background-color: #eee;
}

.itinerary-list h2 {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: 6px;
  color: #000;
  letter-spacing: 0.3px;
  padding: 0;
}

.itinerary-list::after {
  content: "";
  height: 3px;
  background: #fbb900;
  width: 80px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}

.carousel-client {
  display: flex;
  overflow: auto;
  gap: 20px;
  padding: 2em 0em;
}

.slide {
  min-width: 200px;
  transition: transform 0.5s ease;
}

.itinerary-item {
  background-color: #8c8;
  opacity: 0.8;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  cursor: pointer;
}

.itinerary-item:hover {
  transform: scale(1.05);
}

.itinerary-title {
  font-size: 18px;
  color: #fff;
}

.itinerary-date {
  display: block;
  font-size: 16px;
  color: #ddd;
  margin-top: 10px;
}
</style>
