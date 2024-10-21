// services/itineraryService.js
const db = require("../config/firebase");
const Itinerary = require("../models/itineraryModel");

// Get all itineraries
exports.getAllItinerary = async () => {
    const snapshot = await db.ref("itinerary").once("value");
    const itineraries = snapshot.val();

    return Object.keys(itineraries).map(
        (key) => new Itinerary(
            key,
            itineraries[key].title,
            itineraries[key].date,
            itineraries[key].budget, // Include budget from DB
            itineraries[key].totalCost || null, // Allow totalCost to be null
            itineraries[key].collaborators || [], // Default to an empty array if collaborators are not provided
            itineraries[key].events || [] // Default to an empty array if events are not provided
        )
    );
};

// Get itinerary by itineraryID
exports.getItineraryByID = async (id) => {
    const snapshot = await db.ref(`itinerary/${id}`).once("value");
    const itinerary = snapshot.val();

    if (!itinerary) {
        throw new Error("Itinerary not found");
    }

    return new Itinerary(
        id,                                  // Itinerary ID
        itinerary.title,                     // Title
        itinerary.date,                      // Date
        itinerary.budget,                   // Budget
        itinerary.totalCost || null,       // Allow totalCost to be null
        itinerary.collaborators || [],       // Handle missing collaborators by defaulting to empty array
        itinerary.events || []                // Handle missing events by defaulting to empty array
    );
};

// Get itinerary by userID
exports.getItineraryByUserID = async (userID) => {
    const snapshot = await db.ref("itinerary").once("value");
    const itineraries = snapshot.val();

    if (!itineraries) {
        throw new Error("No itineraries found");
    }

    const filteredItineraries = Object.keys(itineraries)
        .filter(key => {
            const itinerary = itineraries[key];
            return itinerary.collaborators &&
                Array.isArray(itinerary.collaborators) &&
                itinerary.collaborators.includes(userID);
        })
        .map(key => new Itinerary(
            key,  // Itinerary ID
            itineraries[key].title,
            itineraries[key].date,
            itineraries[key].budget, // Include budget from DB
            itineraries[key].totalCost || null, // Allow totalCost to be null
            itineraries[key].collaborators || [], // Default to empty array if not provided
            itineraries[key].events || []           // Default to empty array if not provided
        ));

    if (filteredItineraries.length === 0) {
        throw new Error(`No itineraries found for user with ID: ${userID}`);
    }

    return filteredItineraries;
};

// POST
exports.addItinerary = async (newItinerary) => {
    const itineraryRef = db.ref('itinerary').push(); // Generates a new key
    console.log(newItinerary);
    const itineraryData = {
        title: newItinerary.title, // Title from the incoming data
        date: newItinerary.date,
        budget: newItinerary.budget, // Include budget from incoming data
        totalCost: null, // Initialize totalCost to null
        collaborators: newItinerary.collaborators || [], // Default to empty array if not provided
        events: newItinerary.events || [], // Default to empty array if not provided
    };

    await itineraryRef.set(itineraryData); // Sets the new itinerary data at that key

    return new Itinerary(
        itineraryRef.key, // Automatically generated key
        itineraryData.title,
        itineraryData.date,
        itineraryData.budget,
        itineraryData.totalCost, // Initialize totalCost as null
        itineraryData.collaborators,
        itineraryData.events
    );
};


// Update
exports.updateItinerary = async (id, updatedData) => {
    const itineraryRef = db.ref(`itinerary/${id}`);
    const snapshot = await itineraryRef.once('value');

    if (!snapshot.exists()) {
        throw new Error("Itinerary not found");
    }

    const updatedItinerary = {
        title: updatedData.title,
        date: updatedData.date,
        budget: updatedData.budget,
        collaborators: updatedData.collaborators || [], // Default to empty array if not provided
        events: updatedData.events || [] // Default to empty array if not provided
        // Do not include totalCost as it's not editable
    };
    console.log(updatedItinerary)
    await itineraryRef.update(updatedItinerary);
    return { id, ...updatedItinerary, message: 'Itinerary updated successfully' };
};

// Delete
exports.deleteItinerary = async (id) => {
    const itineraryRef = db.ref(`itinerary/${id}`);
    const snapshot = await itineraryRef.once('value');

    if (snapshot.exists()) {
        await itineraryRef.remove();
        return { id, message: 'Itinerary deleted successfully' };
    } else {
        throw new Error("Itinerary not found");
    }
};
