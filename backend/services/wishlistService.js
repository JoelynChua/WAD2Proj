const db = require("../config/firebase");
const Wishlist = require("../models/wishlistModel"); // Update to use Wishlist model

// Get wishlist by userID
exports.getWishlistByUserID = async (userID) => {
    const snapshot = await db.ref("wishlist").once("value");
    const wishlists = snapshot.val();

    if (!wishlists) {
        throw new Error("No wishlists found");
    }

    const filteredWishlists = Object.keys(wishlists)
        .filter(key => {
            const wishlist = wishlists[key];
            return wishlist.userID === userID; // Filter by userID
        })
        .map(key => new Wishlist(
            key,  // Wishlist ID
            wishlists[key].userID,
            wishlists[key].eventID || null, // Allow eventID to be null
            wishlists[key].attractionID || null // Allow attractionID to be null
        ));

    if (filteredWishlists.length === 0) {
        throw new Error(`No wishlists found for user with ID: ${userID}`);
    }

    return filteredWishlists;
};

// POST
exports.addWishlist = async (newWishlist) => {
    const wishlistRef = db.ref('wishlist').push(); // Generates a new key

    const wishlistData = {
        userID: newWishlist.userID, // User ID from the incoming data
        eventID: newWishlist.eventID || null, // Allow eventID to be null
        attractionID: newWishlist.attractionID || null // Allow attractionID to be null
    };

    await wishlistRef.set(wishlistData); // Sets the new wishlist data at that key

    return new Wishlist(
        wishlistRef.key, // Automatically generated key
        wishlistData.userID,
        wishlistData.eventID,
        wishlistData.attractionID
    );
};

// Delete
exports.deleteWishlist = async (id) => {
    const wishlistRef = db.ref(`wishlist/${id}`);
    const snapshot = await wishlistRef.once('value');

    if (snapshot.exists()) {
        await wishlistRef.remove();
        return { id, message: 'Wishlist deleted successfully' };
    } else {
        throw new Error("Wishlist not found");
    }
};
