// services/eventService.js
const db = require("../config/firebase");
const Event = require("../models/eventModel");

// Get all events
exports.getAllEvents = async () => {
    const snapshot = await db.ref("events").once("value");
    const events = snapshot.val();

    if (!events) return [];

    return Object.keys(events).map(
        (key) => new Event(
            key,
            events[key].title,
            events[key].description,
            events[key].organiserId,
            events[key].start,
            events[key].end,
            events[key].allDay,
            events[key].colour,
            events[key].price
        )
    );
};

// Get event by eventID
exports.getEventById = async (id) => {
    const snapshot = await db.ref(`events/${id}`).once("value");
    const event = snapshot.val();

    if (!event) {
        throw new Error("Event not found");
    }

    return new Event(
        id,
        event.title,
        event.description,
        event.organiserId,
        event.start,
        event.end,
        event.allDay,
        event.colour,
        event.price
    );
};

// Get events by organiserID
exports.getEventsByOrganiserId = async (organiserId) => {
    const snapshot = await db.ref("events").once("value");
    const events = snapshot.val();

    if (!events) {
        return []; // Return empty array if no events found
    }

    const filteredEvents = Object.keys(events)
        .filter(key => events[key].organiserId === organiserId)
        .map(key => ({
            id: key,
            ...events[key]
        }));

    return filteredEvents;
};

// POST
exports.addEvent = async (newEvent) => {
    const eventRef = db.ref('events').push(); // Generates a new key

    const eventData = {
        title: newEvent.title,
        description: newEvent.description || '',
        organiserId: newEvent.organiserId,
        price: newEvent.price,
        start: newEvent.start,
        end: newEvent.end,
        allDay: newEvent.allDay || false,
        colour: newEvent.colour || '#fb00bc'
    };

    await eventRef.set(eventData);

    return new Event(
        eventRef.key,
        eventData.title,
        eventData.price,
        eventData.description,
        eventData.organiserId,
        eventData.start,
        eventData.end,
        eventData.allDay,
        eventData.colour
    );
};

// Update
exports.updateEvent = async (id, updatedData) => {
    const eventRef = db.ref(`events/${id}`);
    const snapshot = await eventRef.once('value');

    if (!snapshot.exists()) {
        throw new Error("Event not found");
    }

    const updatedEvent = {
        title: updatedData.title,
        price: updatedData.price,
        description: updatedData.description,
        organiserId: updatedData.organiserId,
        start: updatedData.start,
        end: updatedData.end,
        allDay: updatedData.allDay || false,
        colour: updatedData.colour || '#fb00bc'
    };

    await eventRef.update(updatedEvent);
    return { id, ...updatedEvent, message: 'Event updated successfully' };
};

// Delete
exports.deleteEvent = async (id) => {
    const eventRef = db.ref(`events/${id}`);
    const snapshot = await eventRef.once('value');

    if (snapshot.exists()) {
        await eventRef.remove();
        return { id, message: 'Event deleted successfully' };
    } else {
        throw new Error("Event not found");
    }
};
