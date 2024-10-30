<template>
    <div id="app">
        <collapsible-navibar @toggle-modal="showModal = true" />
        
        <router-view @toggle-modal="showModal = true"></router-view>

        <app-footer /> <!-- Include your footer here -->

        <div v-if="showModal" class="popup-overlay">
            <div class="popup-content">
                <button type="button" class="btn-close" @click="closeModal" aria-label="Close">X</button>
                <LoginForm v-if="isLogin" @close-modal="closeModal" @switch-to-signup="isLogin = false" />
                <SignupForm v-else @close-modal="closeModal" @switch-to-login="isLogin = true" />
            </div>
        </div>
    </div>
</template>

<script>
// Import necessary components
import collapsibleNavibar from './components/naviBar.vue';
import LoginForm from './components/LoginForm.vue';
import SignupForm from './components/SignUpForm.vue';
import AppFooter from './components/AppFooter.vue'; // Import your footer component

export default {
    data() {
        return {
            showModal: false,
            isLogin: true, // Controls whether login or signup is shown in the modal
        };
    },
    components: {
        collapsibleNavibar,
        LoginForm,
        SignupForm,
        AppFooter // Register your footer component
    },
    methods: {
        closeModal() {
            this.showModal = false;
            this.isLogin = true; // Reset to login view when modal closes
        }
    }
};
</script>

<style scoped>
.popup-overlay {
    background: rgba(0, 0, 0, 0.5); /* Dark background with transparency */
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
}

.popup-content {
    background: none; /* No background for the outer box */
    backdrop-filter: blur(10px); /* Adds the glass effect */
    border-radius: 10px; /* Optional: rounded corners */
    padding: 10px; /* No padding around the form */
    color: #c9c9c9; /* Text color for better visibility */
    position: relative; /* Relative positioning to allow absolute positioning of the close button */
}

/* Close button styling */
.btn-close {
    position: absolute; /* Positioning the close button */
    top: 15px; /* Adjust top padding as needed */
    right: 15px; /* Adjust right padding as needed */
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #fff; /* Close button color */
    opacity: 0.8; /* Slightly transparent for effect */
    z-index: 1060; /* Ensure it appears above other content */
}

.btn-close:hover {
    opacity: 1; /* Fully visible on hover */
}
</style>

