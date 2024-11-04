// const express = require('express'); // Import express
// const cors = require('cors'); // Import cors

// const router = express.Router();
// const app = express();

// app.use(cors());

// const itineraryController = require('../controllers/itineraryController');




// router.get("/itinerary", itineraryController.getAllItinerary);

const express = require('express'); // Import express
const cors = require('cors'); // Import cors
const router = express.Router();
const app = express();
app.use(cors());

const { displayEvents, displayAttractions, getEventById, getAttractionsById, searchEventsByName } = require('../src/api/ticketMasterApi'); // Adjust path if needed
const itineraryController = require('../controllers/itineraryController');
const wishlistController = require('../controllers/wishlistController');

// Define API routes
router.get('/displayEvents', displayEvents);
router.get('/displayEvents/:eventName', searchEventsByName);
router.get('/eventDetails/:eventID', (req, res) => {
    const eventID = req.params.eventID;  // Extract eventID from URL params
    getEventById(req, res, eventID);     // Pass the eventID to the getEventById function
});



router.get('/displayAttractions', displayAttractions);

router.get('/attractionDetails/:attractionID', (req, res) => {
    const attractionID = req.params.attractionID;  // Extract eventID from URL params
    getAttractionsById(req, res, attractionID);     // Pass the eventID to the getEventById function
});

//New func for itinerary
router.post('/getEventByIdItinerary', async (req, res) => {
    await getEventByIdItinerary(req, res);
});
router.post('/getAttractionByIdItinerary', async (req, res) => {
    await getAttractionByIdItinerary(req, res);
});




// Get all itineraries
router.get("/itinerary", itineraryController.getAllItinerary);

// Get an itinerary by ID
router.get("/itinerary/:id", itineraryController.getItineraryByID);

// Get itineraries by userID (where the user is a collaborator)
router.get("/itinerary/user/:userID", itineraryController.getItineraryByUserID);

// Post a new itinerary
router.post('/PostItinerary', itineraryController.postItinerary);

// Update an itinerary by ID
router.put('/updateItinerary/:id', itineraryController.updateItinerary);

// Delete an itinerary by ID
router.delete('/deleteItinerary/:id', itineraryController.deleteItinerary);


//wishlist
router.get("/wishlist/user/:userID", wishlistController.getWishlistByUserID);
router.post('/addWishlist', wishlistController.postWishlist);
router.delete('/deleteWishlist/:id', wishlistController.deleteWishlist);

module.exports = router;
