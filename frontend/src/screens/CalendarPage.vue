<template>
    <div class="calendar-page">
        <CalendarComponent />
        <Cal />
    </div>
</template>

<script>
import CalendarComponent from '../components/Calendar/CalendarComponent.vue';
import Cal from '../components/NewCalendar.vue';

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
