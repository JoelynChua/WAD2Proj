<template>
  <div class="container-fluid organizer-dashboard">
    <div class="text-start p-2">
      <h2><b>Organiser Dashboard</b></h2>
    </div>
    <div class="smallBrowser">
      Please expand your browser to view detailed analysis
    </div>

    <!-- Charts Section with Borders and Margins -->
    <div class="row justify-content-center graph">
      <div class="col-12 col-md-6 col-lg-5 component-box">
        <canvas id="attendeePieChart"></canvas>
      </div>
      <div class="col-12 col-md-6 col-lg-5 component-box">
        <canvas id="attendeeBarChart"></canvas>
      </div>

      <!-- Revenue Chart Section -->
      <div class="col-12 col-md-6 col-lg-5 component-box">
        <canvas id="revenueBarChart"></canvas>
      </div>
    </div>

    <!-- Signups Table Section -->
    <div class="signups-table component-box m-0 mt-3">
      <h2>Event Signups</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Signups</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in organizerEvents" :key="event.id">
            <td>{{ event.title }}</td>
            <td>
              <!-- Button to navigate to Event Statistics page -->
              <button class="btn btn-primary" @click="viewEventStatistics(event.eventId)">
                View Info
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebaseClientConfig';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      organizerName: 'Organizer',
      organizerEvents: [],
      pieChartInstance: null,
      barChartInstance: null,
      revenueChartInstance: null,
      dropdownOpen: {}, // Track open/close state of each dropdown by event ID
    };
  },
  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();

          if (userData.userType === 'organiser') {
            this.organizerName = userData.name || 'Organizer';
            console.log("Display name retrieved from Firebase Database:", this.organizerName);

            // Fetch events based on the organizer ID
            const eventsRef = ref(database, `/events`);
            const eventsSnapshot = await get(eventsRef);

            if (eventsSnapshot.exists()) {
              const eventsData = eventsSnapshot.val();

              // Filter events for the specific organizer ID
              this.organizerEvents = Object.entries(eventsData)
                .filter(([, event]) => event.organiserId === user.uid) 
                .map(([key, event]) => {
                  return { ...event, eventId: key }; 
                })
                .sort((a, b) => {
                  const dateA = new Date(a.start); 
                  const dateB = new Date(b.start); 
                  return dateA - dateB;
                });


              console.log("Events retrieved for the organizer:", this.organizerEvents);
              console.log("Revenue", this.revenueCounts)

              // Render the charts after the DOM has been updated and organizerEvents is populated
              this.$nextTick(() => {
                this.renderPieChart();
                this.renderBarChart();
                this.renderRevenueChart();
              });
            } else {
              console.warn("No events found for this organizer in Firebase Database.");
            }
          } else {
            console.warn("Access denied: User is not an organizer.");
            this.$router.push('/');
          }
        } else {
          console.warn("No user data found in Firebase Database.");
          this.$router.push('/');
        }
      } else {
        console.warn("User is not authenticated.");
        this.$router.push('/');
      }
    });

    window.addEventListener('resize', this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    totalAttendees() {
      return this.organizerEvents.reduce((total, event) => total + (event.signups ? Object.keys(event.signups).length : 0), 0);
    },

    eventNames() {
      return this.organizerEvents.map(event => event.title);
    },
    attendeeCounts() {
      return this.organizerEvents.map(event => event.signups ? Object.keys(event.signups).length : 0);
    },
    revenueCounts() {
      return this.organizerEvents.map(event => {
        const attendeeCount = event.signups ? Object.keys(event.signups).length : 0;
        const price = event.price || 0;
        return attendeeCount * price;
      });
    },
  },
  methods: {
    viewEventStatistics(eventId) {
      // Navigate to the event statistics page
      this.$router.push({ name: 'EventStatistics', params: { eventId } });
    },

    handleResize() {
      if (this.pieChartInstance) this.pieChartInstance.resize();
      if (this.barChartInstance) this.barChartInstance.resize();
      if (this.revenueChartInstance) this.revenueChartInstance.resize();
    },

    renderPieChart() {
      const ctxPie = document.getElementById('attendeePieChart').getContext('2d');
      if (this.pieChartInstance) this.pieChartInstance.destroy();
      this.pieChartInstance = new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: this.eventNames,
          datasets: [{
            data: this.attendeeCounts,
            backgroundColor: ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Attendee Distribution per Event'
            }
          }
        }
      });
    },

    renderBarChart() {
      const ctxBar = document.getElementById('attendeeBarChart').getContext('2d');
      if (this.barChartInstance) this.barChartInstance.destroy(); 
      this.barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: this.eventNames,
          datasets: [{
            label: 'Number of Attendees',
            data: this.attendeeCounts,
            backgroundColor: ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Number of Attendees per Event'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },

    renderRevenueChart() {
      const ctxRevenue = document.getElementById('revenueBarChart').getContext('2d');
      if (this.revenueChartInstance) this.revenueChartInstance.destroy(); 
      this.revenueChartInstance = new Chart(ctxRevenue, {
        type: 'bar',
        data: {
          labels: this.eventNames,
          datasets: [{
            label: 'Revenue per Event',
            data: this.revenueCounts,
            backgroundColor: ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Revenue per Event'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Revenue ($)'
              }
            }
          }
        }
      });
    }
  }
};
</script>


<style scoped>
.organizer-dashboard {
  padding: 20px;
  width: 50%;
}

.component-box {
  border: 1px solid grey;
  padding: 10px;
  margin: 10px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.signups-table {
  margin-top: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.smallBrowser {
  display: none;
}

@media (max-width: 1024px) {
  .graph {
    display: none;
  }

  .smallBrowser {
    display: block;
  }
}

@media (max-width: 768px) {
  .smallBrowser {
    display: block;
  }

  .signups-table {
    display: none;
  }
}
</style>
