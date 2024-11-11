import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebaseClientConfig';
import EventDetails from '../screens/eventDetails.vue';
import AttractionsList from '../screens/attractionsList.vue';
import AttractionDetails from '../screens/attractionDetails.vue';
import itineraryList from '../screens/itineraryList.vue';
import Signup from '../screens/NewUser.vue';
import loginpageForUsers from '../screens/loginpageForUsers.vue';
import ExpensePage from '../screens/ExpensePage.vue';
import ItineraryDetails from '../screens/itineraryDetails.vue';
import ItineraryForm from '../screens/itineraryForm.vue';
import ProfilePage from '../screens/ProfilePage.vue';
import CalendarPage from '../screens/CalendarPage.vue';
import HomePage from '../screens/HomePage.vue';
import EventsPage from '../screens/eventsPage.vue';
import AboutUs from '../screens/AboutUs.vue';
import FAQ from '../screens/FAQ.vue';
import PrivacyPolicy from '../screens/PrivacyPolicy.vue';
import WhyUsOrganizers from '../screens/WhyUsOrganizers.vue'
import loginpageForOrganisers from '../screens/loginpageForOrganisers.vue';
import OrganizerDashboard from '../screens/OrganizerDashboard.vue';
import EventStatistics from '@/components/EventStatistics.vue';
import NotFound from '@/components/NotFound.vue';



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
        path: '/itineraryList',
        name: 'itineraryList',
        component: itineraryList,
    },
    {
        path: '/ItineraryDetails/:id',
        name: 'ItineraryDetails',
        component: ItineraryDetails,
    },
    {
        path: '/ItineraryForm',
        name: 'ItineraryForm',
        component: ItineraryForm,
    },
    {
        path: '/organizers',
        name: 'WhyUsOrganizers',
        component: WhyUsOrganizers,
    },
    {
        path: '/signup',
        name: 'NewUser',
        component: Signup,
        meta: { redirectIfAuthenticated: true }, // Redirect if authenticated
    },
    {
        path: '/dashboard/:eventId',
        name: 'EventStatistics',
        component: EventStatistics,
        props: true,
    },
    {
        path: '/login-for-users',
        name: 'loginpageForUsers',
        component: loginpageForUsers,
        meta: { redirectIfAuthenticated: true }, // Redirect if authenticated
    },
    {
        path: '/login-for-organisers',
        name: 'loginpageForOrganisers',
        component: loginpageForOrganisers,
        meta: { redirectIfAuthenticated: true }, // Redirect if authenticated
    },
    {
        path: '/ExpensePage',
        name: 'ExpensePage',
        component: ExpensePage,
        meta: { requiresAuth: true }, // Requires authentication

    },
    {
        path: '/dashboard',
        name: 'UserDashboard',
        component: ProfilePage,
        meta: { requiresAuth: true }, // Requires authentication
    },
    {
        path: '/organizer-dashboard',
        name: 'OrganizerDashboard',
        component: OrganizerDashboard,
        meta: { requiresAuth: true }, // Requires authentication
    },
    { path: '/calendar', name: 'calendar', component: CalendarPage },
    { path: '/events', name: 'events', component: EventsPage },
    { path: '/', component: HomePage },
    { path: '/about-us', component: AboutUs },
    { path: '/faq', component: FAQ },
    { path: '/privacy-policy', component: PrivacyPolicy },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
    // You can add more routes here
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Navigation guard to protect routes that require authentication and redirect authenticated users
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const redirectIfAuthenticated = to.matched.some(
        (record) => record.meta.redirectIfAuthenticated
    );
    const isAuthenticated = !!auth.currentUser;

    if (requiresAuth && !isAuthenticated) {
        next('/login-for-users');
    } else if (redirectIfAuthenticated && isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
