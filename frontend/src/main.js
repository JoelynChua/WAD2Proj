import { createApp} from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from './firebase/firebaseClientConfig'; // Adjust the path to your Firebase config
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth function
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import vue3GoogleLogin from 'vue3-google-login';
import { getGoogleClientId } from './services/getGoogleClientId';
import vueCountryRegionSelect from 'vue3-country-region-select';

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'; // Example icon

// Add icons to the Font Awesome library
library.add(faCoffee);

let app;

onAuthStateChanged(auth, (user) => {
    // This function runs whenever the authentication state changes
    if (!app) {
        app = createApp(App);
        app.use(Antd);
        app.use(vueCountryRegionSelect);

        // Register Font Awesome component globally
        app.component('font-awesome-icon', FontAwesomeIcon);

        getGoogleClientId().then((clientId) => {
            app.use(vue3GoogleLogin, {
                clientId: clientId,
            });

            // Mount the app only after the Google Login plugin has been initialized
            app.use(router);
            app.mount('#app');
        });
    }

    // You can add console logs here to check user state
    console.log('User state changed:', user ? 'Logged in' : 'Logged out');
});
