import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index'; // Import the router
// import { createPinia } from 'pinia';
import vue3GoogleLogin from 'vue3-google-login';
import { getGoogleClientId } from './services/getGoogleClientId';

const app = createApp(App);

// Use the router for route management
// app.use(router);

// app.use(createPinia());

// app.use(vue3GoogleLogin, {
//     clientId:
//         '281323249244-aiubdghlhqq6f39t97oo4qcnjucjl62b.apps.googleusercontent.com', // TODO: Remember to change to your client id
// });

// // app.use(getGoogleClientId);

// // Mount the Vue app
// app.mount('#app');

getGoogleClientId().then((clientId) => {
    app.use(vue3GoogleLogin, {
        clientId: clientId,
    });

    // Mount the app only after the Google Login plugin has been initialized
    app.use(router);
    app.mount('#app');
});
