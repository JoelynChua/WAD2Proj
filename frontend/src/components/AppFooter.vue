<template>
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Your Company. All Rights Reserved.</p>
        <p>Contact us at: info@yourcompany.com</p>
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

  div.container{
    padding: 0 12px 10px
  }
  </style>
  