<template>
    <div class="about-us-title">about us</div>
    <div class="about-us-secondary">FROM HUMBLE BEGINNINGS TO SHARK TANK</div>
    <section class="about-us">
      <div class="about-us__container">
        <!-- Left Column for Heading -->
        <div class="about-us__heading">
          <h1>
            <img src="../assets/logo.png" width="200px" height="auto">
          </h1>
        </div>
  
        <!-- Right Column for Description -->
        <div class="about-us__description">
          <p>In 2024, Activity.ai opened as a humble online activity ecommerce site out of SMU SCIS SR 2-1.
            Founded by a group of thrill-seekers, our site seeked to be the go-to site for people from all around the world
            to find amazing activities to participate.
          </p>

          <p>Activity Finder was created to make discovering and experiencing activities easier, 
            more exciting, and tailored to your lifestyle. From thrilling outdoor adventures and scenic nature walks to unique local workshops and popular attractions, 
            we bring together a curated list of experiences that cater to everyone—from curious locals to adventurous travelers.</p>

          <p>As previously featured on Shark Tank, we successfully raised a total of $14.32 from Mark Cuban for 10% of our company.
            We strive to become one of the world's largest activity sites ahead of Brazeers and Klook.
          </p>
        </div>
      </div>
    </section>
    <div id="aboutUsfooter" class="text-center p-lg-5 p-0">
        <img src="../assets/aboutus.png">
    </div>
  </template>
  
  <script>
  export default {
    name: "aboutUs",
  };
  </script>
  
  <style scoped>
  #aboutUsfooter {
    text-align: end;
  }

  #aboutUsfooter img {
    height: 100px;
    width: auto;
  }

  .about-us-title {
    padding-top: 100px;
    font-size: 32px;
    font-weight: bold;
  }

  .about-us-secondary {
    padding-top: 30px;
    color: rgb(207, 89, 59)
  }

  .about-us {
    display: flex;
    justify-content: center;
    padding: 4rem 2rem;
  }
  
  .about-us__container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    padding-top: 20px;
    max-width: 1200px;
    gap: 2rem;
    align-items: center;
  }
  
  .about-us__heading h1 {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.2;
    color: #1c3a72; /* Dark blue color */
  }
  
  .about-us__heading span {
    color: #0047ab; /* Blue color for emphasized text */
  }
  
  .about-us__description {
    color: #666; /* Gray text color */
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .about-us__description p {
    margin-bottom: 1rem;
  }
  </style>
  