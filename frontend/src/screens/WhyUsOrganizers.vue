<template>
    <section>
        <div class="container">
            <img src="../assets/organizer_background.jpg" height="100%" width="100%">
            <div class="fade-in-text" style="z-index: 10; background-color: transparent;">
                <div style="background-color: transparent;">HOST YOUR</div>
                <Typical class="typer" :steps="['> EVENTS', 2000, '> PARTY', 2000, '> TOUR', 2000]" :loop="Infinity" wrapper="span" />
                <div style="background-color: transparent;">WITH US</div>
                <button onclick="window.location.href='mailto:wad2proj@gmail.com'">Contact Us</button>
            </div>
            <img src="../assets/boat.gif" height="100px" style="position: absolute; right: 30%; top: 145px;">
            <img src="../assets/boat2.gif" class="moving-boat" height="200px">
        </div>
            <!-- <div class="stats">
                <div class="stat">
                    <h2><img src="../assets/money-bag.gif" width="80px"></h2>
                    <h2><b>Earn Revenue</b></h2>
                    <p>Be rewarded for doing what you love! Anybody can host events, anytime.</p>
                </div>
                <div class="stat">
                    <h2><img src="../assets/social-media.gif" width="80px"></h2>
                    <h2><b>Unlimited Outreach</b></h2>
                    <p>Once it's up there, its' out there! Anybody can sign up, from anywhere.</p>
                </div>
                <div class="stat">
                    <h2><img src="../assets/like.gif" width="80px"></h2>
                    <h2><b>Be Rated </b></h2>
                    <p>Participants can rate their favourite events. Gain more outreach by standing out!</p>
                </div>
            </div> -->
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
    height: 100vh;
    font-weight: 900;
    text-align: center;
    color: transparent;
    -webkit-text-stroke: 2px white;
    font-size: 100px;
    text-wrap: nowrap;

}

section {


}

.container img {
    position: absolute;
    padding: 0px;
    margin: 0px;

}

.fade-in-text {
    animation: fadeIn 2s ease forwards;
    opacity: 0;
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
}

@media (max-width: 450px) {
    .container {
        font-size: 3rem;
    }
}

.data {
    text-align: center;
    padding: 20px;
}

.header h1 {
    font-size: 2em;
    margin-bottom: 20px;
}

.header p {
    font-size: 1em;
    margin-bottom: 40px;
}

.stats {
    display: flex;
    margin-top: 0 !important;
    justify-content: space-around;
    font-family: 'graphie';
    padding: 50px;


}

.stat {
    background-image: url('../assets/mat.png');
    background-size: 100%;
    background-repeat: no-repeat;
    color: #000000;
    padding: 20px;
    padding-top: 10%;
    width: 250px;
    height: 450px;
}

.stat h2 {
    font-size: 1.2em;
    margin-bottom: 10px;
}

.stat p {
    font-size: 1em;
}

@keyframes moveBoat {
    0% {
        left: -150px;
    }
    100% {
        left: 100%;
    }
}

.moving-boat {
    position: absolute;
    top: 175px;
    animation: moveBoat 25s linear infinite;
}
</style>
