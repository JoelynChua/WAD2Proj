import axiosInstance from '../utils/axiosInstance'; // Import your axios instance, if you have one configured
// const localURL = "http://localhost:8000";
const cloudURL = "https://wad-2-proj.vercel.app"
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

async function searchEventName(eventName) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/displayEvents/${eventName}`);
        console.log(res)
        // Return the list of events
        return res.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}
async function goToEventDetails(eventId) {
    try {
        // Check if eventId is valid before making the request
        if (!eventId) {
            throw new Error("Event ID is required");
        }

        const res = await axiosInstance.get(`${finalURL}/api/eventDetails/${eventId}`);
        
        // Log the entire response object for debugging
        console.log("Full Response from API:", res);

        // Check if the response contains the expected data
        if (!res.data || typeof res.data !== 'object') {
            throw new Error("Invalid response data: Expected an object, but got " + typeof res.data);
        }

        // Optionally log the event details
        console.log("Event Details:", res.data);

        // Return the event details
        return res.data;
    } catch (error) {
        // Log the error details
        console.error("Error fetching event details:", error);

        // If the error is an Axios error, log more details (e.g., response status)
        if (error.response) {
            console.error("API Response Status:", error.response.status);
            console.error("API Response Data:", error.response.data);
        }

        // Re-throw the error to propagate it to the caller
        throw error;
    }
}



export default {
    displayEvents,
    goToEventDetails,
    searchEventName
};
