<template>
  <div class="video-background-container">
    <!-- Test1 -->
    <!-- Background Video -->
    <!-- <video autoplay muted loop id="background-video" @loadeddata="onVideoLoaded">
      <source src="../assets/loginvid.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video> -->

    <!-- Back Button (shown when video is loaded) -->
    <RouterLink v-if="videoLoaded" to="/" class="back-button">
      &lt; Back
    </RouterLink>

    <!-- Overlay for the login form (shown when video is loaded) -->
    <!-- <div class="container vh-100" v-if="videoLoaded"> -->
      <div class="container vh-100"> 
      <div class="row justify-content-center align-items-center justify-content-md-end vh-100">
        <div class="login-container p-4 shadow col-4">
          <h5 class="text-center">Log in to your account</h5>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <div v-if="invalidCred" class="text-danger" style="font-size: 12px;">Username or Password is
                incorrect, please try again.</div>
              <input type="email" class="form-control" id="email" v-model="email" placeholder="moklay@smu.edu.sg"
                required />
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
import { auth, database } from '../firebase/firebaseClientConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, child, get } from 'firebase/database';

export default {
  data() {
    return {
      email: '',
      password: '',
      passwordFieldType: 'password',
      videoLoaded: false, // Initial loading state for the video
      invalidCred: false,
    };
  },
  methods: {
    onVideoLoaded() {
      this.videoLoaded = true; // Set videoLoaded to true when the video is ready
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log('User logged in:', user);
        sessionStorage.setItem('uid', user.uid);
        const dbRef = ref(database);
        const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          sessionStorage.setItem('userType', userData.userType); // Get userType from RTDB
          console.log("usertype: " + sessionStorage.getItem('userType'));
        }
        this.$router.push('/');
      }

      catch (error) {
        if (error.message == 'Firebase: Error (auth/invalid-credential).') {
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
  background-color: rgba(255, 255, 255, 0.85);
  /* White background with 85% opacity */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  min-width: 400px;
}

.back-button {
  position: absolute;
  /* Positioning the button */
  top: 30px;
  /* Adjust the position as needed */
  left: 30px;
  /* Adjust the position as needed */
  z-index: 10;
  /* Ensure it appears above the video */
  color: rgb(201, 201, 201);
  /* Change to desired text color */
  text-decoration: none;
  /* Remove underline */
  font-size: 24px;
  /* Adjust the font size as needed */
  font-family: 'Roboto', sans-serif;
}
</style>