const db = require('../config/firebase'); // Ensure this path is correct

// Create Expense
exports.createExpense = async (req, res) => {
  try {
    console.log("Creating new expense...");
    const newExpenseRef = db.ref('expenses').push();
    await newExpenseRef.set(req.body);
    console.log("Expense created with ID:", newExpenseRef.key);
    res.status(201).json({ id: newExpenseRef.key, ...req.body });
  } catch (error) {
    console.error("Error creating expense:", error); // More detailed error log
    res.status(400).json({ message: error.message });
  }
};

// Get All Expenses
exports.getExpenses = async (req, res) => {
  try {
    console.log("Fetching all expenses...");
    const snapshot = await db.ref('expenses').once('value');
    const expenses = snapshot.val();
    const expenseArray = expenses ? Object.keys(expenses).map(id => ({ id, ...expenses[id] })) : [];
    console.log("Expenses fetched successfully:", expenseArray); // Log the retrieved data
    res.status(200).json(expenseArray);
  } catch (error) {
    console.error("Error fetching expenses:", error); // Log the specific error
    res.status(500).json({ message: error.message });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating expense with ID: ${id}...`);
    await db.ref(`expenses/${id}`).update(req.body);
    console.log("Expense updated successfully.");
    res.status(200).json({ id, ...req.body });
  } catch (error) {
    console.error("Error updating expense:", error); // Log the specific error
    res.status(400).json({ message: error.message });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting expense with ID: ${id}...`);
      await db.ref(`expenses/${id}`).remove(); // Make sure this targets the correct ID
      console.log("Expense deleted successfully.");
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error("Error deleting expense:", error); // Log the specific error
      res.status(500).json({ message: error.message });
    }
  };
  
