import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebaseClientConfig'; // Adjust the path to your Firebase config
// import HomePage from '../screens/homePage.vue';
import EventDetails from '../screens/eventDetails.vue';
import AttractionsList from '../screens/attractionsList.vue';
import AttractionDetails from '../screens/attractionDetails.vue';
import itineraryList from '../screens/itineraryList.vue';
import Signup from '../screens/NewUser.vue';
import LoginPage from '../screens/LoginPage.vue';
import ExpensePage from '../screens/ExpensePage.vue';
import ItineraryDetails from '../screens/itineraryDetails.vue';
import ItineraryForm from '../screens/itineraryForm.vue';
import ProfilePage from '../screens/ProfilePage.vue';
import CalendarPage from '../screens/CalendarPage.vue';
import TempHome from '../screens/tempHome.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TempHome,
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
    path: '/signup',
    name: 'NewUser',
    component: Signup,
    meta: { redirectIfAuthenticated: true }, // Redirect if authenticated
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: { redirectIfAuthenticated: true }, // Redirect if authenticated
  },
  {
    path: '/ExpensePage',
    name: 'ExpensePage',
    component: ExpensePage,
  },
  {
    path: '/dashboard',
    name: 'UserDashboard',
    component: ProfilePage,
    meta: { requiresAuth: true }, // Requires authentication
  },
  { path: '/calendar',
    name: 'calendar',
    component: CalendarPage,
  }
  // You can add more routes here
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Navigation guard to protect routes that require authentication and redirect authenticated users
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const redirectIfAuthenticated = to.matched.some(record => record.meta.redirectIfAuthenticated);
  const isAuthenticated = !!auth.currentUser; // Check if the user is authenticated

  console.log('Navigating to:', to.name); // Debugging line
  console.log('Is Authenticated:', isAuthenticated); // Debugging line

  if (requiresAuth && !isAuthenticated) {
    next('/login'); // Redirect to login page if not authenticated
  } else if (redirectIfAuthenticated && isAuthenticated) {
    next('/dashboard'); // Redirect to Profile Page if already authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
