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
            console.log(eventName);
        }

        // Send the fetched events as a response
        res.json(eventResponse.data._embedded.events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Failed to fetch events');
    }
}

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
            console.log(attractiontName);
        }

        // Send the fetched events as a response
        res.json(attractionResponse.data._embedded.attractions);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Failed to fetch events');
    }
}

module.exports = { displayEvents, displayAttractions };  // Ensure that you are exporting it this way
