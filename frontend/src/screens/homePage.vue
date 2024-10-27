<template>
  <div id="app">
    <main>
      <section class="hero zoom-in text-start">
        <!-- Background Video -->
        <video autoplay muted loop playsinline id="background-video">
          <source src="https://media.graphassets.com/BpGAyEtdSaaJCOX23fSW" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <h2 class="slide-right" style="margin-top: 250px;">Las Vegas Sphere now presents: <br>Hamilton</h2>
        <p class="slide-left mt-5">Proudly casted by Lay Foo and Mok Ngee HeHe</p>
        <button @click="findActivities" class="pulse mt-5 p-3" style="border-radius: 50px; font-size: 16px; height: 40px">Find Activities</button>
        <a href="#aboutUs"><button class="pulse p-3 ms-4" style="border-radius: 50px; font-size: 16px; height: 40px">About Us</button></a>
      </section>
      <section id="aboutUs" class="featured-activities">
        <aboutUs />
      </section>

      <section id="gosomewhere" class="featured-activities">
        <gosomewhere />
      </section>
    </main>
  </div>
</template>

<script>
import router from '@/router';
import gosomewhere from '../components/HomePage_gosomewhere.vue'
import aboutUs from '../components/HomePage_aboutUs.vue'

export default {
  data() {
    return {
    };
  },
  components: {
    gosomewhere,
    aboutUs,
  },
  methods: {
    findActivities() {
      // Add logic to find activities
      router.push("/events")
    }
  }
};
</script>

<style scoped>
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slide-right {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

@keyframes slide-left {
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
}

@keyframes zoom-in {
  0% { transform: scale(0.5); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: graphie, sans-serif;
  text-align: center;
  background: #f5f5f5;
  color: #333;
}

.hero {
  position: relative;
  background: white;
  color: white;
  padding: 3rem 1.5rem;
  animation: zoom-in 1s ease-in-out;
  margin-bottom: 2rem;
  overflow: hidden;
  height: 90vh;
  z-index: 1; /* Ensure hero content appears above video */

}

#background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.7; /* Adjust opacity for readability */
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

.hero button {
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

#aboutUs, #gosomewhere {
  margin-top: 100px;
}

footer {
  background: #222;
  color: white;
  padding: 1.5rem;
  animation: fade-in 2s ease-in-out;
  margin-top: 2rem;
}
</style>
