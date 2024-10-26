<template>
    <div>
      <h1>Expense Management</h1>
      
      <section>
        <h2>Expense Form</h2>
        <ExpenseForm />
      </section>
      
      <section>
        <h2>Expense List</h2>
        <ExpenseList />
      </section>
  
      <!-- <section>
        <h2>Expense Chart</h2>
        <ExpenseChart />
      </section> -->
    </div>
  </template>
  
  <script>
  // import ExpenseChart from '../components/ExpenseChart.vue';
  import ExpenseForm from '../components/ExpenseForm.vue';
  import ExpenseList from '../components/ExpenseList.vue';
  
  export default {
    name: 'ExpensePage',
    components: {
      // ExpenseChart,
      ExpenseForm,
      ExpenseList
    }
  };
  </script>
  
  <style>
  /* Add any specific styles for your ExpensePage here */
  </style>
  