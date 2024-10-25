<template>
    <div class="calendar-page">
        <Cal />
        <CalendarComponent />
    </div>
</template>

<script>
import CalendarComponent from '../components/Calendar/CalendarComponent.vue';
import Cal from '../components/GoogleCalendar.vue';

export default {
    name: 'CalendarPage',
    components: {
        CalendarComponent,
        Cal,
    },
};
</script>

<style scoped>
.calendar-page {
    padding: 20px;
}
</style>
