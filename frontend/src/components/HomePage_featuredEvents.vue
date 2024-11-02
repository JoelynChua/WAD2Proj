<template>
  <h2 class="fe-title">featured events</h2>
  <h5 class="fe-secondary">SINGAPORE</h5>
  <div class="fe-carousel">
    <div class="text-end">
      <i @click="prev" :class="['fi', 'fi-rr-angle-circle-left', 'h1', 'me-1', { 'active': isPrevActive }]" @mouseenter="isPrevActive = true" @mouseleave="isPrevActive = false"></i>
      <i @click="next" :class="['fi', 'fi-rr-angle-circle-right', 'h1', { 'active': isNextActive }]" @mouseenter="isNextActive = true" @mouseleave="isNextActive = false"></i>
    </div>
    <Carousel ref="carouselRef" :itemsToShow="4" :itemsToScroll="6" :transition="250">
      <Slide v-for="(slide, index) in slides" :key="index">
        <div class="carousel__slide-content">
          <img :src="slide.image" alt="Event Image" class="carousel__slide-image" />
          <div class="carousel__slide-card">
            <p class="carousel__slide-text lead"><b>{{ slide.title }}</b></p>
            <p class="carousel__slide-text carousel__slide-description">{{ slide.date }}</p>
            <p class="carousel__slide-text carousel__slide-description">{{ slide.location }}</p>
            <p class="carousel__slide-text mt-1 mb-1"><b>{{ slide.price }}</b></p>
            <p class="carousel__slide-text carousel__slide-description">{{ slide.followers }} followers</p>
          </div>
        </div>
      </Slide>
      <template #addons>
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css';
import { ref } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';

const carouselRef = ref();
const isPrevActive = ref(false);
const isNextActive = ref(false);

const next = () => carouselRef.value.next();
const prev = () => carouselRef.value.prev();
</script>

<script>

export default {
  name: 'featuredEvents',
  data() {
    return {
      slides: [
        {
          image: require('@/assets/featuredEvents/1.jpg'),
          date: '31 December 2024, 04:00PM',
          title: 'Premier League Summer Series',
          location: 'Singapore National Stadium',
          price: '$5.99',
          followers: '420'
        },
        {
          image: require('@/assets/featuredEvents/2.jpg'),
          date: '1 October 2025, 8:00PM',
          title: 'Olivia Rodrigo: Guts World Tour',
          location: 'Singapore Indoor Stadium',
          price: '$99.90',
          followers: '50'
        },
        {
          image: require('@/assets/featuredEvents/3.jpg'),
          date: '29 November 2025, All Day',
          title: 'Gardens By The Bay: Carnival of Flowers',
          location: 'Gardens By The Bay',
          price: '$49.90',
          followers: '993'
        },
        {
          image: require('@/assets/featuredEvents/4.jpg'),
          date: 'Today at 10:00pm',
          title: 'AKON: The Superfan Tour 2025',
          location: 'Arena @ Expo Hall 7',
          price: 'Free',
          followers: '310'
        },
        {
          image: require('@/assets/featuredEvents/5.jpg'),
          date: '24 January 2025, 6:00PM',
          title: 'Coldplay x Michael Jackson',
          location: 'Singapore National Stadium',
          price: '$49,90',
          followers: '78326'
        },
        {
          image: require('@/assets/featuredEvents/6.jpg'),
          date: '11 October 2024, 7:00PM',
          title: 'Jay Chou: World Tour 2025',
          location: 'Singapore National Stadium',
          price: '$129.90',
          followers: '83127'
        },
        {
          image: require('@/assets/featuredEvents/7.jpg'),
          date: '31 October 2025, 7:00PM',
          title: 'Bruno Mars: Singapore World Tour 2025',
          location: 'Singapore National Stadium',
          price: '$100.00 - $190.00',
          followers: '93821'
        },
        {
          image: require('@/assets/featuredEvents/8.jpg'),
          date: '31 October 2025, 7:00PM',
          title: 'NBL Finals: London Mets vs New York Nets',
          location: 'Metro Center, DC',
          price: '$100.00 - $190.00',
          followers: '932821'
        },
      ],
    };
  },
  components: {
    Carousel,
    Slide,
  },
  methods: {
  },
};
</script>

<style scoped>
.fe-title {
  padding-top: 100px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}

.fe-secondary {
  padding-top: 30px;
  color: rgb(207, 89, 59);
  text-align: center;
}

.fe-carousel {
  padding: 50px;
  margin: 0px 15%;
}

.carousel__slide-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 40px;
  text-align: center;
  color: white;
}

.carousel__slide-image {
  width: 250px;
  height: 140px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.carousel__slide-card {
  background: #fff;
  text-align: start;
  padding-top: 20px;
  padding-left: 15px;
  padding-bottom: 50px;
  border-radius: 0px 0px 10px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: -38px;
  z-index: -5;
}

.carousel__slide-text {
  color: #333;
  margin-bottom: 0px;
}

.fi.active {
  color: rgb(207, 89, 59);
  transform: scale(1.1);
  transition: all 0.2s;
}

.carousel__slide-description {
  font-size: 15px;
}
</style>
