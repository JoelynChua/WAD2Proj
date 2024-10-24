<template>
    <div class="video-background-container">
        <!-- Background Video -->
        <video autoplay muted loop id="background-video">
            <source src="../assets/loginvid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        <!-- Back Button -->
        <RouterLink to="/" class="back-button">
            &lt; Back
        </RouterLink>

        <!-- Overlay for the login form -->
        <div class="container vh-100">
            <div class="row justify-content-end align-items-center vh-100">
                <div class="login-container p-4 shadow col-4">
                    <h5 class="text-center">Log in to your account</h5>
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" v-model="email"
                                placeholder="moklay@smu.edu.sg" required />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input :type="passwordFieldType" class="form-control" id="password" v-model="password"
                                placeholder="Password" required />
                            <input type="checkbox" @click="togglePasswordVisibility" /> Show Password
                        </div>
                        <button type="submit" class="btn btn-primary w-100">
                            Log in
                        </button>
                    </form>
                    <br />
                    <p>or access quickly</p>
                    <GoogleLogin />

                    <div class="text-center mt-3">
                        <p>
                            Don't have an account?
                            <RouterLink to="/signup">Sign Up</RouterLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth } from '../firebase/firebaseClientConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default {
    data() {
        return {
            email: '',
            password: '',
            passwordFieldType: 'password',
        };
    },
    methods: {
        togglePasswordVisibility() {
            this.passwordFieldType =
                this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        async login() {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    this.email,
                    this.password
                );
                const user = userCredential.user;
                console.log('User logged in:', user);

                console.log('Uid:', user.uid);
                sessionStorage.setItem('uid', user.uid);

                this.$router.push('/');
            } catch (error) {
                console.error('Error logging in:', error.message);
                alert(error.message);
            }
        },
    },
};
</script>

<script setup>
import GoogleLogin from '../components/GoogleLogin.vue';
</script>

<style scoped>
.video-background-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

#background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.login-container {
    background-color: rgba(255, 255, 255, 0.85); /* White background with 80% opacity */
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    min-width: 400px;
}

.back-button {
    position: absolute; /* Positioning the button */
    top: 30px; /* Adjust the position as needed */
    left: 30px; /* Adjust the position as needed */
    z-index: 10; /* Ensure it appears above the video */
    color: rgb(201, 201, 201); /* Change to desired text color */
    text-decoration: none; /* Remove underline */
    font-size: 24px; /* Adjust the font size as needed */
    font-family: 'Roboto', sans-serif;
}
</style>
