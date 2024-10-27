<template>
    <section class="go-somewhere">
        <h2 class="go-somewhere__title">go somewhere</h2>
        <div class="go-somewhere__grid p-5 pb-0">
            <div class="go-somewhere__item" @click="this.$router.push('/events')">
                <img src="../assets/gosomewhere/gosomewhere_find.png">
                find activities
            </div>
            <div class="go-somewhere__item" @click="this.$router.push('/ExpensePage')">
                <img src="../assets/gosomewhere/gosomewhere_shop.png">
                calculate expenses
            </div>
            <div class="go-somewhere__item">
                <img src="../assets/gosomewhere/gosomewhere_build.png">
                build an itinerary
            </div>
        </div>
        <div class="go-somewhere__grid p-5 pt-0">
            <div class="go-somewhere__item">
                <img src="">
                find an attraction
            </div>
            <div class="go-somewhere__item">
                <img src="../assets/gosomewhere/gosomewhere_tickets.png">
                show tickets
            </div>
            <div class="go-somewhere__item">
                <img src="">
                edit my profile
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
        };
    },
};
</script>

<style scoped>
.go-somewhere {
    text-align: center;
    padding: 2rem;
    padding-top: 100px;
    color: #fff;
    background: #121212;
}

.go-somewhere__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #ddd;
}

.go-somewhere__grid {
    display: flex;
    justify-content: center;
    padding-bottom: 0px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.go-somewhere__item {
    background: rgba(255, 255, 255, 0.1);
    width: 300px;
    border-radius: 8px;
    padding: 30px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease;
}

.go-somewhere__item:hover {
    transform: scale(1.05);
}

.go-somewhere__icon img {
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
}

.go-somewhere__text p {
    font-size: 1rem;
    color: #bbb;
    text-transform: capitalize;
}
</style>