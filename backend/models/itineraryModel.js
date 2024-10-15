class Itinerary {
    constructor(
        id,
        title,
        date,
        budget,
        totalCost = null,    // Default to null if not provided
        collaborators = [], // Default to an empty array if not provided
        events = []         // Default to an empty array if not provided
    ) {
        this.id = id; 
        this.title = title;
        this.date = date;
        this.budget = budget;
        this.totalCost = totalCost; // Allow totalCost to be null
        this.collaborators = collaborators; // Array of collaborator names or IDs
        this.events = events; // Array of event IDs
    }
}

module.exports = Itinerary;
