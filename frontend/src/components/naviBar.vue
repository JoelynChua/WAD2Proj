<template>
    <nav
        class="navbar navbar-expand-lg navbar-light"
        :class="{
            sticky: isSticky,
            'navbar-small': isSmall,
            hidden: isHidden,
        }"
        style="background-color: white"
    >
        <div class="container-fluid">
            <div
                class="d-flex align-items-center w-100 w-lg-auto"
                :class="{ 'custom-max-width': isLargeScreen }"
            >
                <RouterLink class="navbar-brand" to="/">
                    <img width="180px" src="../assets/activity.ai.png" />
                </RouterLink>

                <div class="ms-auto">
                    <button
                        class="navbar-toggler me-2"
                        type="button"
                        :class="{ 'navbar-icon-small': isSmall }"
                        style="z-index: 1050"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-label="Toggle navigation"
                    >
                        <span
                            class="navbar-toggler-icon"
                            :class="{ 'navbar-button-small': isSmall }"
                        ></span>
                    </button>
                </div>
            </div>

            <div
                class="collapse navbar-collapse"
                :class="{ hiddencollapse: isHidden }"
                id="navbarNav"
                style="background-color: white"
            >
                <ul class="navbar-nav mx-auto">
                    <!-- Center the nav items -->
                    <li class="nav-item">
                        <RouterLink
                            class="nav-link"
                            :class="{ active: $route.path === '/events' }"
                            aria-current="page"
                            to="/events"
                            >events</RouterLink
                        >
                    </li>
                    <li class="nav-item">
                        <RouterLink
                            class="nav-link"
                            :class="{ active: $route.path === '/attractionsList' }"
                            to="/attractionsList"
                            >attractions</RouterLink
                        >
                    </li>
                    <li class="nav-item">
                        <RouterLink
                            class="nav-link"
                            :class="{ active: $route.path === '/itineraryList' }"
                            to="/itineraryList"
                            >itinerary</RouterLink
                        >
                    </li>
                    <li class="nav-item">
                        <RouterLink
                            class="nav-link"
                            :class="{ active: $route.path === '/ExpensePage' }"
                            to="/ExpensePage"
                            >expense</RouterLink
                        >
                    </li>
                    <li class="nav-item" v-if="isOrganiser">
                        <RouterLink
                            class="nav-link"
                            :class="{ active: $route.path === '/calendar' }"
                            to="/calendar"
                            >calendar</RouterLink
                        >
                    </li>
                </ul>

                <ul class="navbar-nav">
                    <!-- Separate nav for Profile and Log In / Sign Up -->
                    <li id="last-item" class="nav-item" v-if="!isAuthenticated">
                        <RouterLink class="nav-link mt-3 mb-3" to="/login">login / sign up</RouterLink>
                    </li>
                    <li class="nav-item dropdown" v-else>
                        <a
                            class="nav-link dropdown-toggle mt-3 mb-3"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                src="../assets/user-icon.png"
                                alt="User Icon"
                                width="30"
                                height="30"
                                class="rounded-circle"
                            />
                            <!-- User icon -->
                        </a>
                        <ul
                            class="dropdown-menu dropdown-menu-end mb-3"
                            :class="{ hidden: isHidden }"
                            aria-labelledby="navbarDropdown"
                        >
                            <li>
                                <RouterLink
                                    class="dropdown-item"
                                    to="/dashboard"
                                    >Profile</RouterLink
                                >
                                <!-- Link to profile -->
                            </li>
                            <li>
                                <a
                                    class="dropdown-item"
                                    href="#"
                                    @click.prevent="signOut"
                                    >Sign Out</a
                                >
                                <!-- Sign out link -->
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { auth } from '../firebase/firebaseClientConfig'; // Adjust the path to your Firebase config
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // Import Firebase Auth methods
import EventBus from '../utils/eventBus.js';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    name: 'navbarNav',
    data() {
        return {
            isAuthenticated: false, // Track authentication state
            isOrganiser: computed(() => sessionStorage.getItem('userType') === 'organiser'),
            isSticky: true, // Track if the navbar should be sticky
            isSmall: false, // Track if the navbar is small
            isHidden: false, // Track if the navbar should be hidden
            lastScrollY: 0, // Store the last scroll position
            stickyTop: 0, // Store the offset top of the navbar
            scrollThreshold: 750, // Threshold for hiding the navbar
        };
    },
    setup() {
        const isLargeScreen = ref(false);

        const updateScreenSize = () => {
            isLargeScreen.value = window.innerWidth >= 992; // 'lg' breakpoint in Bootstrap
        };

        onMounted(() => {
            updateScreenSize();
            window.addEventListener('resize', updateScreenSize);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', updateScreenSize);
        });

        return {
            isLargeScreen,
        };
    },
    created() {
        // Check authentication state on component creation
        onAuthStateChanged(auth, (user) => {
            this.isAuthenticated = !!user; // Update isAuthenticated based on user state
        });
    },
    mounted() {
        // Set the initial sticky position
        this.stickyTop = this.$el.offsetTop;

        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        // Clean up the scroll event listener when the component is destroyed
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            const scrollY = window.scrollY;

            // Check if the scroll position has reached the navbar's position
            this.isSticky = scrollY >= this.stickyTop;
            this.isSmall = scrollY > 200; // Adjust threshold for small navbar

            // Only hide the navbar if the user has scrolled down past the threshold
            if (scrollY > this.scrollThreshold) {
                if (scrollY > this.lastScrollY) {
                    // Scrolling down
                    this.isHidden = true;
                } else {
                    // Scrolling up
                    this.isHidden = false;
                }
            } else {
                // If not past the threshold, ensure the navbar is visible
                this.isHidden = false;
            }

            // Update lastScrollY
            this.lastScrollY = scrollY;
        },
        async signOut() {
            try {
                if (EventBus) {
                    EventBus.emit('google-oauth2-sign-out');
                    console.log('Sign out event emitted.');
                }
                await firebaseSignOut(auth); // Sign out from Firebase
                this.isAuthenticated = false; // Update local state
                this.$router.push('/'); // Redirect to home or desired page
            } catch (error) {
                console.error('Error signing out:', error.message);
            }
        },

        updateNavbarBasedOnRoute(path) {
            // Add logic to update the navbar based on the current path
            if (path === '/') {
                console.log('Navigated to ExpensePage');
                // Add specific logic if needed
            }
        },
    },
};
</script>

<style scoped>
/* Existing nav-link styles */
.nav-link {
    font-weight: 600;
    font-family: graphie, sans-serif;
    font-size: 1.1rem; /* Slightly larger font size for better visibility */
    font-style: normal;
    position: relative;
    display: inline-block;
    overflow: hidden;
    padding: 0.75rem 0px !important; /* Adjusted padding for bigger space between items */
    margin: 0px 1.5rem;
    padding-bottom: 0px !important;

#last-item {
    margin-bottom: 30px;
}
}

/* Add a pseudo-element that slides in from the left */
.nav-link::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -100%; /* Start off-screen (left) */
    width: 100%;
    height: 2px; /* Line thickness */
    background-color: #0056b3; /* Highlight color */
    transition: left 0.4s ease-in-out; /* Transition for smooth slide */
}

/* When hovering over the nav link, slide in the ::before element */
.nav-link:hover::before {
    left: 0; /* Slide it into view */
}

/* Active link styling */
.nav-link.active {
    font-weight: bold;
    color: #0056b3 !important;
    font-size: 1.2rem; /* Make the active link font size slightly larger */
}

/* When the active link is hovered, make sure the line also slides */
.nav-link.active:hover::before {
    left: 0;
}

.nav-item.dropdown .nav-link {
    text-decoration: none; /* Ensure no underline */
}

/* Remove the underline effect for dropdown links */
.nav-item.dropdown .nav-link::before {
    display: none; /* Prevent the underline from appearing */
}

.navbar {
    transition: all 0.3s ease;
    height: 130px; /* Adjusted height */
    padding: 1.25rem 2rem; /* Adjusted padding for a larger initial size */
    opacity: 0.9;
}

.navbar-nav {
    display: flex;
    justify-content: center; /* Centers the nav items */
    align-items: center; /* Aligns them vertically */
    gap: 1.5rem; /* Adds spacing between nav items */
}

.sticky {
    position: fixed;
    /* Fix the navbar when sticky */
    top: 0;
    /* Position it at the top */
    left: 0;
    /* Align left */
    right: 0;
    /* Align right */
    z-index: 1000;
    /* Ensure it stays on top of other content */
}

.navbar-small {
    height: 90px; /* Slightly larger height when scrolled down */
    padding: 0.75rem 1.5rem; /* Adjusted padding for the smaller navbar */
    font-size: 1rem; /* Slightly larger font size for nav links when scrolled */
}

.navbar-icon-small {
    padding: 5px;
    transition: all 0.3s ease;
    /* Add smooth transition to all properties */
}

.navbar-button-small {
    height: 22px;
    width: 22px;
    transition: all 0.3s ease;
    /* Add smooth transition to all properties */
}

.hidden {
    transform: translateY(-100%);
    /* Slide up to hide */
    transition: transform 0.3s ease;
    /* Smooth transition for the hidden state */
}

.hiddencollapse {
    transform: translateY(-100%);
    /* Slide up to hide */
    transition: transform 0.9s ease;
    /* Smooth transition for the hidden state */
}

.navbar-small .navbar-brand {
    font-size: 1.25rem;
    /* Smaller brand text */
}

.navbar-small .nav-link {
    padding: 0.5rem 1rem;
    /* Smaller padding for nav links */
}

.nav-link.active {
    /* Example: Change the color of the active link */
    font-weight: bold;
    color: #0056b3 !important;
    font-size: large;
}

/* Slide-up animation */
@keyframes slideUp {
    0% {
        opacity: 0;
        transform: translateY(30px); /* Start slightly below the navbar */
    }
    100% {
        opacity: 1;
        transform: translateY(0); /* End at the final position */
    }
}

/* Slide-up animation for navbar items */
@keyframes slideUp {
    0% {
        opacity: 0;
        transform: translateY(30px); /* Start slightly below the navbar */
    }
    100% {
        opacity: 1;
        transform: translateY(0); /* End at the final position */
    }
}

/* Apply the animation to the navbar brand (logo) */
.navbar-brand img {
    opacity: 0; /* Initially hidden */
    animation: slideUp 0.6s ease forwards;
    animation-delay: 0.2s; /* Delay for the logo */
}

/* Apply animation to navbar items */
.nav-item {
    opacity: 0; /* Initially hidden */
    animation: slideUp 0.6s ease forwards;
}

/* Create staggered effect for each nav item */
.nav-item:nth-child(1) {
    animation-delay: 0.3s; /* First item starts after the logo */
}

.nav-item:nth-child(2) {
    animation-delay: 0.4s; /* Second item starts slightly later */
}

.nav-item:nth-child(3) {
    animation-delay: 0.5s;
}

.nav-item:nth-child(4) {
    animation-delay: 0.6s;
}

.nav-item:nth-child(5) {
    animation-delay: 0.7s;
}

.nav-item:nth-child(6) {
    animation-delay: 0.8s;
}

/* Ensure animation works in collapsed state (mobile view) */
.collapse.show .nav-item {
    animation-delay: 0s; /* No delay when showing items in the collapsed menu */
}

.custom-max-width {
    max-width: fit-content; /* or specify a specific value like max-width: 300px; */
}
</style>
