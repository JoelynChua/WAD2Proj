// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')



import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';


import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap'; // Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.js'

createApp(App)
  .use(router)
  .mount('#app');
