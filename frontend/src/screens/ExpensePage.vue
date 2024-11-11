<template>
  <div v-if="bookings.length > 0">
    <!-- Chart container for Plotly chart -->
    <div class="expense_table mt-3 shadow p-sm-4 p-3 bg-body hover-effect">
      <h5 class="text-start">Expense</h5>
      <div class="chart-container" ref="chartContainer">
        <div v-if="isLoading" class="loading-overlay">
          <p>Loading chart...</p> <!-- Show loading message or spinner -->
        </div>
      </div>
    </div>

    <!-- Table displaying booking details -->
    <div class="expense_table mt-3 shadow p-sm-4 p-3 bg-body hover-effect">
      <h5 class="text-start">Registered Events</h5>
      <table class="table mt-3">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th class="collapsable_2">Time</th>
            <th>Price (S$)</th>
            <th class="collapsable">Modifications</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in bookings" :key="index">
            <td>{{ booking?.title || 'No title' }}</td>
            <td>{{ booking?.date || 'No date' }}</td>
            <td class="collapsable_2">{{ booking?.time || 'No time' }}</td>
            <td>{{ booking?.price ? `${booking.price}` : 'No price' }}</td>
            <td class="collapsable"><button class="btn btn-danger" @click="handleDelete(index)">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- If no bookings, show a message -->
  <div v-else>
    <p class="mt-5">No bookings available.</p>
    <a href="/events">Make Bookings</a>
  </div>
</template>


<script>
import Plotly from 'plotly.js-dist';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      bookings: [],
      isLoading: true,
    };
  },
  mounted() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const profileRef = ref(db, 'users/' + user.uid);

      get(profileRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.bookings = (data.bookings || []).filter(booking => booking?.title);
          this.plotChart();
        } else {
          console.log('No profile data found for user.');
        }
      });
    } else {
      console.log('No user is currently logged in.');
    }

    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    plotChart() {
      const tryPlotting = () => {
        const chartContainer = this.$refs.chartContainer;
        if (!chartContainer) {
          console.log('Chart container not found, retrying...');
          this.isLoading = true;  // Show loading indicator
          setTimeout(tryPlotting, 500); // Retry after 500ms
          return;
        }

        // Stop showing loading once chart is available
        this.isLoading = false;

        if (!this.bookings.length) {
          console.log('No bookings data to plot.');
          return;
        }

        // Define all months from January to December
        const allMonths = [
          '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
          '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
        ];

        // Initialize monthlyData with all months set to 0
        const monthlyData = allMonths.reduce((acc, month) => {
          acc[month] = 0;
          return acc;
        }, {});

        // Update monthlyData with actual booking prices
        this.bookings.forEach((booking) => {
          const month = dayjs(booking.date).format('YYYY-MM'); // Format date as "YYYY-MM"
          const price = parseFloat(booking.price?.replace('$', '')) || 0; // Convert price to number

          if (monthlyData[month] !== undefined) {
            monthlyData[month] += price;
          }
        });

        // Prepare data for Plotly
        const months = Object.keys(monthlyData); // x-axis labels (Jan-Dec)
        const cumulativePrices = Object.values(monthlyData); // y-axis values

        const data = [
          {
            x: months,
            y: cumulativePrices,
            type: 'bar', // or 'scatter' for a line chart
            marker: { color: 'blue' },
          },
        ];

        const layout = {
          title: { text: 'Monthly Activity Expense' },
          xaxis: { title: { text: 'Month' } },
          yaxis: { title: { text: 'Monthly Spending (S$)' } },
          responsive: true,
          autolayout: true,
        };

        const config = {
          displayModeBar: false,
          scrollZoom: false,
          displaylogo: false,
          editable: false,
          showTips: false,
          staticPlot: true,
        };

        // Render chart in the chart-container div
        Plotly.newPlot(chartContainer, data, layout, config);
      };

      // Start the plotting process
      tryPlotting();
    },


    handleResize() {
      this.plotChart();
    },
    handleDelete(index) {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                // Remove the booking from the local array
                this.bookings.splice(index, 1);

                // Update the bookings list in the database
                const db = getDatabase();
                const profileRef = ref(db, 'users/' + user.uid);

                // Re-upload the updated bookings array to the database
                update(profileRef, {
                    bookings: this.bookings,

                })
                    .then(() => {
                        console.log('Bookings updated successfully');
                    })
                    .catch((error) => {
                        console.error('Error updating bookings:', error);
                    });
            } else {
                console.log('No user is currently logged in.');
            }
        },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;

}

.expense_table {
  margin-top: 20px;
  margin: 20px 30px;
  border-radius: 20px;

}

@media (max-width: 500px) {
  .collapsable {
    display: none;
  }
}

@media (max-width: 400px) {
  .collapsable_2 {
    display: none;
  }
 }
</style>
