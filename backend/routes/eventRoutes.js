const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET routes
router.get('', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/organiser/:organiserId', eventController.getEventsByOrganiserId);

// POST route
router.post('', eventController.createEvent);

// PUT route
router.put('/:id', eventController.updateEvent);

// DELETE route
router.delete('/:id', eventController.deleteEvent);

module.exports = router;