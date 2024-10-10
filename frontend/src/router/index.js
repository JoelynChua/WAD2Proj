import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../screens/homePage.vue';
import Signup from '../screens/NewUser.vue';
import LoginPage from '../screens/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
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
