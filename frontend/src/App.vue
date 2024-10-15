<template>
  <div id="app">
    <!-- Logo centered on the page -->
    <img
      style="display: block; margin: auto; width: 30%; height: auto;"
      alt="logo"
      src="./assets/tabiLog_logo.png"
    />
    
    <!-- Collapsible Navigation Bar -->
    <collapsible-navibar />
    
    <!-- Router View for Dynamic Content -->
    <router-view />
  </div>
</template>

<script>
// Import collapsibleNavibar component
import collapsibleNavibar from './components/naviBar.vue'; // Adjust the path if necessary

export default {
  name: 'App',
  components: {
    collapsibleNavibar, // Register the NavigationBar component
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}

@import 'bootstrap/dist/css/bootstrap.min.css';
</style>