<template>
    <section>
        <div class="container">
            <img src="../assets/organizer_background.png" height="100%">
            <div>HOST YOUR</div>
            <Typical class="typer" :steps="['> EVENTS', 2000, '> PARTY', 2000, '> TOUR', 2000]" :loop="Infinity"
                wrapper="span" />
            <span>WITH US</span>
            <button onclick="window.location.href='mailto:wad2proj@gmail.com'">Email Us</button>

        </div>
    </section>

    <section>
        <div class="data">
            <div class="header">
                <h1><b>YOU DON'T NEED A BUSINESS TO HOST EVENTS</b></h1>
                <p>Without a high-performing website, you're not just losing clicks; you're losing opportunities to grow
                    your business. Every visitor could be a potential customer, and without the right tools to capture
                    and convert them, your marketing efforts are not fully capitalized. It’s essential to have an
                    engaging, effective online presence to ensure you’re not leaving money on the table.</p>
            </div>
            <div class="stats">
                <div class="stat">
                    <h2>MOBILE</h2>
                    <p>54.8%</p>
                    <p>Mobile devices generate 54.8% of global web traffic.</p>
                </div>
                <div class="stat">
                    <h2>WEBSITE</h2>
                    <p>42.0%</p>
                    <p>42% of people will leave a website with poor functionality.</p>
                </div>
                <div class="stat">
                    <h2>WEBSITE</h2>
                    <p>88.5%</p>
                    <p>88.5% of people will leave a slow loading website.</p>
                </div>
            </div> <button class="cta-button">Let's Get Started</button>
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
    height: 100vh;
    font-weight: 900;
    text-align: center;
    color: transparent;
    -webkit-text-stroke: 2px white;
    font-size: 6rem;
}

.container img {
    z-index: -5;
    position: absolute;
    padding: 0px;
    margin: 0px;
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
    font-weight: 0;
    margin-top: 25px;
    width: 200px;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-size: 24px;
    font-family: sans-serif;
    text-align: center
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
    justify-content: space-around;
    margin-bottom: 40px;
    font-family: 'graphie';

}

.stat {
    background-color: #000;
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 30%;
}

.stat h2 {
    font-size: 1.2em;
    margin-bottom: 10px;
}

.stat p {
    font-size: 1em;
}

.cta-button {
    background-color: #ff7f50;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
}

.cta-button:hover {
    background-color: #ff4500;
}
</style>
