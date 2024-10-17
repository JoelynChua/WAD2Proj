<template>
    <div class="container-fluid bg-warning vh-100 d-flex flex-column">
        <div class="row h-100">
            <div id="profilenav" class="col-12 bg-warning col-md-3 mt-3 ms-md-3 p-3">
                <div class="card p-2">
                    <div>
                        <img 
                            v-if="this.photoURL" 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png"
                            class="rounded-circle mt-3 mb-3" 
                            style="width: 100px; height: 100px; object-fit: cover;">
                    </div>

                    <ul class="nav flex-column nav-pills mt-3" role="tablist">
                        <li class="nav-item">
                            <a 
                                class="nav-link active" 
                                id="main-tab" 
                                data-bs-toggle="pill" 
                                href="#main" 
                                role="tab" 
                                aria-controls="main" 
                                aria-selected="true">
                                Main Page
                            </a>
                        </li>
                        <li class="nav-item">
                            <a 
                                class="nav-link" 
                                id="payment-tab" 
                                data-bs-toggle="pill" 
                                href="#payment" 
                                role="tab" 
                                aria-controls="payment" 
                                aria-selected="false">
                                Payment Methods
                            </a>
                        </li>
                        <li class="nav-item">
                            <a 
                                class="nav-link" 
                                id="security-tab" 
                                data-bs-toggle="pill" 
                                href="#security" 
                                role="tab" 
                                aria-controls="security" 
                                aria-selected="false">
                                Security
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="profile" class="col-12 col-md-8 mt-3">
                <div class="tab-content">
                    <div 
                        class="tab-pane fade show active" 
                        id="main" 
                        role="tabpanel" 
                        aria-labelledby="main-tab">
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
                                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                <a href="#" class="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>

                    <div 
                        class="tab-pane fade" 
                        id="payment" 
                        role="tabpanel" 
                        aria-labelledby="payment-tab">
                        <div class="card">
                            <h5 class="card-header text-start">Payment Methods</h5>
                            <div class="card-body">
                                <p class="card-text">Add, remove, or manage your payment methods here.</p>
                                <a href="#" class="btn btn-primary">Add Payment Method</a>
                            </div>
                        </div>
                    </div>

                    <div 
                        class="tab-pane fade" 
                        id="security" 
                        role="tabpanel" 
                        aria-labelledby="security-tab">
                        <div class="card">
                            <h5 class="card-header text-start">Security</h5>
                            <div class="card-body">
                                <p class="card-text">Manage your account security settings here.</p>
                                <div v-if="showPasswordChange">
                                    <a href="#" class="btn btn-primary mt-2">Change Password</a>
                                </div>
                                <div v-else>
                                    <p class="text-muted">Password change is not available for Google Auth users.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAuth } from "firebase/auth";

export default {
    data() {
        return {
            name: undefined,
            email: undefined,
            photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png", // Default image
            showPasswordChange: false,
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

.nav-link.active {
    background-color: #e0e0e0 !important; /* Slight grey color for the active tab */
    color: #000 !important;
}

.nav-link:hover {
    background-color: #f8f9fa;
    color: #000;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    #profilenav {
        margin-left: 0; /* Remove margin on small screens */
        margin-top: 0; /* Adjust margin on top for smaller devices */
    }

    #profile {
        margin-top: 10px; /* Add margin between navbar and profile section */
    }
}
</style>
