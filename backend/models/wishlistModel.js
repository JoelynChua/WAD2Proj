class Wishlist {
    constructor(
        id,
        userID,
        eventID = null,
        attractionID = null
    ) {
        this.id = id;
        this.userID = userID;
        this.eventID = eventID;
        this.attractionID = attractionID;
    }
}

module.exports = Wishlist;
