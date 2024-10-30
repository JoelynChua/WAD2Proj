<template>
    <div>
        <!-- Button to open Google login modal -->
        <button @click="showModal = true" class="btn btn-primary">Login with Google</button>

        <!-- Google login modal -->
        <div v-if="showModal" class="modal d-block" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Sign in with Google</h5>
                        <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <button @click="googleSignIn" class="btn bg-light">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" height="20px" width="20px">
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, provider, signInWithPopup } from '../firebase/firebaseClientConfig';

const router = useRouter();
const showModal = ref(false); // Control modal visibility

const googleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User logged in:', user);

        // Store the user UID in sessionStorage
        sessionStorage.setItem('uid', user.uid);
        sessionStorage.setItem('displayName', user.displayName);

        // Navigate after successful login
        router.push('/');
        showModal.value = false; // Close the modal after login
    } catch (error) {
        console.error('Error during Google sign-in:', error.message);
        alert(error.message);
    }
};
</script>

<style scoped>
.modal {
    background: rgba(0, 0, 0, 0.5);
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
.modal-dialog {
    max-width: 400px;
}
</style>

