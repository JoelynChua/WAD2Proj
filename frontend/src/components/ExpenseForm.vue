<template>
  <div class="expense-form-container">
    <h2 class="form-title">Add New Expense</h2>
    <form @submit.prevent="createExpense" class="expense-form">
      <div class="form-group">
        <label for="description" class="form-label">Description:</label>
        <input type="text" v-model="description" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="amount" class="form-label">Amount:</label>
        <input type="number" v-model="amount" class="form-input" required />
      </div>

      <button type="submit" class="submit-button">Add Expense</button>
    </form>
  </div>
</template>

<script>
import expenseservice from '../services/expenseservice';

export default {
  data() {
    return {
      description: '',
      amount: ''
    };
  },
  methods: {
    async createExpense() {
      const newExpense = {
        description: this.description,
        amount: parseFloat(this.amount)
      };

      try {
        await expenseservice.createExpense(newExpense);
        this.description = '';
        this.amount = '';
        alert('Expense added successfully');
      } catch (error) {
        console.error("Error creating expense:", error);
      }
    }
  }
};
</script>

<style scoped>
.expense-form-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.expense-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 15px;
}

.form-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s ease;
  box-sizing: border-box; /* Ensures consistent sizing */
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
