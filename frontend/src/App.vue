  <!-- <template>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </template>

<script>
  import HelloWorld from './components/HelloWorld.vue'

  export default {
    name: 'App',
    components: {
      HelloWorld
    }
  }
  </script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  </style> -->




<template>
  <div id="app">
    <img style="display: block; margin: 0 auto; width: 30%; height: 50%;" alt="logo" src="./assets/tabiLog_logo.png" />

    <NavigationBar /> <!-- Add the NavigationBar component here -->
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <router-view />
  </div>
</template>

<script>
import NavigationBar from './components/naviBar.vue'; // Adjust the path as needed

export default {
  name: 'App',
  components: {
    NavigationBar, // Register the NavigationBar component
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



