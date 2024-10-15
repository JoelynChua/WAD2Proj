// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const {
    displayEvents,
    displayAttractions,
} = require('../src/api/ticketMasterApi'); // Assign the imported module immediately
const routes = require('../routes/route');
const expenseRoutes = require('../routes/expenseroute'); // Import expense routes

const app = express();

// Enable CORS for all routes
app.use(
    cors({
        origin: ['http://localhost:8000', 'http://localhost:8080'], // Allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
        credentials: true,
    })
);

// Add headers for Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP)
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// Define routes -- move to
// app.get('/displayEvents', displayEvents);
// app.get('/displayAttractions', displayAttractions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// From firebase
app.use('/api', routes);
app.use('/api/expenses', expenseRoutes);

// Define a route to get the Google client ID
app.get('/api/google-client-id', (req, res) => {
    res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
