<template>
  <div class="chart-container">
    <chart />
  </div>
</template>

<script>
import chart from "@/components/ExpensePage_chart.vue";

export default {
  data() {
    return {
      id: undefined,
    };
  },
  components: {
    chart: chart,
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;                /* Use flexbox for centering */
  justify-content: center;      /* Center horizontally */
  align-items: center;          /* Center vertically */
}

/* You can adjust the width and height as needed */
</style>
