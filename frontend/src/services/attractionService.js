import axiosInstance from '../utils/axiosInstance'; // Import your axios instance, if you have one configured
const localURL = "http://localhost:8000";
const finalURL = localURL; // Use this for development; change it to `cloudURL` when in production

// Function to fetch events from backend
async function displayAttractions() {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/displayAttractions`);
        // Return the list of attractions
        return res.data;
    } catch (error) {
        console.error("Error fetching attractions:", error);
        throw error;
    }
}


async function goToAttractionDetails(attractionId) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/attractionDetails/${attractionId}`);
        console.log(res)
        return res.data;
    } catch (error) {
        console.error("Error fetching attraction:", error);
        throw error;
    }
}

export default {
    displayAttractions,
    goToAttractionDetails
};
