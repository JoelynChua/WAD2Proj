<template>
    <div class="not-found">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you are looking for might have been moved or deleted.</p>
      <router-link to="/" class="back-home">Go back to Home</router-link>
      <FlappyBird />
    </div>
  </template>
  
  <script>
    

  export default {
    name: 'NotFound',
  };
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 50px;
    font-family: Arial, sans-serif;
  }
  
  .not-found h1 {
    font-size: 100px;
    color: #f44336;
  }
  
  .not-found h2 {
    font-size: 24px;
    color: #555;
  }
  
  .not-found p {
    font-size: 18px;
    color: #777;
  }
  
  .back-home {
    font-size: 18px;
    color: #2196f3;
    text-decoration: none;
    margin-top: 20px;
    display: inline-block;
  }
  
  .back-home:hover {
    text-decoration: underline;
  }
  </style>