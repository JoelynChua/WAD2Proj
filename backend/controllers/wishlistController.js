const wishlistService = require("../services/wishlistService"); // Update to use wishlistService

// Get wishlists by userID
exports.getWishlistByUserID = async (req, res) => {
    try {
        const userID = req.params.userID;
        const wishlists = await wishlistService.getWishlistByUserID(userID);
        console.log(userID);
        if (wishlists.length === 0) {
            return res.status(404).send("No wishlists found for this user");
        }
        res.json(wishlists);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Add a new wishlist
exports.postWishlist = async (req, res) => {
    try {
        const newWishlist = req.body;
        console.log("Incoming Wishlist Data:", newWishlist);
        const wishlist = await wishlistService.addWishlist(newWishlist);
        res.json(wishlist);
    } catch (err) {
        console.error("Error adding wishlist:", err);
        res.status(500).send(err.message);
    }
};

// Delete Wishlist
exports.deleteWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deleting wishlist with ID: ${id}...`);
        await wishlistService.deleteWishlist(id); // Make sure to call the correct service method
        console.log("Wishlist deleted successfully.");
        res.status(200).json({ message: 'Wishlist deleted successfully' });
    } catch (error) {
        console.error("Error deleting wishlist:", error); // Log the specific error
        res.status(500).json({ message: error.message });
    }
};
