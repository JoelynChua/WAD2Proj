import axiosInstance from '../utils/axiosInstance'; // Import your axios instance, if you have one configured
// const localURL = "http://localhost:8000";
const cloudURL = "https://wad-2-proj.vercel.app/"
const finalURL = cloudURL;


// Get all events
async function getAllEvents() {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/eventRoutes`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

// Get event by ID
async function getEventById(eventId) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/eventRoutes/${eventId}`);
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
    }
}

// Get events by organiser ID
async function getEventsByOrganiserId(organiserId) {
    try {
        const res = await axiosInstance.get(`${finalURL}/api/eventRoutes/organiser/${organiserId}`);
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error fetching organiser events:", error);
        throw error;
    }
}

// Get events by date range

// Create new event
async function createEvent(newEvent) {
    try {
        const res = await axiosInstance.post(`${finalURL}/api/eventRoutes`, newEvent);
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

// Update event
async function updateEvent(eventId, updatedData) {
    try {
        const res = await axiosInstance.put(`${finalURL}/api/eventRoutes/${eventId}`, updatedData);
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
}

// Delete event
async function deleteEvent(eventId) {
    try {
        const res = await axiosInstance.delete(`${finalURL}/api/eventRoutes/${eventId}`);
        console.log(res);
        return res.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    createEvent,
    updateEvent,
    deleteEvent
};