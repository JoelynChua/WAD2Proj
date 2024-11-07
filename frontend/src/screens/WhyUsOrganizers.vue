<template>
    <section>
        <div class="container">
            <img src="../assets/organizer_background.jpg" class="background-img">
            <div class="fade-in-text">
                <div>HOST YOUR</div>
                <Typical class="typer" :steps="['> EVENTS', 2000, '> PARTY', 2000, '> TOUR', 2000]" :loop="Infinity" wrapper="span" />
                <div>WITH US</div>
                <button onclick="window.location.href='mailto:wad2proj@gmail.com'">Contact Us</button>
            </div>
            <img src="../assets/boat.gif" class="boat-1">
            <img src="../assets/boat2.gif" class="moving-boat">
        </div>
    </section>
</template>

<script>
import { defineComponent } from 'vue';
import Typical from 'vue-typical';

export default defineComponent({
    components: {
        Typical
    }
});
</script>

<style scoped>
* {
    font-family: "BasementGrotesque-Black", sans-serif;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-width: 100vw; /* Prevents overflow */
    height: 120vh !important;
    font-weight: 900;
    text-align: center;
    color: transparent;
    -webkit-text-stroke: 2px white;
    font-size: 100px;
    text-wrap: nowrap;
    overflow: hidden; /* Hides overflow */
    position: relative;
}

.background-img {
    position: absolute;
    width: 100%;
    height: 100%;
}

.fade-in-text {
    z-index: 10;
    animation: fadeIn 2s ease forwards;
    opacity: 0;
    background-color: transparent;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.typer {
    background-image: linear-gradient(90deg, rgb(160, 188, 232), rgb(111, 149, 209));
    color: transparent;
    background-clip: text;
    -webkit-text-stroke: 1px rgb(54, 51, 104);
    text-wrap: nowrap;
}

button {
    background: linear-gradient(90deg, rgb(160, 188, 232), rgb(14, 61, 136));
    padding: 8px 3px;
    font-weight: 100;
    margin-top: 15px;
    width: 200px;
    color: white;
    border: 1px solid white;
    cursor: pointer;
    border-radius: 8px;
    font-size: 24px;
    font-family: cursive;
    text-align: center;
    -webkit-text-stroke: 0px white;
}

.boat-1 {
    height: 100px;
    position: absolute;
    right: 30%;
    top: 145px;
}

.moving-boat {
    height: 200px;
    position: absolute;
    top: 175px;
    animation: moveBoat 12s linear infinite;
}

@keyframes moveBoat {
    0% {
        left: -150px;
    }
    100% {
        left: calc(100vw + 150px);
    }
}

@media (max-width: 450px) {
    .container {
        font-size: 3rem;
    }
}
</style>
