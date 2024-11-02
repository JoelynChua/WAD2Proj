<template>
  <div id="app">
    <main>
      <section class="hero text-start">
        <!-- Background Video -->
        <video ref="backgroundVideo" autoplay muted loop playsinline id="background-video">
          <source src="https://media.graphassets.com/iX5mzzTaQAeFQrC4MvPZ" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <section id="largeHomeScreen">
          <h2 class="slide-right" style="margin-top: 250px;">Las Vegas Sphere now presents: <br>Hamilton</h2>
          <p class="fade-in mt-5">Proudly casted by Lay Foo and Mok Ngee HeHe</p>
          <button @click="findActivities" class="section1_buttons pulse mt-4 p-3" style="border-radius: 50px; font-size: 16px; height: 40px">Find Activities</button>
          <a href="#aboutUs"><button class="section1_buttons pulse p-3 ms-4" style="border-radius: 50px; font-size: 16px; height: 40px">About Us</button></a>
        </section>

        <section id="smallHomeScreen" class="text-center">
          <h2 class="slide-right" style="margin-top: 250px;">Las Vegas Sphere now presents: <br>Hamilton</h2>
          <p class="fade-in mt-5">Proudly casted by Lay Foo and Mok Ngee HeHe</p>
          <button @click="findActivities" class="section1_buttons pulse mt-4 p-3" style="border-radius: 50px; font-size: 16px; height: 40px">Find Activities</button>
          <a href="#aboutUs"><button class="section1_buttons pulse p-3 ms-4" style="border-radius: 50px; font-size: 16px; height: 40px">About Us</button></a>
        </section>

        <!-- Pause Button -->
        <button v-if="!this.paused" @click="toggleVideo" class="pause-button"><i class="fi fi-ts-pause-circle"></i></button>
        <button v-else @click="toggleVideo" class="pause-button"><i class="fi fi-ts-play-circle"></i></button>
      </section>

      <div style="background-color: #f9f9f9;">
        <section id="featuredEvents" class="featured-activities">
          <featuredEvents />
        </section>
      </div>
    
      <div style="background-color: #f9f9f9;">
        <section id="aboutUs" class="featured-activities" :class="{ 'slide-in': isAboutUsVisible }">
          <aboutUs />
        </section>
      </div>

      <div style="background-color: #121212;">
        <section id="gosomewhere" class="featured-activities">
          <gosomewhere />
        </section>
      </div>

    </main>
  </div>
</template>


<script>
import router from '@/router';
import gosomewhere from '../components/HomePage_gosomewhere.vue';
import aboutUs from '../components/HomePage_aboutUs.vue';
import featuredEvents from '../components/HomePage_featuredEvents.vue'

export default {
  data() {
    return {
      isAboutUsVisible: false,
      paused: false,
    };
  },
  components: {
    gosomewhere,
    aboutUs,
    featuredEvents
  },
  methods: {
    findActivities() {
      // Logic to find activities
      router.push("/events");
    },
    toggleVideo() {
      const video = this.$refs.backgroundVideo;
      if (video.paused) {
        video.play();
        this.paused = false;
      } else {
        video.pause();
        this.paused = true;
      }
    },
    observeAboutUs() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isAboutUsVisible = true; // Set to true when in view
            observer.unobserve(entry.target); // Stop observing after it comes into view
          }
        });
      });

      const aboutUsSection = document.getElementById('aboutUs');
      if (aboutUsSection) {
        observer.observe(aboutUsSection);
      }
    },
  },
  mounted() {
    this.observeAboutUs(); // Start observing when component is mounted
  
  },
};
</script>


<style scoped>
.pause-button {
  position: absolute;
  background: transparent;
  border: transparent;
  color: #f9f9f9;
  font-size: 50px;
  bottom: 30px;
  left: 50px;
  cursor: pointer;
  z-index: 10; /* Ensure button is above the video */
}


@keyframes slide-in {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  /* Start off-screen to the right */
  100% {
    transform: translateX(0);
    opacity: 1;
  }

  /* End at original position */
}

.slide-in {
  animation: slide-in 1s forwards;
  /* Apply slide-in animation */
}

#aboutUs {
  margin-top: 100px;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slide-right {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-30px);
  }

  60% {
    transform: translateY(-15px);
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: graphie, sans-serif;
  text-align: center;
  background-color: #f9f9f9;
  color: #333;
  filter: brightness(95%);
}

.hero {
  position: relative;
  background: white;
  color: white;
  padding: 3rem 1.5rem;
  animation: zoom-in 1s ease-in-out;
  margin-bottom: 2rem;
  overflow: hidden;
  height: 100vh;
  z-index: 1;
  /* Ensure hero content appears above video */

}

#background-video {
  position: absolute;
  filter: brightness(50%);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  /* Adjust opacity for readability */
}

.hero h2 {
  animation: slide-right 1s ease-in-out;
  color: white;
  font-size: 42px;
  font-weight: 600;
  height: 100px;
  line-height: 67.6px;
  text-size-adjust: 100%;
  text-shadow: rgba(0, 0, 0, 0.4) 0px 1px 5px, rgba(0, 0, 0, 0.5) 0px 4px 60px;
  white-space: nowrap;
}

.hero p {
  animation: slide-left 1s ease-in-out;
  color: white;
  display: block;
  font-family: graphie, sans-serif;
  font-size: 20px;
  font-weight: 350;
  white-space: nowrap;
}

.section1_buttons {
  animation: pulse 2s infinite;
  background: linear-gradient(90deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
}

.featured-activities {
  margin-top: 2rem;
}

.featured-activities h2 {
  animation: fade-in 2s ease-in-out;
}

.featured-activities ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.featured-activities ul li {
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 0.5rem;
  padding: 1.5rem;
  animation: bounce 2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  flex: 1 1 calc(33.333% - 1rem);
}

#aboutUs,
#gosomewhere {
  margin-top: 100px;
}

footer {
  background: #222;
  color: white;
  padding: 1.5rem;
  animation: fade-in 2s ease-in-out;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  #largeHomeScreen {
    display: none
  }

  #smallHomeScreen, .hero h2, .hero p {
    display: block;
    white-space: wrap !important;
  }

  .hero h2 {
    margin-bottom: 140px;
    margin-top: 110px;
  }
}

@media (min-width: 769px) {

  #smallHomeScreen {
    display: none;
  }
}
</style>
