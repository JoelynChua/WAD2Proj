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
        const { id } = req.params;
        console.log(`Deleting temp item with ID: ${id}...`);
        await tempListService.deleteTempItem(id); // Calls the correct service method
        console.log("Temp item deleted successfully.");
        res.status(200).json({ message: 'Temporary item deleted successfully' });
    } catch (error) {
        console.error("Error deleting temp item:", error); // Log the specific error
        res.status(500).json({ message: error.message });
    }
};
