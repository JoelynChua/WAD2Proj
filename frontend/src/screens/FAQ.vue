<template>
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
  </template>
  
  <script>
  export default {
    name: "FAQ",
    data() {
      return {
        activeIndex: null,
        faqs: [
          { question: "What is [Project Name]?", answer: "[Project Name] is a platform..." },
          { question: "How do I create an account?", answer: "Simply navigate to the Sign-Up page..." },
          { question: "Is my personal information secure?", answer: "Yes, we take your privacy seriously..." },
          { question: "Can I share my itinerary with others?", answer: "Absolutely! Once you’ve created an itinerary..." },
          { question: "How do I track expenses for my outing?", answer: "[Project Name] provides a built-in expense tracking feature..." },
          { question: "How do I get event recommendations?", answer: "After you’ve set up your profile and preferences..." },
          { question: "What should I do if I encounter issues?", answer: "If you have any problems or questions..." }
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
    max-width: 800px;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 20px;
    line-height: 1.6;
    font-family: Arial, sans-serif;
    color: #fff;
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  h1 {
    text-align: center;
    font-size: 2em;
    margin-bottom: 20px;
    color: #fff;
    background: -webkit-linear-gradient(45deg, #e1bee7, #bbdefb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .accordion {
    width: 100%;
    background: linear-gradient(45deg, #7b4397, #dc2430);
    color: #fff;
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
    background: linear-gradient(45deg, #7a2da8, #a850c0);
    transform: scale(1.02);
  }
  
  .panel {
    padding: 15px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #e1e5f2;
    border-left: 4px solid #8a2be2;
    margin-top: 5px;
    border-radius: 0 0 5px 5px;
    transition: max-height 0.3s ease, padding 0.3s ease;
  }
  
  .panel p {
    margin: 0;
    font-size: 1em;
    color: #fff;
  }
  </style>
  