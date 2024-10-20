import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from './firebase/firebaseClientConfig'; // Adjust the path to your Firebase config
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth function
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import vue3GoogleLogin from 'vue3-google-login';
import { getGoogleClientId } from './services/getGoogleClientId';
import vueCountryRegionSelect from 'vue3-country-region-select'

let app;

onAuthStateChanged(auth, (user) => {
    // This function runs whenever the authentication state changes
    if (!app) {
        app = createApp(App);

        app.use(Antd);
        app.use(vueCountryRegionSelect);

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
