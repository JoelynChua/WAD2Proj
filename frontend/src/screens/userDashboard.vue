<template>
    <div>
        <h1>Welcome to the Dashboard</h1>
        <div v-if="userProfile">
            <p>Name: {{ userProfile.name }}</p>
            <p>Email: {{ userProfile.email }}</p>
            <img :src="userProfile.imageUrl" alt="Profile Picture" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'userDashboard',
    data() {
        return {
            userProfile: null,
            accessToken: '',
        };
    },
    mounted() {
        // Retrieve the saved credentials
        this.accessToken = localStorage.getItem('google_access_token');
        const profile = localStorage.getItem('google_profile');
        if (profile) {
            this.userProfile = JSON.parse(profile);
        }
    },
};
</script>
