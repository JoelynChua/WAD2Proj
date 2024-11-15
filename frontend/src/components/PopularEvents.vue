<template>
    <div class="pop-events">
        <h1 class="mt-3 fe-title">featured</h1>
        <swiper :slidesPerView="4" :spaceBetween="50" :grabCursor="true" :pagination="{
            clickable: true,
        }" :modules="modules" :breakpoints="{
            320: {
                slidesPerView: 2,
                spaceBetween: 10
            },
            540: {
                slidesPerView: 2,
                spaceBetween: 10
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 15
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 20
            }
        }" class="mySwiper">
            <swiper-slide v-for="event in events" :key="event.id" class="event-box event" @click="goToEventDetails(event.id)"
                style="cursor: pointer; position: relative">
                <!-- Event Image Container -->
                <div class="event-image-container">
                    <img :src="event.images[0].url || 'https://via.placeholder.com/300x200?text=Event+Image'"
                        alt="Event image" class="event-image" />
                </div>

                <!-- Event Details -->
                <div class="card-body text-start">
                    <p class="card-text">{{ event.classifications && event.classifications[0] ?
                        event.classifications[0].genre.name : event.type }}</p>
                    <h5 class="card-title fs-4 mb-0">
                        <span>
                            {{ event.name.length > 48 ? event.name.substring(0, 38) + '...' : event.name }}
                        </span>
                    </h5>
                    <p class="card-text mt-0">
                        {{ new Date(event.dates?.start?.dateTime).toLocaleDateString('en-US',
                            {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) == "Invalid Date" ? "Date TBC" : new Date(event.dates?.start?.dateTime).toLocaleDateString('en-US',
                            {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) }}
                    </p>
                </div>

            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Pagination } from 'swiper/modules';

export default {
    name: 'PopularEvents',
    components: {
        Swiper,
        SwiperSlide,
    },
    props: ['events', 'isEvent'],
    setup() {
        const onSlideClick = (category) => {
            console.log(`${category} clicked`);
        };

        return {
            modules: [Pagination],
            onSlideClick,
        };
    },
    methods: {
        goToEventDetails(id) {
            if (this.isEvent) {
                this.$router.push({ name: 'EventDetails', params: { id } });
            } else {
                this.$router.push({ name: 'AttractionDetails', params: { id } });

            }
        },
    }
};
</script>

<style scoped>
.fe-title {
    padding-top: 100px;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
}

.pop-events {
    margin-top: 30px;
    padding-bottom: 50px !important;
    padding: 1px;
    font-family: graphie, sans-serif;
    border-bottom: 1px solid silver;
}

.pop-events h1 {
    color: rgb(51, 51, 51);
}

.event-box {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 15px;
    width: 300px !important;
    height: 350px !important;
    flex-shrink: 0;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin: 0 auto;
}

.event-image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 15px 15px 0 0;
}

.event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.event-details {
    padding: 15px;
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.event-details p {
    font-size: 1.1rem;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #34495e;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    line-height: 1.4;
}

.mySwiper {
    margin: 30px auto;
    padding: 20px 0;
    max-width: 1200px;
    overflow: hidden;
}

.swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease;
}

.swiper-slide:hover {
    transform: scale(1.05);
}

:deep(.swiper-pagination) {
    position: relative;
    margin-top: 20px;
}

:deep(.swiper-wrapper) {
    overflow: visible;
    padding: 20px 0;
    /* Add padding to account for hover scale effect */
}

.card-body {
    padding: 1.5rem;
    background: white;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.75rem;
}

.card-text {
    color: #718096;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

.event:hover {
    transform: scale(1.03);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

.event:hover .icon-container {
    opacity: 1;
}

.event-image {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    object-fit: cover;
}

.event {
    position: relative;
    border: none;
    border-radius: 15px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    margin: 0 auto;
    height: 340px !important;
}

.event:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
</style>