<template>
    <section class="go-somewhere">
        <h2 class="go-somewhere__title">go somewhere</h2>
        <div class="go-somewhere__grid p-5 pb-0">
            <a class="go-somewhere__item" href="/events">
                <i class="fi fi-rs-navigation"></i>
                find an activity
            </a>
            <a class="go-somewhere__item" href="/attractionsList">
                <i class="fi fi-rr-castle"></i>
                find an attraction
            </a>
        </div>
        <div class="go-somewhere__grid p-5 pt-0">
            <a v-if="!isOrganiser" class="go-somewhere__item" href='/ExpensePage'>
                <i class="fi fi-rr-shopping-bag"></i>
                calculate expenses
            </a>

            <a v-else class="go-somewhere__item" href='/organizer-dashboard'>
                <i class="fi fi-rr-dashboard-monitor"></i> 
                events dashboard
            </a>

            <a v-if="!isOrganiser" class="go-somewhere__item" href='/itineraryList'>
                <i class="fi fi-rr-track"></i>
                build an itinerary
            </a>
            <a v-else class="go-somewhere__item" href='/calendar'>
                <i class="fi fi-rr-pen-clip"></i>
                create an event
            </a>
        </div>
    </section>
</template>

<script>
import { auth, database } from '../firebase/firebaseClientConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as firebaseRef, get } from 'firebase/database';
import '../../node_modules/@flaticon/flaticon-uicons/css/regular/all.css';


export default {
    data() {
        return {
            userType: null,

        };
    },
    methods: {
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
    computed: {
        isOrganiser() {
            return this.userType === 'organiser';
        },
    }
};
</script>

<style scoped>
.go-somewhere {
    text-align: center;
    padding: 2rem;
    padding-top: 100px;
    color: #fff;
}

.go-somewhere__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #ddd;
}

.go-somewhere__grid {
    display: flex;
    justify-content: center;
    padding-bottom: 0px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.go-somewhere__item {
    background: rgba(255, 255, 255, 0.1);
    width: 300px;
    border-radius: 8px;
    padding: 30px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease;
}

.go-somewhere__item i {
    font-size: 80px;
    color: #bcf0f7;
}

a {
    text-decoration: none;
    color: #fff;
}

.go-somewhere__item:hover {
    transform: scale(1.05);
}

.go-somewhere__icon img {
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
}

.go-somewhere__text p {
    font-size: 1rem;
    color: #bbb;
    text-transform: capitalize;
}

@media (max-width: 768px) {
    .go-somewhere__item {
        min-width: 120px;
        padding: 20px;
        /* Reduced padding */
        margin: 5px
    }

    .go-somewhere__item i {
        font-size: 60px;
        /* Smaller icon size */
    }

    .go-somewhere__title {
        font-size: 1.5rem;
        /* Slightly smaller title font */
    }
}
</style>