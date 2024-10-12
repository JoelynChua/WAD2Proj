<template>
  <div id="app">
    <img style="display: block; margin: 0 auto; width: 30%; height: 50%;" alt="logo" src="./assets/tabiLog_logo.png" />
    <collapsibleNavibar />
    <router-view />
  </div>
</template>

<script>
import collapsibleNavibar from './components/naviBar.vue'; // Adjust the path as needed

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
  margin-top: 0px;
}
</style>