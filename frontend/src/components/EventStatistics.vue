<template>
  <div class="event-statistics">
    <h1><b>{{ eventTitle }}</b></h1>

    <p><strong>Description:</strong> {{ eventDescription }}</p>
    <p><strong>Start Time:</strong> {{ eventStartTime }}</p>
    <p class="mb-5"><strong>Price:</strong> ${{ eventPrice }}</p>

    <table class="table mx-auto">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Age</th> <!-- Changed to display Age -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(signup, index) in signupsDetails" :key="signup.uid">
          <td>{{ index + 1 }}</td>
          <td>{{ signup.displayName }}</td>
          <td>{{ signup.email }}</td>
          <td>{{ signup.contact }}</td>
          <td>{{ signup.age }}</td> <!-- Display age instead of date of birth -->
        </tr>
      </tbody>
    </table>
    <!-- Display other event-specific statistics here -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ref as firebaseRef, get } from 'firebase/database';
import { database } from '../firebase/firebaseClientConfig';  // Adjust path as necessary

export default {
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const eventTitle = ref('');
    const eventDescription = ref('');
    const eventStartTime = ref('');
    const eventPrice = ref('');
    const eventSignups = ref([]);
    const signupsDetails = ref([]);

    // Helper function to calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
        age--; // Subtract one year if the birthday hasn't occurred yet this year
      }
      return age;
    };

    onMounted(async () => {
      const eventId = props.eventId;
      const eventRef = firebaseRef(database, `events/${eventId}`);
      const snapshot = await get(eventRef);

      if (snapshot.exists()) {
        const eventData = snapshot.val();
        eventTitle.value = eventData.title;
        eventDescription.value = eventData.description || 'N/A'; // Display description
        eventStartTime.value = new Date(eventData.start).toLocaleString() || 'N/A'; // Format start time
        eventPrice.value = eventData.price || 0; // Display price

        eventSignups.value = Object.keys(eventData.signups || {});

        // Fetch user details for each signup
        for (const uid of eventSignups.value) {
          const userRef = firebaseRef(database, `users/${uid}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            const age = userData.dateOfBirth ? calculateAge(userData.dateOfBirth) : 'N/A'; // Calculate age

            signupsDetails.value.push({
              uid,
              displayName: userData.displayName || 'N/A',
              email: userData.email || 'N/A',
              contact: userData.mobileNumber || 'N/A',
              age,
            });
          }
        }
      }
    });

    return {
      eventTitle,
      eventDescription,
      eventStartTime,
      eventPrice,
      signupsDetails,
    };
  },
};
</script>

<style scoped>
.table {
  width: 80%;
  max-width: 768px;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
}

.table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
}

.table th {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}
</style>