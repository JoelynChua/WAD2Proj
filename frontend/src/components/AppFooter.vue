<template>
  <footer class="footer">
    <div class="container">
      <!-- Social Links with Horizontal Lines -->
      <div class="social-links-container">
        <span class="line"></span>
        <ul class="social-links">
          <li>
            <a href="https://twitter.com" aria-label="Twitter">
              <img src="../assets/X.png" width="40px" alt="Twitter Logo" />
            </a>
          </li>
          <li>
            <a href="https://instagram.com" aria-label="Instagram">
              <img src="../assets/IG.png" width="60px" alt="Instagram Logo" />
            </a>
          </li>
          <li>
            <a href="https://facebook.com" aria-label="Facebook">
              <img src="../assets/FB.png" width="37px" alt="Facebook Logo" />
            </a>
          </li>
        </ul>
        <span class="line"></span>
      </div>

      <!-- Footer Links -->
      <ul class="footer-links">
        <li><router-link to="/about-us">About Us</router-link></li>
        <li><router-link to="/faq">FAQ</router-link></li>
        <li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
      </ul>

      <!-- Copyright -->
      <p>&copy; 2024 Activity.ai. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
/* General Footer Styling */
.footer {
  background-color: #1d1d1d;
  color: rgb(139, 5, 5);
  text-align: center;
  padding: 20px 0;
  position: relative;
  bottom: 0;
  width: 100%;
}

.container {
  padding: 0 12px 10px;
}

/* Social Links Container with Lines */
.social-links-container {
  display: flex;
  align-items: center; /* Center items vertically within the container */
  justify-content: center;
  margin: 20px 0; /* Space around the social links and lines */
}

/* Horizontal lines on either side of social icons */
.line {
  flex: 1;
  height: 1px;
  background-color: #ddd; /* Adjust color as needed */
  margin: 0 15px; /* Space between line and social icons */
  align-self: center; /* Centers the line vertically with the icons */
}

/* Social Links */
.social-links {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center; /* Ensures the icons are vertically centered */
}

.social-links li {
  margin: 0 15px; /* Space between icons */
}

/* Footer Links */
.footer-links {
  list-style-type: none;
  padding: 0;
  margin: 20px 0 10px; /* Space between social links and footer links */
}

.footer-links li {
  display: inline;
  margin: 0 10px;
}

.footer-links a {
  color: rgb(139, 5, 5);
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Additional styling for copyright */
.footer p {
  font-size: 0.9rem;
  color: #888;
  margin-top: 10px;
}
</style>
