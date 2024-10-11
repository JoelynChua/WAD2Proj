<template>
  <div class="expenses-container">
    <h2 class="expenses-title">Expenses</h2>
    <ul class="expenses-list">
      <li v-for="expense in expenses" :key="expense.id" class="expense-item">
        <span class="expense-description">{{ expense.description }}</span>
        <span class="expense-amount">$ {{ expense.amount }}</span>
        <button class="delete-button" @click="deleteExpense(expense.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import expenseservice from '../services/expenseservice';

export default {
  data() {
    return {
      expenses: []
    };
  },
  async created() {
    this.expenses = await expenseservice.getExpenses();
  },
  methods: {
    async deleteExpense(id) {
      try {
        await expenseservice.deleteExpense(id);
        this.expenses = this.expenses.filter(expense => expense.id !== id); // Remove deleted item from the list
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  }
};
</script>

<style scoped>
.expenses-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.expenses-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.expenses-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

.expense-item:hover {
  background-color: #f0f0f0;
}

.expense-description {
  font-size: 16px;
  color: #555;
}

.expense-amount {
  font-size: 16px;
  color: #007bff;
}

.delete-button {
  padding: 5px 10px;
  font-size: 14px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>


