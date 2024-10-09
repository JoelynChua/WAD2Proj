import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../screens/homePage.vue';
import EventDetails from '../screens/eventDetails.vue';
import AttractionsList from '../screens/attractionsList.vue';
import AttractionDetails from '../screens/attractionDetails.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/eventDetails/:id',
    name: 'EventDetails',
    component: EventDetails
  },
  {
    path: '/attractionsList',
    name: 'attractionsList',
    component: AttractionsList
  },
  {
    path: '/attractionDetails/:id',
    name: 'attractionDetails',
    component: AttractionDetails
  },
  // You can add more routes here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
