<template>
  <div class="chart-container">
    <h2 class="chart-title">Expense Visualization</h2>
    <Bar :chart-data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import expenseservice from '../services/expenseservice';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: {
    Bar
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{
          label: 'Expenses',
          backgroundColor: '#f87979',
          data: []
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#e0e0e0'
            },
            ticks: {
              color: '#555'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#555'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#555'
            }
          }
        }
      }
    };
  },
  async created() {
    try {
      const response = await expenseservice.getExpenses();
      const labels = [];
      const data = [];
      
      response.forEach(expense => {
        labels.push(expense.description);
        data.push(expense.amount);
      });

      this.chartData.labels = labels;
      this.chartData.datasets[0].data = data;
    } catch (error) {
      console.error("Error loading chart data:", error);
    }
  }
};
</script>

<style scoped>
.chart-container {
  max-width: 600px; /* Adjust width as needed */
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
}
</style>
