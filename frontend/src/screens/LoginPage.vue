<template>
    <div
        class="d-flex justify-content-center align-items-center vh-100 bg-pink"
    >
        <div class="login-container p-4">
            <!-- <img src="../assets/apple.png" alt="Logo" width="150"> -->
            <h5 class="text-center">Log in to your account</h5>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                        type="email"
                        class="form-control"
                        id="email"
                        v-model="email"
                        placeholder="moklay@smu.edu.sg"
                        required
                    />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input
                        :type="passwordFieldType"
                        class="form-control"
                        id="password"
                        v-model="password"
                        placeholder="Password"
                        required
                    />
                    <input type="checkbox" @click="togglePasswordVisibility" />
                    Show Password
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    Log in
                </button>
            </form>
            <br>
            <p>or access quickly</p>
            <GoogleLogin />

            <div class="text-center mt-3">
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
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
                // Store uid in sessionStorage
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
.bg-pink {
    background-color: black;
}

.login-container {
    width: 400px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

#app {
    margin: 0;
}
</style>
