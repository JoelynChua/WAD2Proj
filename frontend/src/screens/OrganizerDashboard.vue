<template>
  <div class="container-fluid organizer-dashboard">
    <h1>Welcome to the Organizer Dashboard, {{ organizerName }}!</h1>
    <p>This is your workspace for managing events, viewing analytics, and more.</p>

    <!-- Event Summary with Borders and Margins -->
    <div class="row component-box">
      <div class="col-md-4" v-for="(event, index) in events" :key="index">
        <div class="card text-center border m-3" :style="{ backgroundColor: event.color, color: '#fff' }">
          <div class="card-body">
            <h5 class="card-title">{{ event.name }}</h5>
            <p class="card-text">Attendees: {{ event.attendees }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Attendees -->
    <div class="text-center my-4 border p-3">
      <h3>Total Attendees: {{ totalAttendees }}</h3>
    </div>

    <!-- Charts Section with Borders and Margins -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-5 component-box">
        <canvas id="attendeePieChart"></canvas>
      </div>
      <div class="col-12 col-md-6 col-lg-5 component-box">
        <canvas id="attendeeBarChart"></canvas>
      </div>
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
      events: [
        { name: 'Event 1', attendees: 12, color:"#A44A3F" },
        { name: 'Event 2', attendees: 15, color: "#3C7A89" },
        { name: 'Event 3', attendees: 7, color: "#2E4756" },
      ],
      pieChartInstance: null,
      barChartInstance: null,
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
            this.organizerName = userData.displayName || 'Organizer';
            console.log("Display name retrieved from Firebase Database:", this.organizerName);
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

    this.renderPieChart();
    this.renderBarChart();

    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    totalAttendees() {
      return this.events.reduce((total, event) => total + event.attendees, 0);
    },
    eventNames() {
      return this.events.map(event => event.name);
    },
    attendeeCounts() {
      return this.events.map(event => event.attendees);
    },
  },
  methods: {
    handleResize() {
      if (this.pieChartInstance) this.pieChartInstance.resize();
      if (this.barChartInstance) this.barChartInstance.resize();
    },
    renderPieChart() {
      const ctxPie = document.getElementById('attendeePieChart').getContext('2d');
      this.pieChartInstance = new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: this.eventNames,
          datasets: [{
            data: this.attendeeCounts,
            backgroundColor: ['#A44A3F', '#3C7A89', '#2E4756'],
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
      this.barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: this.eventNames,
          datasets: [{
            label: 'Number of Attendees',
            data: this.attendeeCounts,
            backgroundColor: ['#A44A3F', '#3C7A89', '#2E4756'],
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
    }
  }
};
</script>

<style scoped>
.organizer-dashboard {
  padding: 20px;
}
.component-box {
  border: 3px solid;
  border-radius: 20px;
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
</style>

