<template>
    <div class="container rounded bg-white mt-5 mb-5" style="max-width: 1100px;">
        <div class="row justify-content-center shadow">
            <div class="col-md-3 border-right">
                <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                    <img class="rounded-circle mt-5" width="150px"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png">
                    <span class="text-black-50 mt-4">{{ email }}</span>
                </div>
            </div>
            <div class="col-md-8 col-lg-7 border-right p-0">
                <div class="p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="text-right">Profile Setup</h4>
                    </div>
                    <div class="row mt-2 text-start">
                        <div class="col-md-6">
                            <label class="labels">Name <span class="required">*</span></label>
                            <input type="text" class="form-control" placeholder="" v-model="displayName">
                        </div>
                        <div class="col-md-6">
                            <label class="labels">Mobile Number <span class="required">*</span></label>
                            <input type="text" class="form-control" placeholder="" v-model="mobileNumber">
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Email ID <span class="required">*</span></label>
                            <input type="text" class="form-control" placeholder="" v-model="email" disabled>
                        </div>
                        <div class="col-md-12">
                            <label for="dob">Date of Birth: <span class="required">*</span></label>
                            <a-date-picker class="form-control" v-model:value="dob" width="100%" />

                        </div>
                        <div class="col-md-12">
                            <label class="labels">Address Line 1 <span class="required">*</span></label>
                            <input type="text" class="form-control" v-model="address1">
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Address Line 2</label>
                            <input type="text" class="form-control" v-model="address2">
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Postal Code <span class="required">*</span></label>
                            <input type="text" class="form-control" placeholder="" v-model="postcode">
                        </div>
                        <div class="col-md-12">
                            <label class="labels">Country <span class="required">*</span></label>
                            <country-select class="form-control" v-model="country" :country="country" topCountry="SG" />
                        </div>
                    </div>
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
            dob: null,
            address1: '',
            address2: '',
            postcode: '',
            email: '',
            country: '',
            user: null,
        };
    },
    methods: {
        validateProfile() {
            const mobilePattern = /^[89]\d{7}$/;


            if (!this.displayName) {
                alert("Name is required");
                return false;
            }

            if (!mobilePattern.test(this.mobileNumber)) {
                alert("Mobile number must start with 8 or 9 and be followed by 7 digits.");
                return false;
            }

            if (!this.dob) {
                alert("Date of Birth is required");
                return false;
            }

            const dobDate = new Date(this.dob);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const monthDifference = today.getMonth() - dobDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }

            if (age < 13) {
                alert("You must be at least 13 years old.");
                return false;
            }

            if (!this.address1) {
                alert("Address Line 1 is required");
                return false;
            }

            if (!this.postcode) {
                alert("Postal code is required");
                return false;
            }

            if (!this.country) {
                alert("Country is required");
                return false;
            }

            return true; // All validations passed
        },
        saveProfile() {
            // Debugging: Check the date of birth

            if (!this.validateProfile()) {
                return; // Exit if validation fails
            }

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
                dateOfBirth: this.dob.toDate().toString(),
                balance: 0,
                userType: 'customer',
                preferences: {
                    promotions: false,     // Default to false
                    reminders: false,      // Default to false
                    newsletter: 3          // Default to weekly (assuming 3 represents weekly)
                },
                events: [],

            })
                .then(() => {
                    location.reload();
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
                this.user = user;
                this.email = user.email;
            } else {
                console.log("No user is currently logged in.");
            }
        });
    },
};
</script>

<style lang="scss" scoped>
.required {
    color: red;
}
</style>
