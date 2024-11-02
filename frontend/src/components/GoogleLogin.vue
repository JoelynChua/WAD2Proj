<template>
    <div>
        <button @click="googleSignIn" class="btn bg-light">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" height="20px" width="20px">
            Google
        </button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Import useRouter from vue-router
import { auth, provider, signInWithPopup } from '../firebase/firebaseClientConfig';

const router = useRouter(); // Get the router instance

const googleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User logged in:', user);

        // Store the user UID in sessionStorage
        sessionStorage.setItem('uid', user.uid);
        sessionStorage.setItem('displayName', user.displayName);

        // Use router.push to navigate after successful login
        router.push('/');
    } catch (error) {
        console.error('Error during Google sign-in:', error.message);
        alert(error.message);
    }
};
</script>

<style scoped>
/* Add your button styles here */
</style>
