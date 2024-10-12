<template>
    <div class="homepage">
      <h1>Upcoming Attractions</h1>
      <div class="attraction-container" v-if="attractions.length">
        <div class="attraction" v-for="attraction in attractions" :key="attraction.id"
             @click="goToAttractionDetails(attraction.id)" style="cursor: pointer;">
          <h2>{{ attraction.name }}</h2>
          <p>Type: {{ attraction.type }}</p>
          <p>Genre: {{ attraction.classifications[0].genre.name}}</p>
        </div>
      </div>
      <p v-else>No attractions available.</p>
    </div>
  </template>
  
  <script>
  import attractionService from '../services/attractionService'; // Update the import statement if the service is renamed
  
  export default {
    name: 'attractionList',
    data() {
      return {
        attractions: [], // Initialize attractions as an empty array
      };
    },
  
    async mounted() {
      try {
        this.attractions = await attractionService.displayAttractions(); // Fetch attractions from the service
        console.log(this.attractions);
      } catch (error) {
        console.error("Failed to fetch attractions:", error);
      }
    },
  
    methods: {
      goToAttractionDetails(id) {
        // Use Vue Router's 'push' method to navigate to AttractionDetails page
        // name follows what is declare in the router {name:}
        this.$router.push({ name: 'AttractionDetails', params: { id } });
      },
    },
  };
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
  </style>
  