<template>
    <div class="pop-events">
        <h1 v-if="isEvent" class="mt-3">Check out these popular Events</h1>
        <h1 v-else class="mt-3">Check out these popular Attractions</h1>
        <swiper
          :slidesPerView="4"
          :centeredSlides="true"
          :spaceBetween="50"
          :grabCursor="true"
          :pagination="{
            clickable: true,
          }"
          :modules="modules"
          :breakpoints="{
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
            }"
          class="mySwiper"
        >
            <swiper-slide
                v-for="event in events"
                :key="event.id"
                class="event-box"
                @click="goToEventDetails(event.id)"
                style="cursor: pointer; position: relative"
                >
                <!-- Event Image Container -->
                <div class="event-image-container">
                    <img
                        :src="event.images[0].url || 'https://via.placeholder.com/300x200?text=Event+Image'"
                        alt="Event image"
                        class="event-image"
                    />
                </div>

                <div class="event-details">
                    <p>{{ event.name }}</p>
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
.pop-events {
    background-color: #333;
    margin-top: 100px;
    padding: 1px;
    font-family: graphie, sans-serif;
}

.pop-events h1 {
    color: #f0f0f0;
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
    padding: 20px 0; /* Add padding to account for hover scale effect */
}
</style>