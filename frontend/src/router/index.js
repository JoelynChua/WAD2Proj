import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../screens/homePage.vue';
import UserDashboard from '../screens/userDashboard.vue';   
import EventDetails from '../screens/eventDetails.vue';
import AttractionsList from '../screens/attractionsList.vue';
import AttractionDetails from '../screens/attractionDetails.vue';
import Signup from '../screens/NewUser.vue';
import LoginPage from '../screens/LoginPage.vue';
import ExpensePage from '../screens/ExpensePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/userdashboard', // The new page where the user will be redirected after login
    name: 'userDashboard',
    component: UserDashboard, // Your dashboard component
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
  },
  {
    path: '/ExpensePage',
    name: 'ExpensePage',
    component: ExpensePage,
  }
  // You can add more routes here
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
