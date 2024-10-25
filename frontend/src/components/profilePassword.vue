<template>
    <h5 class="text-start">Security</h5>
    <!-- Show Password Change Form if user is eligible -->
    <div v-if="showPasswordChange">
        <div class="mt-4 shadow p-3 bg-body"
            :style="{ height: isEditing ? '150px' : '100px', transition: 'height 0.3s ease', backgroundColor: isEditing ? 'grey' : '' }">
            <h5 class="text-start">Password</h5>
            <div>
                <div v-if="isEditing && showEditingControls" class="edit-controls"
                    style="opacity: 1; transition: opacity 0.1s ease;">
                    <input type="text" v-model="newPassword" class="form-control" placeholder="Enter new password"
                        required />
                    <button class="btn btn-secondary mt-2 me-1" @click="cancelEdit">Cancel</button>
                    <button class="btn btn-primary mt-2" @click="changePassword">Save</button>
                </div>

                <div v-else class="d-flex justify-content-between align-items-start">
                    <div class="">*******</div>
                    <div class=""><button class="btn" @click="editName"><strong>Edit</strong></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3 shadow p-3 bg-body">
            <h5 class="text-start">Danger Zone</h5>
            <button class="btn btn-danger" @click="deleteAccount()">Delete Account</button>
        </div>
    </div>
    <!-- Show Google Auth notice if user is logged in via Google -->
    <div v-else>
        <div class="mt-4 shadow p-3 bg-body">
            <p class="text-muted">Modifying security settings are not available for Google Auth users.</p>
            <p><img width="150px" height="auto" src="../assets/googleAuth.png"></p>
        </div>
    </div>
</template>


<script>
import { getAuth, updatePassword, deleteUser } from 'firebase/auth';
import { getDatabase, ref, get, remove } from 'firebase/database';

export default {
    data() {
        return {
            displayName: undefined,
            email: undefined,
            newPassword: '',  // Field to store the new password
            showPasswordChange: false,  // Controls visibility of password change section
            isEditing: false,
            showEditingControls: false,
        };
    },
    methods: {
        // Method to change the user's password
        async changePassword() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    await updatePassword(user, this.newPassword);
                    alert('Password updated successfully!');
                    this.newPassword = '';  // Clear the password input
                } catch (error) {
                    console.error('Error updating password:', error.message);
                    if (error.message.includes('auth/requires-recent-login')) {
                        alert('Please log in again to change your password.');
                    } else {
                        alert('Error updating password: ' + error.message);
                    }
                }
            } else {
                alert('No user is logged in.');
            }
        },

        async deleteAccount() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    // Delete user profile data from Realtime Database
                    const db = getDatabase();
                    const profileRef = ref(db, 'users/' + user.uid);
                    await remove(profileRef);

                    // Delete the user from Firebase Authentication
                    await deleteUser(user);

                    alert('Account deleted successfully!');
                    this.$router.push('/');

                } catch (error) {
                    console.error('Error deleting account:', error.message);
                    if (error.message.includes('auth/requires-recent-login')) {
                        alert('Please log in again to delete your account.');
                    } else {
                        alert('Error deleting account: ' + error.message);
                    }
                }
            } else {
                alert('No user is logged in.');
            }
        },

        // Other methods (e.g., saveName, cancelEdit, etc.)
        editName() {
            this.isEditing = true;  // toggle editing mode
            setTimeout(() => {
                this.showEditingControls = true;  // Show editing controls after 0.3 seconds
            }, 100); // 300 ms delay
        },

        cancelEdit() {
            this.isEditing = false;
            this.showEditingControls = false;
        },
    },
    mounted() {
        const auth = getAuth();
        const user = auth.currentUser;  // Get the current user

        if (user) {
            this.displayName = user.displayName || 'No name available';
            this.email = user.email;

            // Check if the user is authenticated via Google
            const isGoogleAuth = user.providerData.some(
                (provider) => provider.providerId === 'google.com'
            );

            // Allow password change only if the user is not logged in with Google
            this.showPasswordChange = !isGoogleAuth;

            // Fetch user profile from the database
            const db = getDatabase();
            const profileRef = ref(db, 'users/' + user.uid);

            get(profileRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.displayName = data.displayName || 'No name available';
                    this.email = data.email || 'No email available';
                    this.mobileNumber = data.mobileNumber;
                } else {
                    console.log('No profile data found for user.');
                }
            });
        } else {
            console.log('No user is currently logged in.');
        }
    },
};
</script>



<style></style>
