// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')



import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from './firebase/firebaseClientConfig'; // Adjust the path to your Firebase config
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth function

let app;

onAuthStateChanged(auth, (user) => {
  // This function runs whenever the authentication state changes
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }

  // You can add console logs here to check user state
  console.log('User state changed:', user ? 'Logged in' : 'Logged out');
});
