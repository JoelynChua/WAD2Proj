const tempListService = require("../services/tempListService"); // Update to use tempListService

// Get temp list items by userID
exports.getTempItemsByUserID = async (req, res) => {
    try {
        const userID = req.params.userID;
        const tempItems = await tempListService.getTempItemsByUserID(userID);
        console.log(`Fetching temp items for user ID: ${userID}`);
        
        if (tempItems.length === 0) {
            return res.status(404).send("No temporary items found for this user");
        }
        
        res.json(tempItems);
    } catch (err) {
        console.error("Error fetching temporary items:", err);
        res.status(500).send(err.message);
    }
};

// Add a new item to the temp list
exports.postTempItem = async (req, res) => {
    try {
        const newTempItem = req.body;
        console.log("Incoming Temp Item Data:", newTempItem);
        const tempItem = await tempListService.addTempItem(newTempItem);
        res.json(tempItem);
    } catch (err) {
        console.error("Error adding temp item:", err);
        res.status(500).send(err.message);
    }
};

// Delete an item from the temp list
exports.deleteTempItem = async (req, res) => {
    try {
        const { id } = req.params;  // tempItemID is taken from the route parameter
        const { userID } = req.query;  // userID is taken from the query parameters

        console.log(`Deleting temp item with ID: ${id} for userID: ${userID}...`);
        
        // Ensure both id and userID are provided
        if (!id || !userID) {
            return res.status(400).json({ message: 'Missing tempItemID or userID' });
        }

        // Call the service method with tempItemID and userID
        await tempListService.deleteTempItem(id, userID);

        console.log("Temp item deleted successfully.");
        res.status(200).json({ message: 'Temporary item deleted successfully' });
    } catch (error) {
        console.error("Error deleting temp item:", error); // Log the specific error
        res.status(500).json({ message: error.message });
    }
};
