class Itinerary {
    constructor(
        id,
        eventName,
        date,
        timing,
        restriction = null, // Default to null if not provided
        location,
        cost,
        collaborators // Default to an empty array if not provided
    ) {
        this.id = id;
        this.eventName = eventName;
        this.date = date;
        this.timing = timing;
        this.restriction = restriction;
        this.location = location;
        this.cost = cost;
        this.collaborators = collaborators;
    }
}

module.exports = Itinerary;
