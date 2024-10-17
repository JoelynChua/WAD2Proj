<template>
    <template v-if="!this.firsttime">
        <div class="container-fluid bg-warning vh-100 d-flex flex-column">
            <div class="row h-100">
                <div id="profilenav" class="col-12 bg-warning col-md-3 mt-3 ms-md-3 p-3">
                    <div class="card p-2">
                        <div>
                            <img v-if="this.photoURL"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png"
                                class="rounded-circle mt-3 mb-3"
                                style="width: 100px; height: 100px; object-fit: cover;">
                        </div>

                        <ul id="verticalnav" class="nav flex-column nav-pills mt-3" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="main-tab" data-bs-toggle="pill" href="#main" role="tab"
                                    aria-controls="main" aria-selected="true">
                                    Profile
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="payment-tab" data-bs-toggle="pill" href="#payment" role="tab"
                                    aria-controls="payment" aria-selected="false">
                                    Payment Methods
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="security-tab" data-bs-toggle="pill" href="#security" role="tab"
                                    aria-controls="security" aria-selected="false">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="profile" class="col-12 col-md-8 mt-3">
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="main" role="tabpanel" aria-labelledby="main-tab">
                            <div class="card">
                                <h5 class="card-header text-start">User Details</h5>
                                <div class="card-body">
                                    <h5 class="card-title text-start">Name</h5>
                                    <p class="card-text text-start">{{ name }}</p>
                                    <h5 class="card-title text-start">Email</h5>
                                    <p class="card-text text-start">{{ email }}</p>
                                </div>
                            </div>
                            <div class="card mt-2">
                                <h5 class="card-header text-start">Communications</h5>
                                <div class="card-body">
                                    <h5 class="card-title">Special title treatment</h5>
                                    <p class="card-text">With supporting text below as a natural lead-in to additional
                                        content.</p>
                                    <a href="#" class="btn btn-primary">Go somewhere</a>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="payment" role="tabpanel" aria-labelledby="payment-tab">
                            <div class="card">
                                <h5 class="card-header text-start">Payment Methods</h5>
                                <div class="card-body">
                                    <div v-if="!isFormVisible">
                                        <p class="card-text">Add, remove, or manage your payment methods here.</p>
                                        <button @click="togglePaymentForm" class="btn btn-primary">Add Payment
                                            Method</button>
                                    </div>

                                    <div v-if="isFormVisible" class="mt-3">
                                        <form @submit.prevent="submitPaymentMethod" class="text-start">
                                            <div class="mb-3">
                                                <label for="cardNumber" class="form-label">Card Number</label>
                                                <input type="text" class="form-control" v-model="cardNumber"
                                                    placeholder="Enter card number" required />
                                            </div>
                                            <div class="mb-3">
                                                <label for="cardHolder" class="form-label">Card Holder Name</label>
                                                <input type="text" class="form-control" v-model="cardHolder"
                                                    placeholder="Enter card holder name" required />
                                            </div>
                                            <div class="container-fluid ml-0 p-0">
                                                <div class="row">
                                                    <div class="mb-3 col-4">
                                                        <label for="expiryDate" class="form-label">Expiry Date</label>
                                                        <input type="text" class="form-control" v-model="expiryDate"
                                                            placeholder="MM/YY" required />
                                                    </div>
                                                    <div class="mb-3 col-4">
                                                        <label for="cvv" class="form-label">CVV</label>
                                                        <input type="text" class="form-control" v-model="cvv"
                                                            placeholder="Enter CVV" required />
                                                    </div>
                                                    <div class="col-4"></div>
                                                </div>
                                            </div>
                                            <button type="submit" class="btn btn-success">Save Payment Method</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="security" role="tabpanel" aria-labelledby="security-tab">
                            <div class="card">
                                <h5 class="card-header text-start">Security</h5>
                                <div class="card-body">
                                    <p class="card-text">Manage your account security settings here.</p>
                                    <div v-if="showPasswordChange">
                                        <a href="#" class="btn btn-primary mt-2">Change Password</a>
                                    </div>
                                    <div v-else>
                                        <p class="text-muted">Password change is not available for Google Auth users.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <profileSignUp />
    </template>
</template>

<script>
import profileSignUp from "@/components/profileSignUp.vue";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

export default {
    data() {
        return {
            firsttime: false,
            name: undefined,
            email: undefined,
            photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png", // Default image
            showPasswordChange: false,
            isFormVisible: false,
            cardNumber: '',
            cardHolder: '',
            expiryDate: '',
            cvv: '',
        }
    },
    components: {
        profileSignUp,
    },
    methods: {
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
                    this.firsttime = false;

                    const data = snapshot.val();
                    this.name = data.displayName || 'No name available';
                    this.email = data.email || 'No email available';
                    this.photoURL = data.photoURL || this.photoURL;
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
