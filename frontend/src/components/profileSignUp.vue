<template>
    <div class="container rounded bg-white mt-5 mb-5">
        <div class="row">
            <div class="col-md-3 border-right">
                <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                    <img class="rounded-circle mt-5" width="150px"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png">
                    <span class="text-black-50 mt-4">{{ email }}</span>
                </div>
            </div>
            <div class="col-md-5 border-right">
                <div class="p-3 py-5">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="text-right">Profile Setup</h4>
                    </div>
                    <div class="row mt-2 text-start">
                        <div class="col-md-6">
                            <label class="labels">Name</label>
                            <input type="text" class="form-control" placeholder="" v-model="displayName">
                        </div>
                        <div class="col-md-6">
                            <label class="labels">Mobile Number</label>
                            <input type="text" class="form-control" placeholder="" v-model="mobileNumber">
                        </div>
                        <div>
                            <label for="dob">Date of Birth:</label>
                            <input type="date" class="form-control" id="dob" v-model="dateOfBirth" />
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Address Line 1</label>
                            <input type="text" class="form-control" v-model="address1">
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Address Line 2</label>
                            <input type="text" class="form-control" v-model="address2">
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Postal Code</label>
                            <input type="text" class="form-control" placeholder="" v-model="postcode">
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Email ID</label>
                            <input type="text" class="form-control" placeholder="" v-model="email" disabled>
                        </div>
                    </div>
                    <!-- <div class="row mt-3">
                        <div class="col-md-6">
                            <label class="labels">Country</label>
                            <select class="form-control" v-model="country">
                                <option value="" disabled>Select a country</option>
                                <option v-for="country in countries" :key="country.code" :value="country.name">
                                    {{ country.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="labels">State/Region</label>
                            <input type="text" class="form-control" placeholder="" v-model="region">
                        </div>
                    </div> -->
                    <div class="mt-5 text-center">
                        <button class="btn btn-primary profile-button" type="button" @click="saveProfile">Save
                            Profile</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    data() {
        return {
            displayName: '',
            mobileNumber: '',
            dateOfBirth: '',
            address1: '',
            address2: '',
            postcode: '',
            email: '',
            country: '',
            countries: [], // Initialize the countries array
            user: null, // Add user to data
        };
    },
    methods: {
        saveProfile() {
            // Ensure user is defined before trying to save
            if (!this.user) {
                alert('No user is currently logged in.');
                return;
            }

            // Get the Firebase Realtime Database instance
            const db = getDatabase();

            // Create a reference for the user profile data
            const profileRef = ref(db, 'users/' + this.user.uid);

            // Write data to the reference
            set(profileRef, {
                displayName: this.displayName,
                mobileNumber: this.mobileNumber,
                address1: this.address1,
                address2: this.address2,
                postcode: this.postcode,
                email: this.email,
                country: this.country,
                dateofBirth: this.dateofBirth,
            })
                .then(() => {
                    alert('Profile saved successfully!');
                })
                .catch((error) => {
                    console.error('Error saving profile:', error);
                    alert('An error occurred while saving the profile.');
                });
        },
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user; // Save user to the component state
                this.email = user.email; // Set email from user object

                const isGoogleAuth = user.providerData.some(
                    (provider) => provider.providerId === 'google.com'
                );

                this.showPasswordChange = !isGoogleAuth;
            } else {
                console.log("No user is currently logged in.");
            }
        });
    },
};
</script>


<style lang="scss" scoped>
/* Your existing styles */
</style>
