// server.js
const express = require('express');
const cors = require('cors'); // Import CORS middleware
const { displayEvents, displayAttractions } = require('../src/api/ticketMasterApi'); // Assign the imported module immediately

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:8080', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
}));

// Define routes
app.get('/displayEvents', displayEvents);
app.get('/displayAttractions', displayAttractions);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
