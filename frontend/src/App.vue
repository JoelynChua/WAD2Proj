<template>
    <div id="app" class="app-container">  
      <!-- Collapsible Navigation Bar -->
      <collapsible-navibar v-if="!fullPageRoutes.includes($route.path)" />
  
      <div
        id="navbuffer"
        style="height: 100px"
        v-if="!fullPageRoutes.includes($route.path) && !noBuffer.includes($route.path)"
      ></div>
  
      <div class="content-wrapper">
        <router-view />
      </div>
      
      <div id="footerbuffer" v-if="!fullPageRoutes.includes($route.path) && !noBuffer.includes($route.path)"></div>
  
      <!-- Footer Component -->
      <AppFooter id="#AppFooter" v-if="!fullPageRoutes.includes($route.path)" />
    </div>
  </template>

<script>
import collapsibleNavibar from './components/naviBar.vue';
import AppFooter from './components/AppFooter.vue'; 

export default {
    data() {
        return {
            fullPageRoutes: ['/login-for-users', '/signup', '/login-for-organisers'],
            noBuffer: ['/', "/organizers", "/events", "/attractionsList"],
        };
    },
    name: 'App',
    components: {
        collapsibleNavibar, 
        AppFooter, 
    },
};
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.content-wrapper {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
}

#footerbuffer {
  flex-grow: 1; 
}

.AppFooter {
  margin-top: auto; 
}

#app {
    font-family: 'TT Commons', 'HelveticaNeueLTStd-Roman', 'Helvetica', 'Arial',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0;
}

.content-wrapper {
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
}

#footerbuffer {
    z-index: -50;
    height: 100px
}

@import 'bootstrap/dist/css/bootstrap.min.css';
@import '../node_modules/@flaticon/flaticon-uicons/css/thin/straight.css';
@import '../node_modules/@flaticon/flaticon-uicons/css/thin/straight.css';


@font-face {
    font-family: 'graphie';
    src: url('./assets/font/Graphie-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
}
</style>
