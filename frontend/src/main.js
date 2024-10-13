import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index'; // Import the router
import vue3GoogleLogin from 'vue3-google-login'; // Import Google login plugin

const app = createApp(App);

// Function to fetch the Google Client ID from the backend
async function fetchGoogleClientId() {
    try {
        const response = await fetch(
            'http://localhost:8000/api/google-client-id'
        ); // Your backend URL
        const data = await response.json();
        return data.clientId;
    } catch (error) {
        console.error('Error fetching Google Client ID:', error);
        return null; // Handle the case where the clientId can't be fetched
    }
}

// Fetch the clientId, then initialize the Google login plugin
fetchGoogleClientId().then((clientId) => {
    if (clientId) {
        app.use(vue3GoogleLogin, {
            clientId: clientId,
            scope: 'openid profile email https://www.googleapis.com/auth/calendar',
            prompt: 'consent',
            // Callback when login is successful
            onSuccess: (response) => {
                // Save credentials in localStorage or sessionStorage
                localStorage.setItem(
                    'google_access_token',
                    response.access_token
                );
                localStorage.setItem(
                    'google_profile',
                    JSON.stringify(response.profileObj)
                );

                // Redirect to the new page (e.g., Dashboard)
                router.push({ name: 'userDashboard' });
            },
            onFailure: (error) => {
                console.error('Google login failed', error);
            },
        });
    } else {
        console.error('Google Client ID not available.');
    }

    // Use the router for route management
    app.use(router);

    // Mount the Vue app
    app.mount('#app');
});
