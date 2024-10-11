import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../screens/homePage.vue';
import EventDetails from '../screens/eventDetails.vue';
import AttractionsList from '../screens/attractionsList.vue';
import AttractionDetails from '../screens/attractionDetails.vue';
import Signup from '../screens/NewUser.vue';
import LoginPage from '../screens/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/eventDetails/:id',
    name: 'EventDetails',
    component: EventDetails,
  },
  {
    path: '/attractionsList',
    name: 'AttractionsList',
    component: AttractionsList,
  },
  {
    path: '/attractionDetails/:id',
    name: 'AttractionDetails',
    component: AttractionDetails,
  },
  {
    path: '/signup',
    name: 'NewUser',
    component: Signup,
  },
  {
    path: '/loginpage',
    name: 'LoginPage',
    component: LoginPage,
  }
  // You can add more routes here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
