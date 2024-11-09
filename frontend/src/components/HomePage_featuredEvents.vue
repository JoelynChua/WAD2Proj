<template>
  <h2 class="fe-title">featured events</h2>
  <h5 class="fe-secondary">SINGAPORE</h5>
  <div class="pop-events">
    <div id="carouselController" class="text-end">
      <i @click="prev" :class="['fi', 'fi-rr-angle-circle-left', 'h1', 'me-1', { 'active': isPrevActive }]"
        @mouseenter="isPrevActive = true" @mouseleave="isPrevActive = false"></i>
      <i @click="next" :class="['fi', 'fi-rr-angle-circle-right', 'h1', { 'active': isNextActive }]"
        @mouseenter="isNextActive = true" @mouseleave="isNextActive = false"></i>
    </div>

    <swiper :slidesPerView="4" :spaceBetween="100" :grabCursor="true" :pagination="{
      clickable: true,
    }" :modules="modules" :breakpoints="{
      0: {
        slidesPerView: 1,
      },
      440: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 50
      }
    }" class="mySwiper" @swiper="setSwiperInstance">
      <swiper-slide v-for="event in events" :key="event.id" class="event-box" @click="goToEventDetails(event.id)"
        style="cursor: pointer; position: relative">
        <!-- Event Image Placeholder -->
        <div class="event-image-container" @click="navigateToLink(event.link)">
          <img :src="event.image || 'https://via.placeholder.com/300x200?text=Event+Image'" alt="Event image"
            class="event-image"/>
        </div>

        <div class="event-details" @click="navigateToLink(event.link)">
          <div
            style="font-weight: 600; font-size: 22px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
            {{ event.name }}</div>

          <div style="font-weight: 400; font-size: 14px;">{{ event.date }}</div>

          <div style="font-weight: 400; font-size: 14px;">{{ event.location }}</div>
          <div class="mt-4">{{ event.price }}</div>
          <div class="mt-3" style="font-size: 14px;"><i class="fi fi-rs-following"></i> {{ event.followers }} followers
          </div>

        </div>

      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export default {
  name: 'PopularEvents',
  data() {
    return {
      events: [
        {
          image: require('@/assets/featuredEvents/1.jpg'),
          date: '26 March 2025, 8:00PM',
          name: 'keshi: REQUIEM TOUR in Singapore',
          location: 'Singapore Indoor Stadium',
          price: 'From S$128',
          followers: '6833',
          link: 'https://ticketmaster.sg/activity/detail/25sg_keshi',
        },
        {
          image: require('@/assets/featuredEvents/2.jpg'),
          date: '8 February 2025, 8:00PM',
          name: 'THE SCRIPT: Satellites World Tour 2025 Singapore',
          location: 'Singapore Indoor Stadium',
          price: 'From S$115',
          followers: '5882',
          link: 'https://www.sistic.com.sg/events/scriptwt0225'
        },
        {
          image: require('@/assets/featuredEvents/3.jpg'),
          date: '3 February 2025, 8:00PM',
          name: 'Cigarettes After Sex – Live in Singapore',
          location: 'Singapore Indoor Stadium',
          price: 'From S$98',
          followers: '5328',
          link: 'https://www.sistic.com.sg/events/cas0225',
        },
        {
          image: require('@/assets/featuredEvents/4.jpg'),
          date: '7 June 2025, 7:30PM',
          name: 'Symphony of Ink 《墨韵》 [G]',
          location: 'Singapore Chinese Orchestra (SCO Conference Hall)',
          price: 'From S$20',
          followers: '3892',
          link: 'https://www.sistic.com.sg/events/ink0625',
        },
        {
          image: require('@/assets/featuredEvents/5.jpg'),
          date: '11 February 2025, 8:00PM',
          name: 'Russell Howard - Live in Singapore [Rating: TBA]',
          location: 'Capitol Theatre',
          price: 'From S$108',
          followers: '3002',
          link: 'https://www.sistic.com.sg/events/howard0225'
        },
        {
          image: require('@/assets/featuredEvents/6.jpg'),
          date: '18 January 2025, TBC',
          name: 'Beauty and the Beast in Concert [G]',
          location: 'Esplanade Theatre',
          price: 'From S$38',
          followers: '2112',
          link: 'https://www.sistic.com.sg/events/beauty0125'
        },
        {
          image: require('@/assets/featuredEvents/7.jpg'),
          date: '18 February 2025, TBC',
          name: 'Anna Akana - It Gets Darker! [Rating: TBA]',
          location: 'Capitol Theatre',
          price: 'From S$58',
          followers: '1839',
          link: 'https://www.sistic.com.sg/events/anna0225'
        },
        {
          image: require('@/assets/featuredEvents/8.jpg'),
          date: '13 February 2025, TBC',
          name: 'The Way Back Home [G]',
          location: 'Victoria Theatre',
          price: 'From S$42',
          followers: '1255',
          link: 'https://www.sistic.com.sg/events/kidsfest0325b'
        },
      ],
      swiperInstance: null,
      isPrevActive: false,
      isNextActive: false,
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
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
    navigateToLink(link) {
      if (link) {
        window.location.href = link; // Navigates to the link directly
      }
    },
    goToEventDetails(event) {
      this.$emit('popevent', event)
    },
    next() {
      if (this.swiperInstance) {
        this.swiperInstance.slideNext();
        this.swiperInstance.slideNext();
        this.swiperInstance.slideNext();
        this.swiperInstance.slideNext();
      }
    },
    prev() {
      if (this.swiperInstance) {
        this.swiperInstance.slidePrev();
        this.swiperInstance.slidePrev();
        this.swiperInstance.slidePrev();
        this.swiperInstance.slidePrev();
      }
    },
    setSwiperInstance(swiper) {
      this.swiperInstance = swiper;
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

.fe-secondary {
  padding-top: 30px;
  color: rgb(207, 89, 59);
  text-align: center;
}

.pop-events {
  background-color: #f9f9f9;
  margin-top: 30px;
  padding: 1px;
  font-family: graphie, sans-serif;
}

.pop-events h1 {
  color: #f0f0f0
}

.event-box {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  width: 400px;
  height: 350px;
  flex-shrink: 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-image-container {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.event-image {
  width: 100%;
  min-height: 150px;
  max-height: 150px;
  object-fit: cover;

}

.event-details {
  padding: 15px;
  text-align: start;
  flex-grow: 1;
}

.mySwiper {
  margin: 30px auto;
  padding-top: 10px;
  max-width: 1200px;
  overflow: hidden;
  z-index: 10;
}

.swiper-slide {
  background: #f0f0f0;
  /* Placeholder background color */
  border-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: transform 0.3s ease;
  text-align: center;
  width: auto;
  flex-shrink: 0;
  height: 400px;
  z-index: 10;
}

.swiper-slide:hover {
  transform: scale(1.05);
  /* Slight zoom effect on hover */
}

:deep(.swiper-pagination) {
  position: relative;
  margin-top: 20px;
  /* Increase the value to move it lower */
}

:deep(.swiper-wrapper) {
    overflow: visible;
    padding: 20px 0; /* Add padding to account for hover scale effect */
}


.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.swiper-wrapper) {
  overflow: visible;
}

@media (max-width: 520px) {
  #carouselController {
    display: flex;
    justify-content: center;
    margin-right: 0px !important;
  }
}

#carouselController {
  margin-right: 15%;
}

i {
  transition: transform 0.2s ease, color 0.2s ease;
}

i:hover {
  transform: scale(1.1);
  color: rgb(207, 89, 59);
}

i:active {
  animation: clickAnimation 0.1s forwards;
}

@keyframes clickAnimation {
  0% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>