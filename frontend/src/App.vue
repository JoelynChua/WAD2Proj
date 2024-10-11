<template>
  <v-app>
    <v-main>
      <Navbar v-if="false" /> <!-- Change to true when navbar is completed -->
      <div id="app">
        <img
          style="display: block; margin: 0 auto; width: 30%; height: 50%;"
          alt="logo"
          src="./assets/tabiLog_logo.png"
        />
        <h1>Expense Tracker</h1>
        <ExpenseForm />
        <ExpenseList />
        <ExpenseChart />
      </div>
      <NavigationBar /> <!-- Add the NavigationBar component here -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue'; // Import Navbar if necessary
import ExpenseForm from './components/ExpenseForm.vue';
import ExpenseList from './components/ExpenseList.vue';
import ExpenseChart from './components/ExpenseChart.vue';
import NavigationBar from './components/naviBar.vue'; // Adjust the path as needed

export default {
  name: 'App',
  components: {
    Navbar,
    ExpenseForm,
    ExpenseList,
    ExpenseChart,
    NavigationBar // Register the NavigationBar component
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
  margin-top: 0px;
}
</style>
