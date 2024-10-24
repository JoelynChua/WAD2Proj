<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-pink">
    <div class="login-container p-5 shadow">
      <!-- <img src="" alt="Logo" width="150" class="mb-3 d-block mx-auto"> -->
      <h5 class="text-center">Sign up for a new account</h5>
      <form @submit.prevent="signUp">
        <div class="mb-3">
          <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="moklay@smu.edu.sg" required>
          <small v-if="emailError" class="text-danger">{{ emailError }}</small>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
          <input :type="passwordFieldType" class="form-control" id="password" v-model="password" placeholder="Password" required>
          <input type="checkbox" @click="togglePasswordVisibility"> Show Password
          <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
          {{ isLoading ? 'Signing Up...' : 'Sign up' }}
        </button>
        <br>
        <br>
            <p>or access quickly</p>
            <GoogleLogin />
      </form>
      <div class="text-center mt-3">
        <p>Already have an account? <RouterLink to="/loginpage">Log In</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase/firebaseClientConfig"; // Update with the correct path
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
      passwordError: ''
    };
  },
  components: {
    GoogleLogin,
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    async signUp() {
      // Email Validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = 'Please enter a valid email address.';
        return;
      } else {
        this.emailError = '';
      }

      // Password Validation
      if (this.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters long.';
        return;
      } else {
        this.passwordError = '';
      }

      this.isLoading = true;
      try {
        // Create New User on Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        sessionStorage.setItem('uid', user.uid);
        console.log('User signed up:', user);
        this.$router.push('/ProfilePage');
      } catch (error) {
        console.error('Error signing up:', error.message);
        alert(error.message);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.bg-pink {
  background-color: white;
}
.login-container {
  width: 400px;
  background-color: white;
}
#app {
    margin: 0;
}
</style>
