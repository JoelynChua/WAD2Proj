<template>
    <div id="app">
        <!-- Logo centered on the page -->
        <a href="/">
        <img
            style="display: none; margin: 0 auto; width: 30%; height: auto"
            alt="logo"
            src="./assets/tabiLog_logo.png"
        />
    </a>
        <!-- Collapsible Navigation Bar -->
        <collapsible-navibar />

        <div style="height: 80px;"></div> <!-- Sticky Navbar Buffer -->

        <!-- Router View for Dynamic Content -->
        <router-view />
        <!-- <GoogleLogin :callback="callback" prompt /> -->
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
};
</script>

<!-- <script setup>
import { decodeCredential } from 'vue3-google-login';

const callback = (response) => {
    // This callback will be triggered when the user selects or login to
    // his Google account from the popup
    console.log('Handle the response', response);
    // decodeCredential will retrive the JWT payload from the credential
    const userData = decodeCredential(response.credential);
    console.log('Handle the userData', userData);
};
</script> -->

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
