<template>
  <div v-if="!mobileBrowser" class="video-background-container">
    <!-- Background Video -->
    <video autoplay muted loop playsinline id="background-video" @loadeddata="onVideoLoaded">
      <source src="https://assets.sands.com/MBS/Revamp/whats-on/whats-on-masthead-20240315-desktop.mp4"
        type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  <div v-if="videoLoaded || mobileBrowser" class="login-container p-4 shadow col-4">
    <div class="login-item">
      <div class="mb-5"><img src="../assets/activity.ai.png" width="200px" height="auto"></div>
      <h5 class="text-start">Log in</h5>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <div v-if="invalidCred" class="text-danger" style="font-size: 12px;">Username or Password is incorrect, please
            try again.</div>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="moklay@smu.edu.sg"
            required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input :type="passwordFieldType" class="form-control" id="password" v-model="password" placeholder="Password"
            required />
          <input type="checkbox" @click="togglePasswordVisibility" /> Show Password
        </div>
        <button type="submit" class="btn btn-primary w-100" style="border-radius: 0%;">Log in</button>
      </form>
      <br />
      <p>or access quickly</p>
      <GoogleLogin />

      <div class="text-center mt-3">
        <p class="changeuser"><RouterLink class="router-link" to="/signup">Sign Up</RouterLink>
        </p>
        <p class="changeuser"><RouterLink class="router-link" to="/login-for-organisers">Organizer</RouterLink>
        </p>
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

        // Fetch user data directly from Firebase Database
        const dbRef = ref(database);
        const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          console.log("usertype: " + userData.userType);

          if (userData.userType === 'customer') {
            this.$router.push('/'); // Redirect to root if the user is a customer
          } else {
            this.invalidCred = true;
            alert("Access denied. You must have a customer account to log in here.");

            // Sign out and redirect to login page for clean state
            await firebaseSignOut(auth);
            this.$router.push('/login-for-users');
          }
        } else {
          this.invalidCred = true;
        }

      } catch (error) {
        if (error.message === 'Firebase: Error (auth/invalid-credential).') {
          this.invalidCred = true;
        } else {
          console.log('Error logging in:', error.message);
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

.form-control {
  height: 40px;
}

h5 {
  font-size: 38px;
  font-weight: 900;
}

.changeuser {
  text-align: start;
  margin-bottom: 8px
}

.router-link {
  text-decoration: none;
  color: rgb(54, 89, 227);
  font-family: "Neue Plak", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Helvetica, Tahoma, Arial, sans-serif;
}

.router-link:hover {
  text-decoration: underline;
}
</style>
