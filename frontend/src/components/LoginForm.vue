<template>
  <div class="login-container">
      <h5 class="text-center">Log in to your account</h5>
      <form @submit.prevent="login">
          <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <div v-if="invalidCred" class="text-danger" style="font-size: 12px;">Username or Password is incorrect, please try again.</div>
              <input type="email" class="form-control" id="email" v-model="email" placeholder="your-email@example.com" required />
          </div>
          <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input :type="passwordFieldType" class="form-control" id="password" v-model="password" placeholder="Password" required />
              <input type="checkbox" @click="togglePasswordVisibility" /> Show Password
          </div>
          <button type="submit" class="btn btn-primary w-100">Log in</button>
      </form>
      <br />
      <p class="text-center">or access quickly</p>
      <GoogleLogin />
      <div class="text-center mt-3">
          <p>Don't have an account? <button @click="$emit('switch-to-signup')" class="btn btn-link">Sign Up</button></p>
      </div>
  </div>
</template>

<script>
import { auth, database } from '../firebase/firebaseClientConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, child, get } from 'firebase/database';

export default {
  data() {
      return {
          email: '',
          password: '',
          passwordFieldType: 'password',
          invalidCred: false,
      };
  },
  methods: {
      togglePasswordVisibility() {
          this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
      },
      async login() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log('User logged in:', user);

        // Set user ID and type in session storage
        sessionStorage.setItem('uid', user.uid);
        const dbRef = ref(database);
        const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
        if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            sessionStorage.setItem('userType', userData.userType);
        }

        // Emit event for successful login
        this.$emit('login-success'); // Notify other components that login was successful
        this.$emit('close-modal'); // Close the login modal

    } catch (error) {
        this.invalidCred = error.message.includes('invalid-credential');
        console.error('Error logging in:', error.message);
    }
}

  },
};
</script>

<style scoped>
.login-container {
  background: rgba(255, 255, 255, 0.1); /* Transparent background */
  backdrop-filter: blur(10px); /* Glass effect */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Shadow for depth */
  max-width: 400px;
  margin: 0 auto;
  color: #fff; /* Text color for better visibility */
}
</style>
