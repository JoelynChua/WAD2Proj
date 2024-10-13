import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../screens/homePage.vue';
import UserDashboard from '../screens/userDashboard.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    // You can add more routes here
    {
        path: '/userdashboard', // The new page where the user will be redirected after login
        name: 'userDashboard',
        component: UserDashboard, // Your dashboard component
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
