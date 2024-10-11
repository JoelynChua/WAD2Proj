const itineraryService = require("../services/itineraryService");

// Get all itineraries
exports.getAllItinerary = async (req, res) => {
    try {
        const itineraries = await itineraryService.getAllItinerary();
        res.json(itineraries);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Get an itinerary by ID
exports.getItineraryByID = async (req, res) => {
    try {
        const itineraryID = req.params.id;
        const itinerary = await itineraryService.getItineraryByID(itineraryID);
        if (!itinerary) {
            return res.status(404).send("Itinerary not found");
        }
        res.json(itinerary);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Get itineraries by userID
exports.getItineraryByUserID = async (req, res) => {
    try {
        const userID = req.params.userID;
        const itineraries = await itineraryService.getItineraryByUserID(userID);
        console.log(userID);
        if (itineraries.length === 0) {
            return res.status(404).send("No itineraries found for this user");
        }
        res.json(itineraries);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Add a new itinerary
exports.postItinerary = async (req, res) => {
    try {
        const newItinerary = req.body;
        console.log("Incoming Itinerary Data:", newItinerary);
        const itinerary = await itineraryService.addItinerary(newItinerary);
        res.json(itinerary);
    } catch (err) {
        console.error("Error adding itinerary:", err);
        res.status(500).send(err.message);
    }
};

// Update an itinerary by ID
exports.updateItinerary = async (req, res) => {
    try {
        const itineraryID = req.params.id;
        const updatedData = req.body;
        console.log("Updating Itinerary:", itineraryID, updatedData);
        const itinerary = await itineraryService.updateItinerary(itineraryID, updatedData);
        res.json(itinerary);
    } catch (err) {
        console.error("Error updating itinerary:", err);
        res.status(500).send(err.message);
    }
};

// Delete an itinerary by ID
exports.deleteItinerary = async (req, res) => {
    try {
        const itineraryID = req.params.id;
        console.log("Deleting Itinerary:", itineraryID);
        await itineraryService.deleteItinerary(itineraryID);
        res.json({ id: itineraryID, message: 'Itinerary deleted successfully' });
    } catch (err) {
        console.error("Error deleting itinerary:", err);
        res.status(500).send(err.message);
    }
};

