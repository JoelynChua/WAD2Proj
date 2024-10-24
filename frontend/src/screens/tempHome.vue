<template>
    <div id="app">
      <main>
        <section class="hero zoom-in">
          <h2 class="slide-right">Find Your Next Adventure</h2>
          <p class="slide-left">Discover and book exciting activities in your area.</p>
          <button @click="findActivities" class="pulse">Find Activities</button>
        </section>
        <section class="featured-activities">
          <h2 class="fade-in">Featured Activities</h2>
          <ul>
            <li v-for="activity in activities" :key="activity.id" class="card">
              <h3>{{ activity.name }}</h3>
              <p>{{ activity.description }}</p>
            </li>
          </ul>
        </section>
      </main>
      <footer>
        <p class="fade-in">&copy; 2024 Activity Finder</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activities: [
          { id: 1, name: 'Hiking', description: 'Explore scenic trails and enjoy nature.' },
          { id: 2, name: 'Cooking Class', description: 'Learn new recipes and culinary techniques.' },
          { id: 3, name: 'Art Workshop', description: 'Get creative with various art projects.' }
        ]
      };
    },
    methods: {
      findActivities() {
        // Add logic to find activities
        alert('Finding activities...');
      }
    }
  };
  </script>
  
  <style scoped>
  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes slide-right {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
  }
  
  @keyframes slide-left {
    0% { transform: translateX(100%); }
    100% { transform: translateX(0); }
  }
  
  @keyframes zoom-in {
    0% { transform: scale(0.5); }
    100% { transform: scale(1); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  #app {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    background: #f5f5f5;
    padding: 2rem;
    color: #333;
  }
  
  header {
    background: #222;
    color: #fff;
    padding: 1.5rem;
    animation: fade-in 2s ease-in-out;
  }
  
  .hero {
    background: linear-gradient(90deg, #667eea, #764ba2);
    color: white;
    padding: 3rem 1.5rem;
    border-radius: 8px;
    animation: zoom-in 1s ease-in-out;
    margin-bottom: 2rem;
  }
  
  .hero h2 {
    animation: slide-right 1s ease-in-out;
  }
  
  .hero p {
    animation: slide-left 1s ease-in-out;
  }
  
  .hero button {
    animation: pulse 2s infinite;
    background: #fff;
    color: #667eea;
    border: none;
    padding: 1rem 2rem;
    cursor: pointer;
    border-radius: 4px;
    font-size: 1.2rem;
  }
  
  .featured-activities {
    margin-top: 2rem;
  }
  
  .featured-activities h2 {
    animation: fade-in 2s ease-in-out;
  }
  
  .featured-activities ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .featured-activities ul li {
    background: white;
    margin: 0.5rem;
    padding: 1.5rem;
    animation: bounce 2s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    flex: 1 1 calc(33.333% - 1rem);
  }
  
  footer {
    background: #222;
    color: white;
    padding: 1.5rem;
    animation: fade-in 2s ease-in-out;
    margin-top: 2rem;
  }
  </style>
  