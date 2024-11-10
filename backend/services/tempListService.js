const db = require("../config/firebase");
const TempModel = require("../models/tempModel"); // Update to use TempModel

// Get temp list items by userID
exports.getTempItemsByUserID = async (userID) => {
    const snapshot = await db.ref("tempList").once("value");
    const tempItems = snapshot.val();

    if (!tempItems) {
        throw new Error("No temporary items found");
    }

    // Filter temp items by userID
    const filteredTempItems = Object.keys(tempItems)
        .filter(key => {
            const item = tempItems[key];
            return item.userID === userID;
        })
        .map(key => new TempModel(
            key,  // Temp item ID
            tempItems[key].userID,
            tempItems[key].eventID || null, // Allow eventID to be null
            tempItems[key].attractionID || null, // Allow attractionID to be null
        ));

    if (filteredTempItems.length === 0) {
        throw new Error(`No temporary items found for user with ID: ${userID}`);
    }

    return filteredTempItems;
};

// POST: Add new item to temp list
exports.addTempItem = async (newTempItem) => {
    const tempItemRef = db.ref('tempList').push(); // Generates a new key

    const tempItemData = {
        userID: newTempItem.userID, // User ID from the incoming data
        eventID: newTempItem.eventID || null, // Allow eventID to be null
        attractionID: newTempItem.attractionID || null, // Allow attractionID to be null
    };

    await tempItemRef.set(tempItemData); // Sets the new temp item data at that key

    return new TempModel(
        tempItemRef.key, // Automatically generated key
        tempItemData.userID,
        tempItemData.eventID,
        tempItemData.attractionID,
    );
};

// Delete an item from temp list by ID
exports.deleteTempItem = async (id) => {
    const tempItemRef = db.ref(`tempList/${id}`);
    const snapshot = await tempItemRef.once('value');

    if (snapshot.exists()) {
        await tempItemRef.remove();
        return { id, message: 'Temporary item deleted successfully' };
    } else {
        throw new Error("Temporary item not found");
    }
};
