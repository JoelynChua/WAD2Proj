const db = require("../config/firebase");
const Itinerary = require("../models/itineraryModel");


exports.getAllItinerary = async () => { 
    const snapshot = await db.ref("itinerary").once("value");
    const itinerary = snapshot.val();
    
    return Object.keys(itinerary).map(
        (key, index) => new Itinerary(
            key,
            itinerary[key].eventName,
            itinerary[key].date,
            itinerary[key].timing, 
            itinerary[key].restriction || null,  // Default to null if restriction is not provided
            itinerary[key].location,
            itinerary[key].cost,
            itinerary[key].collaborators || []   // Default to an empty array if collaborators are not provided
        )
    );
};

//Get itinerary By itineraryID
exports.getItineraryByID = async (id) => {
    const snapshot = await db.ref(`itinerary/${id}`).once("value");
    const itinerary = snapshot.val();
    
    if (!itinerary) {
        throw new Error("Itinerary not found");
    }
    
    return new Itinerary(
        id,                                  // Itinerary ID
        itinerary.eventName,                 // Event name
        itinerary.date,                 
        itinerary.timing,                    // Timing
        itinerary.restriction || null,       // Handle missing restriction by defaulting to null
        itinerary.location,                  // Location
        itinerary.cost,                      // Cost
        itinerary.collaborators              // Handle missing collaborators by defaulting to empty array
    );
};

//Get itinerary by userID
exports.getItineraryByUserID = async (userID) => {
    const snapshot = await db.ref("itinerary").once("value");
    const itineraries = snapshot.val();

    if (!itineraries) {
        throw new Error("No itineraries found");
    }

    // Filter itineraries where the userID is in the collaborators array
    const filteredItineraries = Object.keys(itineraries)
        .filter(key => {
            const itinerary = itineraries[key];
            return itinerary.collaborators && 
                Array.isArray(itinerary.collaborators) && 
                itinerary.collaborators.some(collaborator => collaborator.userID === userID);
        })
        .map(key => new Itinerary(
            key,  // Itinerary ID
            itineraries[key].eventName,
            itineraries[key].timing,
            itineraries[key].restriction || null,  // Handle missing restriction by defaulting to null
            itineraries[key].location,
            itineraries[key].cost,
            itineraries[key].collaborators || []   // Handle missing collaborators by defaulting to an empty array
        ));

    if (filteredItineraries.length === 0) {
        throw new Error(`No itineraries found for user with ID: ${userID}`);
    }

    return filteredItineraries;
};





// POST
exports.addItinerary = async (newItinerary) => {
    const itineraryRef = db.ref('itinerary').push(); // Generates a new key
    await itineraryRef.set(newItinerary); // Sets the new itinerary data at that key
    return new Itinerary(
        itineraryRef.key, // Automatically generated key
        newItinerary.eventName, // Event name from the incoming data
        newItinerary.date,
        newItinerary.timing,
        newItinerary.restriction || null,    // Handle null restriction
        newItinerary.location,
        newItinerary.cost,
        newItinerary.collaborators   
    );
};

//Update
exports.updateItinerary = async (id, updatedData) => {
    const itineraryRef = db.ref(`itinerary/${id}`);
    const snapshot = await itineraryRef.once('value');

    if (!snapshot.exists()) {
        throw new Error("Itinerary not found");
    }

    const updatedItinerary = {
        eventName: updatedData.eventName,
        timing: updatedData.timing,
        restriction: updatedData.restriction || null,       // Handle null restriction
        location: updatedData.location,
        cost: updatedData.cost,
        collaborators: updatedData.collaborators           // Handle empty collaborators
    };

    await itineraryRef.update(updatedItinerary);
    return { id, ...updatedItinerary, message: 'Itinerary updated successfully' };
};


//Delete
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
