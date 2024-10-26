import axiosInstance from '../utils/axiosInstance';
const localURL = "http://localhost:8000";
const cloudURL = "https://wad-2-proj-backend.vercel.app/"
const finalURL = cloudURL; // Change to cloud URL in production

// Function to create a new expense
async function createExpense(expenseData) {
  try {
    const res = await axiosInstance.post(`${finalURL}/api/expenses`, expenseData);
    return res.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}

// Function to fetch all expenses
async function getExpenses() {
  try {
    const res = await axiosInstance.get(`${finalURL}/api/expenses`);
    return res.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
}

// Function to update an expense
async function updateExpense(id, updatedData) {
  try {
    const res = await axiosInstance.put(`${finalURL}/api/expenses/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
}

// Function to delete an expense
async function deleteExpense(id) {
  try {
    const res = await axiosInstance.delete(`${finalURL}/api/expenses/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
}

export default {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};
