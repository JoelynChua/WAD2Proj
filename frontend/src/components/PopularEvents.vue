<template>
    <div class="pop-events">
        <h1 class="mt-3">Check out the popular events</h1>
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
                <!-- Event Image Placeholder -->
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
props: ['events'],
setup() {
    const onSlideClick = (category) => {
    console.log(`${category} clicked`);
    // Add additional logic for when the slide is clicked
    };

    return {
    modules: [Pagination],
    onSlideClick, // Expose the onSlideClick function
    };
},
methods: {
    goToEventDetails(id) {
            // Use Vue Router's 'push' method to navigate to EventDetails page
            this.$router.push({ name: 'EventDetails', params: { id } });
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
.pop-events h1{
    color: #f0f0f0
}

.event-box {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 15px;
    width: 400px;
    height: 300px;
    flex-shrink: 0;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-image-container {
    width: 100%;
    overflow: hidden;
    border-radius: 8px; /* Match card rounding */
}

.event-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    
}

.event-details {
    padding: 15px;
    text-align: center;
    flex-grow: 1;
}

.event-details p {
    font-size: 1.1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical;
    color: #34495e;
    margin: 10px 0;
    overflow: hidden; 
    text-overflow: ellipsis; 
    height: 100%; 
    margin: 0 auto; 
}

/* Optional Swiper styling to make it match the design */
.mySwiper {
margin: 30px auto;
padding-top: 10px;
max-width: 1200px;
overflow: hidden;
}

.swiper-slide {
background: #f0f0f0; /* Placeholder background color */
border-radius: 10px;
display: flex;
align-items: center;
font-size: 1.2em;
font-weight: bold;
color: #333;
cursor: pointer;
padding: 20px 10px;
transition: transform 0.3s ease;
text-align: center;
width: auto;
flex-shrink: 0;
height: 300px;
}

.swiper-slide:hover {
transform: scale(1.05); /* Slight zoom effect on hover */
}

::v-deep .swiper-pagination {
  position: relative;
  margin-top: 20px; /* Increase the value to move it lower */
}


.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

::v-deep .swiper-wrapper {
    overflow: visible;
}
</style>
