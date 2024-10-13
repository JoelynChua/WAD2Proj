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


module.exports = { displayEvents, displayAttractions, getEventById, getAttractionsById };  // Ensure that you are exporting it this way
