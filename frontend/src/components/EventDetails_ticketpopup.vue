<template>
    <div v-if="show" class="modal-overlay" @click.self="closePopup">
      <div class="modal-content">
        <button class="close-button" @click="closePopup">&times;</button>
        <h3>{{ title }}</h3>
        <p class="message">{{ message }}</p>
        <div class="button-container">
          <button class="action-button" @click="closePopup">OK</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TicketPopup',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: 'Notice'
      },
      message: {
        type: String,
        required: true
      }
    },
    methods: {
      closePopup() {
        this.$emit('close');
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  .message {
    margin: 20px 0;
    color: #333;
    font-size: 16px;
  }
  
  .button-container {
    margin-top: 20px;
  }
  
  .action-button {
    background: linear-gradient(90deg, #764ba2, #667eea) !important;
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }
  
  .action-button:hover {
    background-color: #9c7da1;
  }
  </style>