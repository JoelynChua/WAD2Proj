const db = require("../config/firebase");
const Itinerary = require("../models/itineraryModel");


exports.getAllItinerary = async () => {
    const snapshot = await db.ref("itinerary").once("value");
    const itinerary = snapshot.val();
    return Object.keys(itinerary).map(
        (key, index) =>
            new Itinerary(
                key,
                itinerary[key].eventName,
                { key: index }
            )
    );
};



// POST
// exports.addItinerary = async (newItinerary) => {
//     const itineraryRef = db.ref('itinerary').push();
//     await itineraryRef.set(newItinerary);
//     return new Itinerary(
//         itineraryRef.key,
//         newItinerary.eventName
//     );
// };
exports.addItinerary = async (newItinerary) => {
    const itineraryRef = db.ref('itinerary').push(); // Generates a new key
    await itineraryRef.set(newItinerary); // Sets the new itinerary data at that key
    return new Itinerary(
        itineraryRef.key, // Automatically generated key
        newItinerary.eventName // Event name from the incoming data
    );
};
