// controllers/eventController.js
const eventService = require("../services/eventService");

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        res.json(events);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await eventService.getEventById(eventId);
        if (!event) {
            return res.status(404).send("Event not found");
        }
        res.json(event);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getEventsByOrganiserId = async (req, res) => {
    try {
        const organiserId = req.params.organiserId;
        
        if (!organiserId) {
            return res.status(400).json({
                message: 'Organiser ID is required'
            });
        }

        const events = await eventService.getEventsByOrganiserId(organiserId);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({
            message: error.message || 'Error retrieving events'
        });
    }
};

const validateEventData = (eventData) => {
    const errors = [];
    
    // Required fields
    if (!eventData.title?.trim()) {
        errors.push("Title is required");
    }
    
    if (!eventData.start) {
        errors.push("Start date is required");
    }
    
    if (!eventData.organiserId) {
        errors.push("Organiser ID is required");
    }

    // Data type and format validation
    if (eventData.start && isNaN(new Date(eventData.start).getTime())) {
        errors.push("Invalid start date format");
    }

    if (eventData.end && isNaN(new Date(eventData.end).getTime())) {
        errors.push("Invalid end date format");
    }

    // Business rules
    if (eventData.end && new Date(eventData.end) < new Date(eventData.start)) {
        errors.push("End date cannot be before start date");
    }

    if (eventData.title?.length > 100) {
        errors.push("Title cannot be longer than 100 characters");
    }

    return errors;
};

// Add a new event
exports.createEvent = async (req, res) => {
    try {
        const newEvent = req.body;
        console.log("Incoming Event Data:", newEvent);
        
        // Validate request data
        const validationErrors = validateEventData(newEvent);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        const event = await eventService.addEvent(newEvent);
        res.json(event);
    } catch (err) {
        console.error("Error adding event:", err);
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Update an event by ID
exports.updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const updatedData = req.body;
        console.log("Updating Event:", eventId, updatedData);

        // Basic validation
        if (!updatedData.title || !updatedData.start || !updatedData.organiserId) {
            return res.status(400).send("Title, start date, and organiser ID are required");
        }

        const event = await eventService.updateEvent(eventId, updatedData);
        res.json(event);
    } catch (err) {
        console.error("Error updating event:", err);
        res.status(500).send(err.message);
    }
};

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log("Deleting Event:", eventId);
        await eventService.deleteEvent(eventId);
        res.json({ id: eventId, message: 'Event deleted successfully' });
    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).send(err.message);
    }
};