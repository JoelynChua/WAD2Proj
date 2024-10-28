<template>
  <footer class="footer">
    <div class="container">
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
      <ul class="footer-links">
        <li><router-link to="/about-us">About Us</router-link></li>
        <li><router-link to="/faq">FAQ</router-link></li>
        <li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
      </ul>
      <p>&copy; 2024 Your Company. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
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

/* Flexbox for social links */
.social-links {
  list-style-type: none;
  padding: 0;
  margin: 0 0 10px 0; /* Margin below social links */
  display: flex; /* Use flexbox for alignment */
  justify-content: center; /* Center the social links */
}

.social-links li {
  margin: 0 15px; /* Space between icons */
}

/* Flexbox for footer links */
.footer-links {
  list-style-type: none;
  padding: 0;
  margin: 10px 0; /* Margin above copyright */
}

.footer-links li {
  display: inline;
  margin: 0 10px;
}
</style>
