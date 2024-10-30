<template>
    <div>
        <!-- Conditionally render profile or sign-up components based on firsttime status -->
        <template v-if="!firsttime">
            <profilePage />
        </template>
        <template v-else>
            <profileSignUp />
        </template>
    </div>
</template>

<script>
import profileSignUp from "@/components/profileSignUp.vue"; // Ensure this matches the filename
import profilePage from "@/components/profilePage.vue";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import { ref as vueRef } from 'vue';

export default {
    data() {
        return {
            firsttime: false,
            displayName: undefined,
            email: undefined,
            photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png", // Default profile image
            showPasswordChange: false,
            isFormVisible: false,
            cardNumber: '',
            cardHolder: '',
            expiryDate: '',
            cvv: '',
            isEditing: false,
            editedName: '',
            newsletter: vueRef(1),
            value: "",
            reminders: "",
            promotions: "",
            mobileNumber: undefined,
        }
    },
    components: {
        profileSignUp, // Ensure this matches the filename
        profilePage,
    },
    methods: {
        editName() {
            this.editedName = this.displayName;  // Set initial value for editing
            this.isEditing = true;
        },
        saveName() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const db = getDatabase();
                const profileRef = ref(db, 'users/' + user.uid);

                update(profileRef, { displayName: this.editedName })
                    .then(() => {
                        this.displayName = this.editedName;
                        this.isEditing = false;
                        console.log('Name updated successfully!');
                    })
                    .catch((error) => {
                        console.error('Error updating name:', error);
                    });
            }
        },
        cancelEdit() {
            this.isEditing = false;
        },
        togglePaymentForm() {
            this.isFormVisible = !this.isFormVisible;
        },
        submitPaymentMethod() {
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
            this.isFormVisible = false;
        }
    },
    mounted() {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            this.displayName = user.displayName || "No name available";
            this.email = user.email;
            this.photoURL = user.photoURL || this.photoURL;

            const isGoogleAuth = user.providerData.some(
                (provider) => provider.providerId === 'google.com'
            );

            this.showPasswordChange = !isGoogleAuth;

            const db = getDatabase();
            const profileRef = ref(db, 'users/' + user.uid);

            get(profileRef).then((snapshot) => {
                if (snapshot.exists()) {
                    this.firsttime = false;
                    const data = snapshot.val();
                    this.displayName = data.displayName || 'No name available';
                    this.email = data.email || 'No email available';
                    this.photoURL = data.photoURL || this.photoURL;
                    this.mobileNumber = data.mobileNumber;
                } else {
                    this.firsttime = true;
                    console.log("No profile data found for user.");
                }
            });
        } else {
            console.log("No user is currently logged in.");
        }
    },
}
</script>

<style scoped>
#profilenav {
    background-color: #ffffff;
    border-radius: 10px;
}

#profile {
    padding: 15px;
}

#profilenav .nav-item {
    margin-bottom: 10px;
}

#profilenav .nav-link {
    padding: 10px 15px;
    width: 100%;
    color: #000;
}

#verticalnav .nav-link.active {
    background-color: #e0e0e0 !important;
    color: #000 !important;
}

#verticalnav .nav-link:hover {
    background-color: #f8f9fa;
    color: #000;
}

@media (max-width: 768px) {
    #profilenav {
        margin-left: 0;
        margin-top: 0;
    }

    #profile {
        margin-top: 10px;
    }
}
</style>
