<template>
    <div class="about-us">
      <h1>About Us</h1>
      <p>
        Welcome to <strong>[Project Name]</strong> – your go-to platform for planning memorable outings around Singapore! We are a team of five passionate university students from Singapore Management University, united by our love for exploring and creating meaningful experiences with friends and family.
      </p>
      <p>
        As students, we understand how challenging it can be to organize fun, seamless outings amidst the hustle of everyday life. Our project was born from a shared vision: to create a platform that makes planning social gatherings simple, efficient, and enjoyable for everyone.
      </p>
      <h2>Our Mission</h2>
      <p>
        We hope <strong>[Project Name]</strong> will make it easier for Singaporeans to discover the best places, events, and activities that the city has to offer. Whether you’re planning a simple day out, a unique event, or a complex itinerary, our platform helps streamline every aspect of your experience. From budgeting tools and itinerary creation to customized recommendations, we’re here to help make every outing as memorable as possible.
      </p>
      <h2>Why We Created This Platform</h2>
      <p>
        The inspiration for <strong>[Project Name]</strong> came from our own experiences. Too often, we found ourselves struggling to coordinate plans, manage expenses, and discover new spots around the city. We wanted to change that by providing a one-stop solution that simplifies the planning process. Our platform combines search functionality, itinerary creation, expense tracking, and more—so you can focus on what matters most: enjoying the day with friends and family.
      </p>
      <p>
        Thank you for visiting <strong>[Project Name]</strong>! We’re thrilled to help you make every outing a success and can’t wait to see how our platform enhances your social experiences in Singapore.
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: "AboutUs",
  };
  </script>
  
  <style scoped>
  .about-us {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    line-height: 1.6;
    font-family: Arial, sans-serif;
    color: #fff;
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  h1 {
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 20px;
    color: #fff;
    background: -webkit-linear-gradient(45deg, #e1bee7, #bbdefb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  h2 {
    color: #e0e0e0;
    margin-top: 30px;
    font-size: 1.5em;
    background: -webkit-linear-gradient(45deg, #cba6ff, #8ec6fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    margin-bottom: 1em;
    font-size: 1.1em;
    color: #fff;
  }
  
  strong {
    color: #ffe082; /* Light yellow to make key phrases stand out */
  }
  
  .about-us {
    transition: background 0.3s ease;
  }
  
  .about-us:hover {
    background: linear-gradient(135deg, #7f53ac, #4f83cc);
  }
  </style>
  
  