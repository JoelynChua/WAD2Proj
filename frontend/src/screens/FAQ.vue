<template>
  <div class="container-fluid">
    <div class="faq">
      <h1>Frequently Asked Questions</h1>
      <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
        <button @click="toggleAccordion(index)" class="accordion">
          {{ faq.question }}
        </button>
        <div v-show="activeIndex === index" class="panel">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FAQ",
  data() {
    return {
      activeIndex: null,
      faqs: [
        { question: "What is Activity.ai?", answer: "Activity.ai is a platform for anyone to host their events on our site completely free-of-charge" },
        { question: "How do I create an account?", answer: "Simply navigate to the Sign-Up page by clicking on the top right button" },
        { question: "Is my personal information secure?", answer: "Yes, we take your privacy seriously. We use industry-standard Authentication and storage service provided by Google" },
        { question: "Can I share my itinerary with others?", answer: "Absolutely! Once you’ve created an itinerary, just click on share and key in the email of your friend's account" },
        { question: "What should I do if I encounter issues?", answer: "If you have any problems or questions, feel free to contact our customer service at wad2proj@gmail.com" }
      ]
    };
  },
  methods: {
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  }
};
</script>

<style scoped>
.faq {
  width: 80%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  line-height: 1.6;
  font-family: Arial, sans-serif;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
  color: #000000;
  font-weight: 600;
}

/* Accordion Button Styling */
.accordion {
  width: 100%;
  background: rgb(225, 225, 225);
  color: #000000;
  cursor: pointer;
  padding: 18px;
  text-align: left;
  font-size: 1.1em;
  border: none;
  border-radius: 5px;
  outline: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-bottom: 10px;
}

.accordion:hover {
  background: linear-gradient(45deg, #d7d7d7, #525252);
  transform: scale(1.02);
}

/* Panel Styling (Answer Section) */
.panel {
  padding: 15px;
  background-color: #f9f9f9;
  /* Lighter background for answer section */
  color: #333333;
  /* Darker color for readability */
  border-left: 4px solid #202020;
  margin-top: 5px;
  border-radius: 0 0 5px 5px;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.panel p {
  margin: 0;
  font-size: 1em;
  color: #333333;
  /* Ensure text color contrasts with background */
}
</style>
