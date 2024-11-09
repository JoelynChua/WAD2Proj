<template>
  <div>
    <!-- Chart container for Plotly chart -->
    <div class="mt-3 shadow p-3 bg-body hover-effect" style="margin: 20px 30px;">
      <h5 class="text-start">Expense</h5>
      <div class="chart-container" ref="chartContainer"></div>
    </div>
    <!-- Table displaying booking details -->
    <div class="expense_table">
      <div v-if="bookings.length > 0">
        <div class="mt-3 shadow p-3 bg-body hover-effect">
          <h5 class="text-start">Registered Events</h5>
          <table class="table mt-3">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price (S$)</th>
              </tr>
            </thead>
            <tbody>
              <!-- Only display the row if the booking has the required properties -->
              <tr v-for="(booking, index) in bookings.slice(1,)" :key="index">
                <!-- Check for missing data and provide a fallback -->
                <td>{{ booking?.title || 'No title' }}</td>
                <td>{{ booking?.date || 'No date' }}</td>
                <td>{{ booking?.time || 'No time' }}</td>
                <td>{{ booking?.price ? `S${booking.price}` : 'No price' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- If no bookings, show a message -->
      <div v-else>
        <p>No bookings available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      bookings: [],
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
          this.bookings = data.bookings || []; // Set bookings or empty array if undefined
          this.table = data.bookings || [];
          this.plotChart();
          console.log(this.bookings)
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
        const price = parseFloat(booking.price.replace('$', '')) || 0; // Convert price to number

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
      Plotly.newPlot(this.$refs.chartContainer, data, layout, config);
    },

    handleResize() {
      this.plotChart();
    }
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
}
</style>
