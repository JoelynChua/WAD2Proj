<template>
    <div id="tester" class="chart-container"></div>
  </template>
  
  <script>
  import Plotly from 'plotly.js-dist'; // Import Plotly
  
  export default {
    name: 'PlotlyChart',
    mounted() {
      // Get the current date and the year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-indexed
  
      // Create an array for YTD months
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      const xValues = months.slice(0, currentMonth + 1); // Get months from January to the current month
      const yValues = Array.from({ length: currentMonth + 1 }, (_, i) => Math.pow(2, i)); // Sample Y values (can be customized)
  
      // Create the plot when the component is mounted
      Plotly.newPlot('tester', [
        {
          x: xValues,
          y: yValues,
          type: 'scatter', // Specify the type of chart here
          mode: 'lines+markers', // Optional: display both lines and markers
        }
      ], {
        title: 'YTD Monthly Data',
        xaxis: {
          title: 'Months',
        },
        yaxis: {
          title: 'Expense',
        },
        margin: { t: 30 },
      });
    },
    beforeUnmount() {
      // Clean up if necessary, e.g., remove the chart
      const tester = document.getElementById('tester');
      if (tester) {
        tester.innerHTML = ''; // Clear the chart on component destruction
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;           /* Full width */
    max-width: 00px;
    height: 500px;        /* Set desired height */
  }
  
  /* You can adjust the height value as needed */
  </style>
  