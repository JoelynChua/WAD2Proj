<template>
    <template v-if="!this.firsttime">
        <profilePage />
    </template>
    <template v-else>
        <profileSignUp />
    </template>
</template>

<script>
import profileSignUp from "@/components/profileSignUp.vue";
import profilePage from "@/components/profilePage.vue"
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import { ref as vueRef } from 'vue';


export default {
    data() {
        return {
            firsttime: false,
            displayName: undefined,
            email: undefined,
            photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png", // Default image
            showPasswordChange: false,
            isFormVisible: false,
            cardNumber: '',
            cardHolder: '',
            expiryDate: '',
            cvv: '',
            isEditing: false,  // controls whether the user is editing the name
            editedName: '',  // stores the new name while editing
            newsletter: vueRef(1),
            value: "",
            reminders: "",
            promotions: "",
            mobileNumber: undefined,
        }
    },
    components: {
        profileSignUp,
        profilePage,
    },
    methods: {
        editName() {
            this.editedName = this.displayName;  // set the initial value to the current name
            this.isEditing = true;  // toggle editing mode
        },
        saveName() {

            const auth = getAuth();
            const user = auth.currentUser;

            const db = getDatabase();
            const profileRef = ref(db, 'users/' + user.uid);

            update(profileRef, { displayName: this.editedName })
                .then(() => {
                    // Successfully updated
                    this.displayName = this.editedName;  // Update the local name to reflect the change
                    this.isEditing = false;  // Exit edit mode
                    console.log('Name updated successfully!');
                })
                .catch((error) => {
                    console.error('Error updating name:', error);
                });
        },
        cancelEdit() {
            this.isEditing = false;  // cancel editing, revert to previous name
        },
        togglePaymentForm() {
            this.isFormVisible = !this.isFormVisible;
        },
        submitPaymentMethod() {
            // Here you would typically handle form submission, e.g., sending the data to your backend
            console.log('Payment Method Submitted:', {
                cardNumber: this.cardNumber,
                cardHolder: this.cardHolder,
                expiryDate: this.expiryDate,
                cvv: this.cvv,
            });

            // Reset form fields
            this.cardNumber = '';
            this.cardHolder = '';
            this.expiryDate = '';
            this.cvv = '';
            this.isFormVisible = false; // Optionally close the form after submission
        }
    },
    mounted() {
        const auth =  getAuth();
        const user = auth.currentUser; // Get the current user
        if (user) {
            this.name = user.displayName || "No name available";
            this.email = user.email;
            this.photoURL = user.photoURL || this.photoURL; // Only set if user has a photoURL

            const isGoogleAuth = user.providerData.some(
                (provider) => provider.providerId === 'google.com'
            );

            this.showPasswordChange = !isGoogleAuth;


            const db = getDatabase();
            const profileRef = ref(db, 'users/' + user.uid);

            get(profileRef).then((snapshot) => {
                if (snapshot.exists()) {
                    // If user profile exists,
                    this.firsttime = false;

                    const data = snapshot.val();
                    this.displayName = data.displayName || 'No name available';
                    this.email = data.email || 'No email available';
                    this.photoURL = data.photoURL || this.photoURL;
                    this.mobileNumber = data.mobileNumber
                } else {
                    // No profile data available
                    this.firsttime = true;
                    console.log("No profile data found for user.");
                }
            })
        } else {
            console.log("No user is currently logged in."); // Log if no user is found
        }
    },
}
</script>


<style>
#profilenav {
    background-color: #ffffff;
    border-radius: 10px;
}

/* Adjust padding for smaller screens */
#profile {
    padding: 15px;
}

/* Consistent spacing for all nav items */
#profilenav .nav-item {
    margin-bottom: 10px;
}

/* Nav link styles */
#profilenav .nav-link {
    padding: 10px 15px;
    width: 100%;
    color: #000;
}

#verticalnav .nav-link.active {
    background-color: #e0e0e0 !important;
    /* Slight grey color for the active tab */
    color: #000 !important;
}

#verticalnav .nav-link:hover {
    background-color: #f8f9fa;
    color: #000;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    #profilenav {
        margin-left: 0;
        /* Remove margin on small screens */
        margin-top: 0;
        /* Adjust margin on top for smaller devices */
    }

    #profile {
        margin-top: 10px;
        /* Add margin between navbar and profile section */
    }
}
</style>
