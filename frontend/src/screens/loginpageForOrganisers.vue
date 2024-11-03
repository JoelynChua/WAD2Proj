<template>
    <div v-if="!mobileBrowser" class="video-background-container">
        <video autoplay muted loop playsinline id="background-video" @loadeddata="onVideoLoaded">
            <source src="https://assets.sands.com/MBS/Revamp/whats-on/whats-on-masthead-20240315-desktop.mp4"
                type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>

    <div v-if="videoLoaded || mobileBrowser" class="login-container p-4 shadow col-4">
        <RouterLink v-if="videoLoaded" to="/" class="back-button">&lt; Back</RouterLink>
        <div class="login-item">
            <div class="mb-5"><img src="../assets/activity.ai.png" width="200px" height="auto"></div>
            <h5 class="text-start">Organizer Login</h5> <!-- Changed heading for organizers -->
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <div v-if="invalidCred" class="text-danger" style="font-size: 12px;">Username or Password is
                        incorrect, please try again.</div>
                    <input type="email" class="form-control" id="email" v-model="email"
                        placeholder="organizer@domain.com" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input :type="passwordFieldType" class="form-control" id="password" v-model="password"
                        placeholder="Password" required />
                    <input type="checkbox" @click="togglePasswordVisibility" /> Show Password
                </div>
                <button type="submit" class="btn btn-primary w-100" style="border-radius: 0%;">Log in</button>
            </form>
            <br />
            <p>or access quickly</p>
            <GoogleLogin />

            <!-- New: Link to switch to User Login Page -->
            <div class="text-center mt-3">
                <p>Don't have an account? <RouterLink to="/signup">Sign Up</RouterLink>
                </p>
                <p>Are you a user? <RouterLink to="/login-for-users">Log in as User</RouterLink>
                </p> <!-- New Link -->
            </div>
        </div>
    </div>
</template>

<script>
import { auth, database } from '../firebase/firebaseClientConfig';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { ref, child, get } from 'firebase/database';
import GoogleLogin from '../components/GoogleLogin.vue';

export default {
    data() {
        return {
            email: '',
            password: '',
            passwordFieldType: 'password',
            videoLoaded: false,
            invalidCred: false,
            mobileBrowser: false,
        };
    },
    components: {
        GoogleLogin,
    },
    methods: {
        onVideoLoaded() {
            this.videoLoaded = true;
        },
        togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        async login() {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
                const user = userCredential.user;
                console.log('User logged in:', user);
                
                // Retrieve userType from Firebase Database
                const dbRef = ref(database);
                const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    console.log("usertype:", userData.userType);

                    if (userData.userType === 'organiser') {
                        this.$router.push('/organizer-dashboard'); // Redirect to organizer dashboard
                    } else {
                        this.invalidCred = true;
                        alert("Access denied. You must have an organiser account to log in here.");
                        await firebaseSignOut(auth); // Sign out to ensure a clean state
                        this.$router.push('/login-for-organisers'); // Redirect to login
                    }
                } else {
                    alert("No user data found.");
                }

            }catch (error) {
                if (error.message === 'Firebase: Error (auth/invalid-credential).') {
                    this.invalidCred = true;
                } else {
                    console.error('Error logging in:', error.message);
                    alert(error.message);
                }
            }
        },
    },
};
</script>

<style scoped>
.video-background-container {
    margin-left: auto;
    position: relative;
    width: 50%;
    height: 100vh;
    overflow: hidden;
}

#background-video {
    position: relative;
    filter: brightness(85%);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.login-container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0px;
    left: 0px;
    background-color: rgba(255, 255, 255);
    width: 50%;
    height: 100vh;
}

@media (max-width: 769px) {
    .login-container {
        width: 100%;
    }
}

.login-item {
    width: 40%;
    min-width: 350px;
}

.back-button {
    position: absolute;
    color: rgb(44, 62, 80);
    top: 30px;
    left: 30px;
    z-index: 10;
    text-decoration: none;
    font-size: 24px;
    font-family: 'Roboto', sans-serif;
}

.form-control {
    height: 40px;
}

h5 {
    font-size: 38px;
    font-weight: 900;
}
</style>