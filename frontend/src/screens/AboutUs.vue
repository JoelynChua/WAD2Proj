<template>
  <div class="about-us-container">
    <!-- Toggle Button for TOC -->
    <button @click="toggleToc" class="toggle-btn">☰ Table of Contents</button>

    <!-- Table of Contents -->
    <div :class="['toc', { hide: isTocHidden }]" id="toc">
      <br><br>
      <ul class="list-unstyled">
        <li><a href="#who-are-we" @click="scrollToSection('who-are-we')">Who Are We?</a></li>
        <li><a href="#our-mission" @click="scrollToSection('our-mission')">Our Mission</a>
        </li>
        <li><a href="#why" @click="scrollToSection('why')">Why We Created This Platform</a></li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="content container">
      <h1 class="display-2 text-center my-5">About Us</h1>

      <section id="who-are-we" class="mb-5">
        <div class="spacer" id="spacer-who-are-we"></div>
        <h2>Who Are We?</h2>
        <p>
          Welcome to <strong>Activity.ai</strong> – your go-to platform for planning memorable outings around
          Singapore! We are a team of five passionate university students from Singapore Management University, united
          by our love for exploring and creating meaningful experiences with friends and family.
        </p>
        <p>
          As students, we understand how challenging it can be to organize fun, seamless outings amidst the hustle of
          everyday life. Our project was born from a shared vision: to create a platform that makes planning social
          gatherings simple, efficient, and enjoyable for everyone.
        </p>
      </section>

      <section id="our-mission" class="mb-5">
        <div class="spacer" id="spacer-who-are-we"></div>
        <h2>Our Mission</h2>
        <p>
          We hope <strong>Activity.ai</strong> will make it easier for Singaporeans to discover the best places,
          events, and activities that the city has to offer. Whether you’re planning a simple day out, a unique event,
          or a complex itinerary, our platform helps streamline every aspect of your experience. From budgeting tools
          and itinerary creation to customized recommendations, we’re here to help make every outing as memorable as
          possible.
        </p>
      </section>

      <section id="why" class="mb-5">
        <div class="spacer" id="spacer-who-are-we"></div>
        <h2>Why We Created This Platform</h2>
        <p>
          The inspiration for <strong>Activity.ai</strong> came from our own experiences. Too often, we found
          ourselves struggling to coordinate plans, manage expenses, and discover new spots around the city. We wanted
          to change that by providing a one-stop solution that simplifies the planning process. Our platform combines
          search functionality, itinerary creation, expense tracking, and more—so you can focus on what matters most:
          enjoying the day with friends and family.
        </p>
      </section>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTocHidden: false, // State to toggle Table of Contents visibility
      windowWidth: window.innerWidth, // Track window width
    };
  },
  methods: {
    toggleToc() {
      this.isTocHidden = !this.isTocHidden;
    },
    scrollToSection(sectionId) {
      const spacer = document.getElementById(`spacer-${sectionId}`);
      if (spacer) {
        spacer.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
  watch: {
    windowWidth(newWidth) {
      // Collapse TOC below 992px and reappear above 1200px
      if (newWidth < 1200) {
        this.isTocHidden = true;
      } else if (newWidth >= 1200) {
        this.isTocHidden = false;
      }
    },
  },
  mounted() {
    // Initialize TOC state based on initial screen size
    if (this.windowWidth < 1200) {
      this.isTocHidden = true;
    } else if (this.windowWidth >= 1200) {
      this.isTocHidden = false;
    }
    // Listen for resize events to update window width dynamically
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    // Clean up event listener when component is destroyed
    window.removeEventListener("resize", this.updateWindowWidth);
  },
};
</script>

<style scoped>
/* General styling */
.about-us-container {
  display: flex;
  justify-content: left;
  /* Center the container horizontally */
}

.container {
  max-width: 1000px;
  padding-top: 20px;
  padding-bottom: 40px;
  text-align: left;
}

/* Styling for the TOC */
.toc {
  position: fixed;
  top: 150px;
  left: 20px;
  max-width: 300px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: left;
}

.toc.hide {
  transform: translateX(-300px);

}

.toc h3 {
  font-size: 2rem;
}

.toc a {
  color: #313131;
  text-decoration: none;
  font-size: 1.5rem;
  display: block;
  /* Makes each link take up full width */
  padding: 10px 0;
  /* Adds space between links */
}

.toc a:hover {
  text-decoration: underline;
}

/* Toggle button styling */
.toggle-btn {
  position: fixed;
  top: 170px;
  left: 69px;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 1001;
  border-color: #1161b2;
  color: rgb(214, 214, 214);
  background-color: #1161b2;
  padding: 5px 10px;
  border-radius: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    margin-left: 0;
  }

  .toc {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    transform: translateY(-100%);
  }

  .toc.show {
    transform: translateY(0);
  }
}

.spacer {
  height: 90px;
  /* Adjust this height to set the offset above each section */
  margin-top: -80px;
  /* Pull the spacer up to create the visual offset */
  visibility: hidden;
  /* Keep the spacer hidden */
}

h1,
h2 {
  font-weight: 600;
}
</style>
