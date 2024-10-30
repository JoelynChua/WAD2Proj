<template>
    <div class="signup-container">
        <h5 class="text-center">Sign up for a new account</h5>
        <form @submit.prevent="signUp">
            <div class="mb-3">
                <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                <div v-if="emailinuse" class="text-danger" style="font-size: 12px;">
                    Email is already registered to an account!
                </div>
                <input type="email" class="form-control" id="email" v-model="email" placeholder="your-email@example.com"
                    required />
                <small v-if="emailError" class="text-danger">{{ emailError }}</small>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
                <input :type="passwordFieldType" class="form-control" id="password" v-model="password"
                    placeholder="Password" required />
                <input type="checkbox" @click="togglePasswordVisibility" /> Show Password
                <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                {{ isLoading ? 'Signing Up...' : 'Sign up' }}
            </button>
        </form>
        <br />
        <p>or access quickly</p>
        <GoogleLogin />

        <div class="text-center mt-3">
            <p>Already have an account? <button class="btn btn-link" @click="$emit('switch-to-login')">Log In</button>
            </p>    
        </div>
    </div>
</template>

<script>
import { auth } from "../firebase/firebaseClientConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import GoogleLogin from '../components/GoogleLogin.vue';

export default {
    data() {
        return {
            email: '',
            password: '',
            passwordFieldType: 'password',
            isLoading: false,
            emailError: '',
            passwordError: '',
            emailinuse: false,
        };
    },
    components: { GoogleLogin },
    methods: {
        togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        async signUp() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(this.email)) {
                this.emailError = 'Please enter a valid email address.';
                return;
            } else {
                this.emailError = '';
            }

            if (this.password.length < 6) {
                this.passwordError = 'Password must be at least 6 characters long.';
                return;
            } else {
                this.passwordError = '';
            }

            this.isLoading = true;
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                const user = userCredential.user;
                sessionStorage.setItem('uid', user.uid);
                console.log('User signed up:', user);
                this.$emit('close-modal'); // Closes modal on success
            } catch (error) {
                if (error.message.includes("auth/email-already-in-use")) {
                    this.emailinuse = true;
                } else {
                    console.error('Error signing up:', error.message);
                    alert(error.message);
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
.signup-container {
    background: rgba(255, 255, 255, 0.1);
    /* Transparent background */
    backdrop-filter: blur(10px);
    /* Glass effect */
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    /* Optional: add shadow for depth */
    max-width: 400px;
    margin: 0 auto;
    color: #fff;
    /* Text color for better visibility */
}
</style>