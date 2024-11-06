<template>
    <div class="calendar-page">
        <CalendarComponent />
    </div>
</template>

<script>
import CalendarComponent from '../components/Calendar/CalendarComponent.vue';

export default {
    name: 'CalendarPage',
    components: {
        CalendarComponent,
    },
};
</script>

<style scoped>
.calendar-page {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    height: calc(100vh); 
    overflow-y: auto;
    background-color: #f9f9f9; 
}
</style>
