const itineraryService = require("../services/itineraryService");

exports.getAllItinerary = async (req, res) => {
    try {
        const itinerary = await itineraryService.getAllItinerary();
        res.json(itinerary);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// exports.addItinerary = async (req, res) => {
//     try {
//       const newItinerary= req.body;
//       const itinerary = await itineraryService.addItinerary(newItinerary); 
//       res.json(itinerary);
//     } catch (err) {
//       res.status(500).send(err.message);
//     }
//   };

exports.addItinerary = async (req, res) => {
    try {
        const newItinerary = req.body; // Gets the request body
        console.log("Incoming Itinerary Data:", newItinerary); 
        const itinerary = await itineraryService.addItinerary(newItinerary); 
        res.json(itinerary); // Sends back the created itinerary
    } catch (err) {
        console.error("Error adding itinerary:", err);
        res.status(500).send(err.message); // Error handling
    }
};
