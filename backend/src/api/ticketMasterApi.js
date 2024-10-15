const axios = require('axios');
require("dotenv").config();

async function displayEvents(req, res) {
    const apiKey = process.env.ticketMasterAPI;
    try {
        const eventResponse = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}`);
        console.log(eventResponse.data._embedded.events); // Log the events
        let events = eventResponse.data._embedded.events
        console.log(events); //display the array of events
        for (i in events) {
            let eventObject = events[i];
            let eventName = eventObject.name;
            //console.log(eventName);
        }

        // Send the fetched events as a response
        res.json(eventResponse.data._embedded.events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Failed to fetch events');
    }
}


//Id has to be passed as a URL parameter because using external API
//because id is sent in as a HTTP request to server, so we must use req.params.eventID then sent that into the ticketMasterLink
//whereas e.g. getEventById(id) -- is query from local database(firebase) thus does not depend on HTTP request to retrieve id
async function getEventById(req, res) {
    const apiKey = process.env.ticketMasterAPI;
    const eventID = req.params.eventID; // Extract eventID from request parameters

    if (!eventID) {
        return res.status(400).send('Event ID is required');
    }

    try {
        // Fetch the specific event by ID
        const eventResponse = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${eventID}.json?apikey=${apiKey}`);

        // Log the event details
        console.log(eventResponse.data); // Log the event details
        res.json(eventResponse.data); // Send the fetched event as a response
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).send('Failed to fetch event');
    }
}




// Attractions
// Need to make the part after v2/_ to be dynamic, based on navigation bar, then send in through params
async function displayAttractions(req, res) {
    const apiKey = process.env.ticketMasterAPI;
    try {
        const attractionResponse = await axios.get(`https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${apiKey}`);
        console.log(attractionResponse.data); // Log the events
        let attractions = attractionResponse.data._embedded.attractions
        console.log(attractions); //display the array of events

        for (i in attractions) {
            let attractionObject = attractions[i];
            let attractiontName = attractionObject.name;
            //console.log(attractiontName);
        }

        // Send the fetched events as a response
        res.json(attractionResponse.data._embedded.attractions);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Failed to fetch events');
    }
}


async function getAttractionsById(req, res) {
    const apiKey = process.env.ticketMasterAPI;
    const attractionID = req.params.attractionID; // Extract eventID from request parameters

    if (!attractionID) {
        return res.status(400).send('attraction ID is required');
    }

    try {
        // Fetch the specific event by ID
        const attractionResponse = await axios.get(`https://app.ticketmaster.com/discovery/v2/attractions/${attractionID}.json?apikey=${apiKey}`);

        // Log the event details
        console.log(attractionResponse.data); // Log the event details
        res.json(attractionResponse.data); // Send the fetched event as a response
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).send('Failed to fetch attraction');
    }
}

// New function to get attraction by event ID from the request body
async function getAttractionByIdItinerary(req, res) {
    const apiKey = process.env.ticketMasterAPI;
    const { eventID } = req.body; // Parse eventID from request body

    // Validate eventID presence
    if (!eventID) {
        return res.status(400).send('Event ID is required');
    }

    try {
        // Fetch the attraction related to the specific event ID
        const attractionResponse = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${eventID}/attractions.json?apikey=${apiKey}`);

        // Log the attraction details
        console.log(attractionResponse.data); // Log the attraction details
        res.json(attractionResponse.data); // Send the fetched attraction as a response
    } catch (error) {
        console.error('Error fetching attraction by event ID:', error);
        if (error.response) {
            // If the error response is available, send the error details
            res.status(error.response.status).send(error.response.data);
        } else {
            // For other types of errors (e.g., network issues)
            res.status(500).send('Failed to fetch attraction by event ID');
        }
    }
}



// New function to get event by ID from request body
async function getEventByIdItinerary(req, res) {
    const apiKey = process.env.ticketMasterAPI;
    const { eventIDs } = req.body; // Parse eventIDs from request body

    if (!Array.isArray(eventIDs) || eventIDs.length === 0) {
        return res.status(400).send('Event IDs are required and should be an array');
    }

    try {
        // Fetch event details for each ID in the array
        const eventPromises = eventIDs.map(eventID => 
            axios.get(`https://app.ticketmaster.com/discovery/v2/events/${eventID}.json?apikey=${apiKey}`)
        );

        // Wait for all promises to resolve
        const eventResponses = await Promise.all(eventPromises);

        // Extract the event data from each response
        const eventsData = eventResponses.map(response => response.data);

        // Log the event details
        console.log(eventsData); // Log all event details
        res.json(eventsData); // Send the fetched events as a response
    } catch (error) {
        console.error('Error fetching events by event IDs:', error);

        // Check if the error response is defined and log it
        if (error.response) {
            console.error('Error Response Status:', error.response.status);
            console.error('Error Response Data:', error.response.data);
        }

        res.status(500).send('Failed to fetch events by event IDs');
    }
}



module.exports = { displayEvents, displayAttractions, getEventById, getAttractionsById, 
    getAttractionByIdItinerary, getEventByIdItinerary };  // Ensure that you are exporting it this way
