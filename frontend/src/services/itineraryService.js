import axiosInstance from '../utils/axiosInstance'; // Import your axios instance, if you have one configured
const localURL = "http://localhost:8000";
const finalURL = localURL; // Use this for development; change it to `cloudURL` when in production


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

async function updateItinerary(itineraryID,updatedData) {
    try {
        const res = await axiosInstance.put(`${finalURL}/api/updateItinerary/${itineraryID}`,updatedData);
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

export default {
    getAllItinerary,
    getItineraryByID,
    getItineraryByUserID,
    postItinerary,
    updateItinerary,
    deleteItinerary,
    getUserWishlist,
    addWishlist,
    deleteWishlist
};