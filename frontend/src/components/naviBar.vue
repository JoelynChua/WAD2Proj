<template>
    <nav class="navbar navbar-expand-lg navbar-light" :class="{
        sticky: isSticky,
        'navbar-small': isSmall,
        hidden: isHidden,
    }" style="background-color: white">
        <div class="container-fluid">
            <div class="d-flex align-items-center w-100 w-lg-auto" :class="{ 'custom-max-width': isLargeScreen }">
                <RouterLink class="navbar-brand" to="/">
                    <img width="180px" src="../assets/activity.ai.png" />
                </RouterLink>

                <div class="ms-auto">
                    <button class="navbar-toggler me-2" type="button" :class="{ 'navbar-icon-small': isSmall }"
                        style="z-index: 1050" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon" :class="{ 'navbar-button-small': isSmall }"></span>
                    </button>
                </div>
            </div>

            <div class="collapse navbar-collapse" :class="{ hiddencollapse: isHidden }" id="navbarNav"
                style="background-color: white">

                <!-- NAVBAR CONDITIONAL RENDERING -->
                <!-- SEPARATED INDIVIDUAL RENDERING DUE TO V-IF AFFECTING ANIMATION ORDERING -->

                <ul class="navbar-nav mx-auto" v-if="isCustomer">
                    <li class="nav-item">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/events' }" aria-current="page"
                            to="/events">events</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/attractionsList' }"
                            to="/attractionsList">attractions</RouterLink>
                    </li>
                    <li class="nav-item" v-if="isCustomer">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/itineraryList' }"
                            to="/itineraryList">itinerary</RouterLink>
                    </li>
                    <li class="nav-item" v-if="isCustomer">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/ExpensePage' }"
                            to="/ExpensePage">expense</RouterLink>
                    </li>

                </ul>

                <ul class="navbar-nav mx-auto" v-if="isOrganiser">
                    <li class="nav-item">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/events' }" aria-current="page"
                            to="/events">events</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/attractionsList' }"
                            to="/attractionsList">attractions</RouterLink>
                    </li>

                    <!-- Organizer-specific links -->
                    <li class="nav-item" v-if="isOrganiser">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/calendar' }" to="/calendar">
                            calendar</RouterLink>
                    </li>
                    <li class="nav-item" v-if="isOrganiser">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/organizer-dashboard' }"
                            to="/organizer-dashboard">dashboard</RouterLink>
                    </li>
                </ul>

                <ul class="navbar-nav mx-auto" v-if="!isCustomer && !isOrganiser">
                    <li class="nav-item">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/' }" aria-current="page"
                            to="/">home</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/events' }"
                            to="/events">events</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/attractionsList' }"
                            to="/attractionsList">attractions</RouterLink>
                    </li>

                    <li class="nav-item" v-if="!isAuthenticated">
                        <RouterLink class="nav-link" :class="{ active: $route.path === '/organizers' }"
                            to="/organizers">partner with us</RouterLink>
                    </li>

                </ul>

                <!-- NAVBAR CONDITIONAL RENDERING -->

                <ul class="navbar-nav">
                    <li id="last-item" class="nav-item" v-if="!isAuthenticated">
                        <RouterLink class="nav-link mt-3 mb-3 text-nowrap" to="/login-for-users">login / sign up
                        </RouterLink>
                    </li>
                    <li class="nav-item dropdown" v-else>
                        <a class="nav-link dropdown-toggle mt-3 mb-3" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fi fi-rs-user"></i>
                            <!-- User icon -->
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end mb-3" :class="{ hidden: isHidden }"
                            aria-labelledby="navbarDropdown">
                            <li>
                                <RouterLink class="dropdown-item text-center" to="/dashboard">Profile</RouterLink>
                            </li>
                            <li>
                                <a class="dropdown-item text-center" href="#" @click.prevent="signOut">Sign Out</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { auth, database } from '../firebase/firebaseClientConfig';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { ref as firebaseRef, get } from 'firebase/database'; // Rename `ref` from Firebase to `firebaseRef`
import EventBus from '../utils/eventBus.js';
// computed
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
    name: 'navbarNav',
    data() {
        return {
            isAuthenticated: false, // Firebase will handle auth state
            userType: null,
            isSticky: true,
            isSmall: false,
            isHidden: false,
            lastScrollY: 0,
            stickyTop: 0,
            scrollThreshold: 750,
        };
    },
    computed: {
        isOrganiser() {
            return this.userType === 'organiser';
        },
        isCustomer() {
            return this.userType === 'customer';
        }
    },
    setup() {
        const isLargeScreen = ref(false);

        const updateScreenSize = () => {
            isLargeScreen.value = window.innerWidth >= 992;
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
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.isAuthenticated = true;

                // Fetch userType from Firebase Database or Firestore
                const dbRef = firebaseRef(database, `users/${user.uid}`);
                const userTypeSnapshot = await get(dbRef);
                if (userTypeSnapshot.exists()) {
                    this.userType = userTypeSnapshot.val().userType;
                }
            } else {
                this.isAuthenticated = false;
                this.userType = null;
            }
        });
    },
    mounted() {
        this.stickyTop = this.$el.offsetTop;

        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            const scrollY = window.scrollY;

            this.isSticky = scrollY >= this.stickyTop;
            this.isSmall = scrollY > 200;

            if (scrollY > this.scrollThreshold) {
                if (scrollY > this.lastScrollY) {
                    this.isHidden = true;
                } else {
                    this.isHidden = false;
                }
            } else {
                this.isHidden = false;
            }

            this.lastScrollY = scrollY;
        },
        async signOut() {
            try {
                await firebaseSignOut(auth);
                this.isAuthenticated = false;
                this.userType = null;
                this.$router.push('/');
                EventBus.emit('google-oauth2-sign-out') // dont remove this line, logs out from google 
            } catch (error) {
                console.error('Error signing out:', error.message);
            }
        },

        updateNavbarBasedOnRoute(path) {
            if (path === '/') {
                console.log('Navigated to ExpensePage');
            }
        },
    },

};
</script>

<style scoped>
.nav-link {
    font-weight: 600;
    font-family: graphie, sans-serif;
    font-size: 1.1rem;
    font-style: normal;
    position: relative;
    display: inline-block;
    overflow: hidden;
    padding: 0.75rem 0px !important;
    margin: 0px 1.5rem;
    padding-bottom: 0px !important;
}

.nav-link::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background-color: #0056b3;
    transition: left 0.4s ease-in-out;
}

.nav-link:hover::before {
    left: 0;
}

.nav-link.active {
    font-weight: bold;
    color: #0056b3 !important;
    font-size: 1.2rem;
}

.nav-link.active:hover::before {
    left: 0;
}

.nav-item.dropdown .nav-link {
    text-decoration: none;
}

.nav-item.dropdown .nav-link::before {
    display: none;
}

.navbar {
    transition: all 0.3s ease;
    height: 100px;
    padding: 1.25rem 2rem;
    opacity: 0.9;
}

.navbar-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
}

.sticky {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

/* USER LOG IN / SIGN UP DROPDOWN */

@keyframes slideDown {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-menu {
    opacity: 1;
    transform: translateY(-20px);
    animation: slideDown 0.3s ease forwards;
    border-radius: 0px;
    border: none;
}

.show .dropdown-menu {
    animation: slideDown 0.3s ease forwards;
    opacity: 1;
    transform: translateY(0);
}

/* USER LOG IN / SIGN UP DROPDOWN */

.navbar-small {
    height: 90px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
}

.navbar-icon-small {
    padding: 5px;
    transition: all 0.3s ease;
}

.navbar-button-small {
    height: 22px;
    width: 22px;
    transition: all 0.3s ease;
}

.navbar-toggler {
    transition: all 0.5s ease;
}

.hidden {
    transform: translateY(-100%);
    transition: transform 0.3s ease;
}

.hiddencollapse {
    transform: translateY(-100%);
    transition: transform 0.9s ease;
}

.navbar-small .navbar-brand {
    font-size: 1.25rem;
}

.navbar-small .nav-link {
    padding: 0.5rem 1rem;
}

.nav-link.active {
    font-weight: bold;
    color: #0056b3 !important;
    font-size: large;
}

@keyframes slideUp {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideUp {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.navbar-brand img {
    opacity: 0;
    animation: slideUp 0.6s ease forwards;
    animation-delay: 0.2s;
}

.nav-item {
    opacity: 0;
    animation: slideUp 0.6s ease forwards;
}

.nav-item:nth-child(1) {
    animation-delay: 0.3s;
}

.nav-item:nth-child(2) {
    animation-delay: 0.4s;
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

.collapse.show .nav-item {
    animation-delay: 0s;
}

.custom-max-width {
    max-width: fit-content;
}

</style>
