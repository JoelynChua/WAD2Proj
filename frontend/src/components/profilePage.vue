<template>
    <div class="container-fluid d-flex flex-column">
        <div class="row h-100 justify-content-center">
            <div id="profilenav" class="col-12 col-md-3 col-lg-2 mt-3 ms-md-3 p-3 pe-lg-0">
                <div class="p-2">
                    <div>
                        <img v-if="this.photoURL"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png"
                            class="rounded-circle mt-3 mb-3" style="width: 100px; height: 100px; object-fit: cover;">
                    </div>

                    <ul id="verticalnav" class="nav flex-column nav-pills mt-3" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="main-tab" data-bs-toggle="pill" href="#main" role="tab"
                            aria-controls="main" aria-selected="true">
                                <i class="fi fi-rs-user"></i>
                                Profile
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="booking-tab" data-bs-toggle="pill" href="#booking" role="tab"
                                aria-controls="security" aria-selected="false">
                                <i class="fi fi-rs-reservation-smartphone"></i>
                                Bookings
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="security-tab" data-bs-toggle="pill" href="#security" role="tab"
                                aria-controls="security" aria-selected="false">
                                <i class="fi fi-rr-shield-keyhole"></i>
                                Security
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="d-none d-lg-block col-lg-1 p-0" style="max-width: 75px"></div>
            <div id="profile" class="col-12 col-md-8 col-lg-6 mt-3 ps-lg-0">
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="main" role="tabpanel" aria-labelledby="main-tab">
                        <h5 class="text-start">User Details</h5>
                        <div class="mt-4 shadow p-3 bg-body hover-effect"
                            :style="{ height: isEditing ? '170px' : '100px', transition: 'height 0.3s ease', 'background-color': isEditing ? 'grey' : 'yellow' }">

                            <h5 class="text-start">Name</h5>

                            <!-- If editing is true, show input field to change name -->
                            <div v-if="isEditing && showEditingControls" class="edit-controls"
                                style="opacity: 1; transition: opacity 0.1s ease;">
                                <input type="text" v-model="editedName" class="form-control" />
                                <div class="d-flex mt-3">
                                    <button class="btn-cancel" @click="cancelEdit">Cancel</button>
                                    <button class="btn-save" @click="saveName">Save</button>
                                </div>
                            </div>

                            <!-- If not editing, display the name and edit button -->
                            <div v-else class="d-flex justify-content-between align-items-start">
                                <div class="">{{ displayName }}</div>
                                <div class=""><button class="btn" @click="editName"><strong>Edit</strong></button>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 shadow p-3 bg-body hover-effect">
                            <h5 class="text-start">Email</h5>
                            <p class="text-start">{{ email }}</p>
                        </div>
                        <div class="mt-3 shadow p-3 bg-body hover-effect">
                            <h5 class="text-start">Phone number</h5>
                            <p class="text-start">{{ mobileNumber }}</p>
                        </div>

                        <h5 class="mt-5 text-start">Communications</h5>

                        <div id="webselector" class="mt-3 shadow p-3 bg-body hover-effect">
                            <h5 class="text-start p-2">Newsletter</h5>
                            <a-radio-group v-model:value="newsletter">
                                <div class="d-flex justify-content-around p-2 gap-5">
                                    <a-radio :value="1">Daily</a-radio>
                                    <a-radio :value="2">Twice a week</a-radio>
                                    <a-radio :value="3">Weekly</a-radio>
                                    <a-radio :value="4">Never</a-radio>
                                </div>
                            </a-radio-group>
                        </div>
                        <div class="mt-3 shadow p-4 bg-body hover-effect">
                            <div class="d-flex justify-content-between align-items-start">
                                <div><b>I would like to receive booking reminders</b></div>
                                <div><a-switch v-model:checked="reminders" /></div>
                            </div>
                        </div>
                        <div class="mt-3 shadow p-4 bg-body hover-effect">
                            <div class="d-flex justify-content-between align-items-start">
                                <div><b>I would like to receive emails about promotions</b></div>
                                <div><a-switch v-model:checked="promotions" /></div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="booking" role="tabpanel" aria-labelledby="booking-tab">
                        <Bookings />
                    </div>

                    <div class="tab-pane fade" id="security" role="tabpanel" aria-labelledby="security-tab">
                        <passwordChange />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
import { ref as vueRef } from 'vue';
import passwordChange from "@/components/profilePassword.vue";
import Bookings from '@/components/profileBookings.vue'


export default {
    data() {
        return {
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
            showEditingControls: false,
            balance: undefined,
        }
    },
    components: {
        passwordChange,
        Bookings
    },
    methods: {
        editName() {
            this.editedName = this.displayName;  // set the initial value to the current name
            this.isEditing = true;  // toggle editing mode
            setTimeout(() => {
                this.showEditingControls = true;  // Show editing controls after 0.3 seconds
            }, 100); // 300 ms delay
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
            this.showEditingControls = false;  // Hide editing controls
        },
        topup(amount) {
            this.balance += amount;

            const auth = getAuth();
            const user = auth.currentUser;

            const db = getDatabase();
            const profileRef = ref(db, 'users/' + user.uid);

            update(profileRef, { balance: this.balance })

        },
        updateNewsletter(value) {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const db = getDatabase();
                const newsletterRef = ref(db, `users/${user.uid}/preferences`);

                update(newsletterRef, { newsletter: value })
                    .then(() => {
                        console.log("Newsletter preference updated successfully!");
                    })
                    .catch((error) => {
                        console.error("Failed to update newsletter preference:", error);
                    });
            }
        },
        updateReminders(value) {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const db = getDatabase();
                const remindersRef = ref(db, `users/${user.uid}/preferences`);
                update(remindersRef, { reminders: value })
                    .then(() => {
                        console.log("Reminders preference updated successfully!");
                    })
                    .catch((error) => {
                        console.error("Failed to update reminders preference:", error);
                    });
            }
        },

        updatePromotions(value) {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const db = getDatabase();
                const promotionsRef = ref(db, `users/${user.uid}/preferences`);
                update(promotionsRef, { promotions: value })
                    .then(() => {
                        console.log("Promotions preference updated successfully!");
                    })
                    .catch((error) => {
                        console.error("Failed to update promotions preference:", error);
                    });
            }
        }

    },
    mounted() {
        const auth = getAuth();
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
                    const data = snapshot.val();
                    this.displayName = data.displayName || 'No name available';
                    this.email = data.email || 'No email available';
                    this.photoURL = data.photoURL || this.photoURL;
                    this.mobileNumber = data.mobileNumber
                    this.balance = data.balance
                    this.newsletter = data.preferences.newsletter
                    this.reminders = data.preferences.reminders
                    this.promotions = data.preferences.promotions
                } else {
                    // No profile data available
                    console.log("No profile data found for user.");
                }
            })
        } else {
            console.log("No user is currently logged in."); // Log if no user is found
        }
    },
    watch: {
        newsletter(newVal) {
            this.updateNewsletter(newVal);
        },
        reminders(newVal) {
            this.updateReminders(newVal);
        },
        promotions(newVal) {
            this.updatePromotions(newVal);
        },
    }
}
</script>


<style scoped>
.form-control{
    border-radius: 0px;
}

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
    text-align: left
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

    #webselector {
        display: none;
    }

    #profile {
        margin-top: 10px;
        /* Add margin between navbar and profile section */
    }
}

.hover-effect {
    transition: color 0.3s ease, box-shadow 0.3s ease; /* Smooth transition */
}

.hover-effect:hover {
    box-shadow: 0px 2px 4px 4px rgba(196, 196, 196, 0.7) !important; /* Increased values for a stronger shadow */
}

.btn-cancel {
    color: #3b82f6; /* Blue color for text */
    background: none;
    border: none;
    font-weight: bold;
    margin: 0px 5px;
    padding: 13px 40px;
    border-radius: 3px; /* Rounded corners */
}

.btn-cancel:hover {
    background-color: #7dabf6;
    color: white;
}

.btn-save {
    background-color: #3b82f6; /* Blue background */
    color: white;
    border: none;
    padding: 13px 44px;
    border-radius: 3px; /* Rounded corners */
    font-weight: bold;
    margin: 0px 5px;

}

.btn-save:hover {
    background-color: #7dabf6; /* Blue color for text */
    color: white;
    border: none;
    font-weight: bold;
}

</style>
