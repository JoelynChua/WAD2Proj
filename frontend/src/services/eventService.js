import axiosInstance from '../utils/axiosInstance'; // Import your axios instance, if you have one configured
// const localURL = "http://localhost:8000";
const cloudURL = "https://wad-2-proj-backend.vercel.app/"
const finalURL = cloudURL; // Use this for development; change it to `cloudURL` when in production

// Function to fetch events from backend
async function displayEvents() {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/displayEvents`);
        // Return the list of events
        return res.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}


async function goToEventDetails(eventId) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/eventDetails/${eventId}`);
        console.log(res)
        // Return the list of events
        return res.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}


export default {
    displayEvents,
    goToEventDetails
};
