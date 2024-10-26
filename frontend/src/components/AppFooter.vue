<template>
  <footer class="footer">
    <div class="container">      
      <ul style="list-style-type:none;">
        <a href="https://twitter.com"><img src="../assets/X.png" width="40px"></a>
        <a href="https://instagram.com"><img src="../assets/IG.png" width="60px"></a>
        <a href="https://facebook.com"><img src="../assets/FB.png" width="37px"></a>
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
  padding: 20px 0 0 10px;
  position: relative;
  bottom: 0;
  width: 100%;
}

div.container {
  padding: 0 12px 10px
}

li {
  display: inline;
  margin: 10px 10px ;
}
</style>