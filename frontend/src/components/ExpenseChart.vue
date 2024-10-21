<template>
  <div class="chart-container">
    <h2 class="chart-title">Expense Visualization</h2>
    <Bar v-if="hasData" :chart-data="chartData" :options="chartOptions" />
    <p v-else>No data available to display.</p>
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
        labels: [], // Initialize labels as an empty array
        datasets: [
          {
            label: 'Expenses', // Default label for the dataset
            data: [] // Initialize data as an empty array
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Hide the legend
          },
          title: {
            display: true,
            text: 'Expense Visualization' // Set chart title
          }
        },
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
        }
      }
    };
  },

  computed: {
    hasData() {
      return this.chartData && this.chartData.labels.length > 0; // Check if chartData has labels
    }
  },

  async mounted() {
    await this.fetchChartData(); // Fetch data when component is mounted
  },

  methods: {
    async fetchChartData() {
      try {
        const response = await expenseservice.getExpenses();

        console.log("Expenses Response:", response);

        if (Array.isArray(response) && response.length > 0) {
          const labels = response.map(expense => {
            const description = String(expense.description || 'Unknown');
            return description.trim() || 'Unnamed Expense';
          });

          const data = response.map(expense => {
            const amount = Number(expense.amount) || 0;
            console.log("Amount:", amount, "Type:", typeof amount);
            return amount;
          });

          // Update chart data with labels and data
          this.chartData = {
            labels,
            datasets: [
              {
                label: 'Expenses',
                backgroundColor: '#f87979',
                data, // Ensure this is not undefined
              },
            ],
          };

          console.log("Labels:", labels, "Data:", data);
        } else {
          console.warn("No expenses found in the response.");
          this.resetChartData(); // Reset chart data structure
        }
      } catch (error) {
        console.error("Error loading chart data:", error);
        this.resetChartData(); // Reset chart data structure in case of error
      }
    },
    resetChartData() {
      // Maintain chartData structure to avoid undefined issues
      this.chartData = {
        labels: [],
        datasets: [
          {
            label: 'Expenses',
            backgroundColor: '#f87979',
            data: [],
          },
        ],
      };
    }
  }
};
</script>

<style scoped>
.chart-container {
  max-width: 600px;
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
