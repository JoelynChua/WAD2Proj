// server.js
const express = require('express'); 
const { displayEvents, displayAttractions } = require('../src/api/ticketMasterApi'); // Assign the imported module immediately

const app = express();

app.get('/displayEvents', displayEvents);
app.get('/displayAttractions', displayAttractions);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

