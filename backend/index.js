// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const {
    displayEvents,
    displayAttractions,
} = require('./src/api/ticketMasterApi'); // Assign the imported module immediately
const routes = require('./routes/route');
const expenseRoutes = require('./routes/expenseroute'); // Import expense routes
const eventRoutes = require('./routes/eventRoutes');
const app = express();
const vercel_frontend_url =  'https://wad-2-proj-frontend.vercel.app'

// Enable CORS for all routes
app.use(
    cors({
        origin: [
            'http://localhost:8080',
            'http://localhost:8081',
            `${vercel_frontend_url}`], // Allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
        credentials: true,
        default: `${vercel_frontend_url}`,
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
app.use('/api/eventRoutes', eventRoutes);

// Define a route to get the Google client ID
app.get('/api/google-client-id', (req, res) => {
    res.json({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
