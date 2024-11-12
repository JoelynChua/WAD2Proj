import axiosInstance from '../utils/axiosInstance'; // Import your axios instance, if you have one configured
// const cloudURL = "http://localhost:8000";
const cloudURL = "https://wad-2-proj.vercel.app"
const finalURL = cloudURL; // Use this for development; change it to `cloudURL` when in production


// Function to fetch itinerary from backend
async function getAllItinerary() {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/itinerary`);
        console.log(res.data)
        // Return the list of attractions
        return res.data;
    } catch (error) {
        console.error("Error fetching attractions:", error);
        throw error;
    }
}


async function getItineraryByID(itineraryID) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/itinerary/${itineraryID}`);
        console.log(res)
        return res.data;
    } catch (error) {
        console.error("Error fetching attraction:", error);
        throw error;
    }
}

async function getItineraryByUserID(userID) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/itinerary/user/${userID}`);
        console.log(res)
        return res.data;
    } catch (error) {
        console.error("Error fetching attraction:", error);
        throw error;
    }
}


// itineraryService.js
async function getItineraryByUserEmail(userEmail) {
    try {
        // Fetch itineraries for all users (using userEmail as part of the filter)
        const res = await axiosInstance.get(`${finalURL}/api/itinerary`);
        console.log(res);

        const itineraries = res.data;
        if (!itineraries || itineraries.length === 0) {
            throw new Error(`No itineraries found for user with email: ${userEmail}`);
        }

        // Filter itineraries where the email exists as a value in the collaborators' object
        const filteredItineraries = itineraries.filter(itinerary =>
            itinerary.collaborators && Object.values(itinerary.collaborators).includes(userEmail)
        );

        if (filteredItineraries.length === 0) {
            throw new Error(`No itineraries found for user with email: ${userEmail}`);
        }

        return filteredItineraries;
    } catch (error) {
        console.error("Error fetching itinerary by email:", error);
        throw error;
    }
}






async function postItinerary(newItinerary) {
    try {
        const res = await axiosInstance.post(`${finalURL}/api/postItinerary`, newItinerary);
        console.log(res)
        return res.data;
    } catch (error) {
        console.error("Error fetching attraction:", error);
        throw error;
    }
}

async function updateItinerary(itineraryID, updatedData) {
    try {
        const res = await axiosInstance.put(`${finalURL}/api/updateItinerary/${itineraryID}`, updatedData);
        console.log(res)
        return res.data;
    } catch (error) {
        console.error("Error fetching attraction:", error);
        throw error;
    }
}

async function deleteItinerary(itineraryID) {
    try {
        const res = await axiosInstance.delete(`${finalURL}/api/deleteItinerary/${itineraryID}`);
        console.log(res)
        return res.data;
    } catch (error) {
        console.error("Error fetching attraction:", error);
        throw error;
    }
}


// wishlist
// Get user wishlist
async function getUserWishlist(userID) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/wishlist/user/${userID}`);
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error); // Updated error message for clarity
        throw error;
    }
}

// Add a new wishlist
async function addWishlist(newWishlist) { // Updated parameter name for clarity
    try {
        const res = await axiosInstance.post(`${finalURL}/api/addWishlist`, newWishlist); // Updated endpoint
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error adding wishlist:", error); // Updated error message for clarity
        throw error;
    }
}

// Delete a wishlist
async function deleteWishlist(wishlistID) {
    try {
        const res = await axiosInstance.delete(`${finalURL}/api/deleteWishlist/${wishlistID}`); // Updated endpoint
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error deleting wishlist:", error); // Updated error message for clarity
        throw error;
    }
}

// Function to fetch temporary list items by userID
async function getTempItemsByUserID(userID) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/templist/user/${userID}`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching temporary list items:", error);
        throw error;
    }
}

// Function to add a new item to the temporary list
async function addTempItem(newTempItem) {
    try {
        const res = await axiosInstance.post(`${finalURL}/api/addTempItem`, newTempItem);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error adding temporary list item:", error);
        throw error;
    }
}

// Function to delete a temporary list item by ID
async function deleteTempItem(tempItemID, userID) {
    try {
        const res = await axiosInstance.delete(`${finalURL}/api/deleteTempItem/${tempItemID}`, {
            params: { userID }, // Send userID as a query parameter
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error deleting temporary list item:", error);
        throw error;
    }
}

export default {
    getAllItinerary,
    getItineraryByID,
    getItineraryByUserID,
    getItineraryByUserEmail,
    postItinerary,
    updateItinerary,
    deleteItinerary,
    getUserWishlist,
    addWishlist,
    deleteWishlist,
    getTempItemsByUserID,
    addTempItem,
    deleteTempItem
};