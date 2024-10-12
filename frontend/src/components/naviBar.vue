<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Tabi-log</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" @click="toggleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Events</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/attractionsList">Attractions</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Itinerary</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap'; // Import Bootstrap JS

export default {
  name: "NavigationBar",

  methods: {
    toggleNavbar() {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      console.log(navbarCollapse);

      if (navbarCollapse.classList.contains('collapsing show')) {
        console.log(navbarCollapse);
        // If the navbar is currently shown, remove the 'show' class
        navbarCollapse.classList.remove('collapsing show');
      } else {
        // If the navbar is not shown, add the 'show' class
        navbarCollapse.classList.add('show');
      }
    }

  }
};
</script>

<style scoped>
/* Optional: Add your custom styles here */
</style>