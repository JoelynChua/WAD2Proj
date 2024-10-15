<template>
    <GoogleLogin :callback="callback" prompt />
</template>

<script setup>
// import { getGoogleClientId } from '../services/getGoogleClientId';
import { decodeCredential } from 'vue3-google-login';

// let googleClientId;

// getGoogleClientId().then((clientId) => {
//     googleClientId = clientId;
//     app.use(vue3GoogleLogin, { clientId: googleClientId });
// });

const callback = (response) => {
    const userData = decodeCredential(response.credential);
    console.log('User Data:', userData);
};
</script>
