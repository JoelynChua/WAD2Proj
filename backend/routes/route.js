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

const { displayEvents, displayAttractions } = require('../src/api/ticketMasterApi'); // Adjust path if needed
const itineraryController = require('../controllers/itineraryController');

// Define API routes
router.get('/displayEvents', displayEvents);
router.get('/displayAttractions', displayAttractions);

// You can add more routes here


router.get("/itinerary", itineraryController.getAllItinerary);
router.post('/PostItinerary', itineraryController.addItinerary);


module.exports = router;
