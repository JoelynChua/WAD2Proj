<template>
  <v-app>
    <v-main>
      <Navbar v-if="false" /> <!-- Change to true when navbar is completed -->
      <div id="app">
        <h1>Expense Tracker</h1>
        <ExpenseForm />
        <ExpenseList />
        <ExpenseChart />
      </div>
      <router-view/>  
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue'; // Import Navbar if necessary
import ExpenseForm from './components/ExpenseForm.vue';
import ExpenseList from './components/ExpenseList.vue';
import ExpenseChart from './components/ExpenseChart.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    ExpenseForm,
    ExpenseList,
    ExpenseChart
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


