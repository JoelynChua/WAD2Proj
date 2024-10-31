<template>
  <div class="video-background-container">
    <!-- Background Video -->
    <video autoplay muted loop playsinline id="background-video" @loadeddata="onVideoLoaded">
      <source src="https://player.vimeo.com/progressive_redirect/playback/974545879/rendition/1080p/file.mp4?loc=external&signature=38aeddf1078d80e57d269efbdd116b46079bff110e473e882397cf5119aa1d3b" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Back Button -->
    <RouterLink v-if="isVideoLoaded" to="/" class="back-button">
      &lt; Back
    </RouterLink>

    <!-- Overlay for the signup form -->
    <div class="container vh-100">
      <div class="row justify-content-center align-items-center justify-content-md-end vh-100">
        <div v-if="isVideoLoaded" class="login-container p-4 shadow col-4">
          <h5 class="text-center">Sign up for a new account</h5>
          <form @submit.prevent="signUp">
            <div class="mb-3">
              <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
              <div v-if="this.emailinuse" class="text-danger" style="font-size: 12px;">Email is already registered to an
                account!</div>
              <input type="email" class="form-control" id="email" v-model="email" placeholder="moklay@smu.edu.sg"
                required>
              <small v-if="emailError" class="text-danger">{{ emailError }}</small>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
              <input :type="passwordFieldType" class="form-control" id="password" v-model="password"
                placeholder="Password" required>
              <input type="checkbox" @click="togglePasswordVisibility"> Show Password
              <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
            </div>
            <button type="submit" class="btn btn-primary"
            style="border-radius: 0%;"
            :disabled="isLoading">
              {{ isLoading ? 'Signing Up...' : 'Sign up' }}
            </button>
            <br>
            <br>
            <p>or access quickly</p>
            <GoogleLogin />
          </form>
          <div class="text-center mt-3">
            <p>Already have an account? <RouterLink to="/login">Log In</RouterLink>
            </p>
          </div>
        </div>
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
      passwordError: '',
      isVideoLoaded: false, // Track video loading state
      emailinuse: false,
    };
  },
  components: {
    GoogleLogin,
  },
  methods: {
    onVideoLoaded() {
      this.isVideoLoaded = true; // Set to true when video is loaded
    },
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
        this.$router.push('/dashboard');
      } catch (error) {

        if (error.message == "Firebase: Error (auth/email-already-in-use).") {
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
.video-background-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#background-video {
  position: absolute;
  filter: brightness(85%);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  min-width: 340px;
}

.back-button {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-size: 24px;
  font-family: 'Roboto', sans-serif;
}
</style>
