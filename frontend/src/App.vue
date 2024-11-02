<template>
    <div id="app">
        <!-- Logo centered on the page -->
        <a href="/">
            <img
                style="display: none; margin: 0 auto; width: 30%; height: auto"
                alt="logo"
                src="./assets/tabiLog_logo_noBackground.png"
            />
        </a>
        <!-- Collapsible Navigation Bar -->
        <collapsible-navibar v-if="!fullPageRoutes.includes($route.path)" />

        <div
            id="navbuffer"
            style="height: 120px"
            v-if="
                !fullPageRoutes.includes($route.path) &&
                !noBuffer.includes($route.path)
            "
        ></div>
        <!-- Sticky Navbar Buffer -->

        <!-- Router View for Dynamic Content -->
        <router-view />
        <!-- <GoogleLogin :callback="callback" prompt /> -->
         <div id="footerbuffer" v-if="!fullPageRoutes.includes($route.path) && !noBuffer.includes($route.path)"></div>

        <!-- Footer Component -->
        <AppFooter v-if="!fullPageRoutes.includes($route.path)" />
    </div>
</template>

<script>
// Import collapsibleNavibar component
import collapsibleNavibar from './components/naviBar.vue'; // Adjust the path if necessary
import AppFooter from './components/AppFooter.vue'; // Import the Footer component

export default {
    data() {
        return {
            fullPageRoutes: ['/login-for-users', '/signup', '/login-for-organisers'],
            noBuffer: ['/'],
        };
    },
    name: 'App',
    components: {
        collapsibleNavibar, // Register the NavigationBar component
        AppFooter, // Register the Footer component
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
    font-family: 'TT Commons', 'HelveticaNeueLTStd-Roman', 'Helvetica', 'Arial',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0;
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
