<template>
  <h2 class="fe-title">featured events</h2>
  <h5 class="fe-secondary">SINGAPORE</h5>
  <div class="pop-events">
    <div class="text-end">
      <i @click="prev" :class="['fi', 'fi-rr-angle-circle-left', 'h1', 'me-1', { 'active': isPrevActive }]" @mouseenter="isPrevActive = true" @mouseleave="isPrevActive = false"></i>
      <i @click="next" :class="['fi', 'fi-rr-angle-circle-right', 'h1', { 'active': isNextActive }]" @mouseenter="isNextActive = true" @mouseleave="isNextActive = false"></i>
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
    }" class="mySwiper">
      <swiper-slide v-for="event in events" :key="event.id" class="event-box" @click="goToEventDetails(event.id)"
        style="cursor: pointer; position: relative">
        <!-- Event Image Placeholder -->
        <div class="event-image-container">
          <img :src="event.image || 'https://via.placeholder.com/300x200?text=Event+Image'" alt="Event image"
            class="event-image" />
        </div>

        <div class="event-details">
          <div
            style="font-weight: 600; font-size: 22px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
            {{ event.name }}</div>

          <div style="font-weight: 400; font-size: 14px;">{{ event.date }}</div>

          <div style="font-weight: 400; font-size: 14px;">{{ event.location }}</div>
          <div class="mt-4">{{ event.price }}</div>
          <div class="mt-3" style="font-size: 14px;"><i class="fi fi-rs-following"></i> {{ event.followers }} followers</div>

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
  data() {
    return {
      events: [
        {
          image: require('@/assets/featuredEvents/1.jpg'),
          date: '31 December 2024, 04:00PM',
          name: 'Premier League Summer Series',
          location: 'Singapore National Stadium',
          price: '$5.99',
          followers: '420'
        },
        {
          image: require('@/assets/featuredEvents/2.jpg'),
          date: '1 October 2025, 8:00PM',
          name: 'Olivia Rodrigo: Guts World Tour',
          location: 'Singapore Indoor Stadium',
          price: '$99.90',
          followers: '50'
        },
        {
          image: require('@/assets/featuredEvents/3.jpg'),
          date: '29 November 2025, All Day',
          name: 'Gardens By The Bay: Carnival of Flowers',
          location: 'Gardens By The Bay',
          price: '$49.90',
          followers: '993'
        },
        {
          image: require('@/assets/featuredEvents/4.jpg'),
          date: 'Today at 10:00pm',
          name: 'AKON: The Superfan Tour 2025',
          location: 'Arena @ Expo Hall 7',
          price: 'Free',
          followers: '310'
        },
        {
          image: require('@/assets/featuredEvents/5.jpg'),
          date: '24 January 2025, 6:00PM',
          name: 'Coldplay x Michael Jackson Singapore',
          location: 'Singapore National Stadium',
          price: '$49,90',
          followers: '78326'
        },
        {
          image: require('@/assets/featuredEvents/6.jpg'),
          date: '11 October 2024, 7:00PM',
          name: 'Jay Chou: World Tour 2025 Singapore',
          location: 'Singapore National Stadium',
          price: '$129.90',
          followers: '83127'
        },
        {
          image: require('@/assets/featuredEvents/7.jpg'),
          date: '31 October 2025, 7:00PM',
          name: 'Bruno Mars: Singapore World Tour 2025',
          location: 'Singapore National Stadium',
          price: '$100.00 - $190.00',
          followers: '93821'
        },
        {
          image: require('@/assets/featuredEvents/8.jpg'),
          date: '31 October 2025, 7:00PM',
          name: 'NBL Finals: London Mets vs New York Nets',
          location: 'Metro Center, DC',
          price: '$100.00 - $190.00',
          followers: '932821'
        },
      ],
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
    goToEventDetails(event) {
      this.$emit('popevent', event)
    }
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
  margin-top: 100px;
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
  /* Match card rounding */
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

/* Optional Swiper styling to make it match the design */
.mySwiper {
  margin: 30px auto;
  padding-top: 10px;
  max-width: 1200px;
  overflow: hidden;
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
}

.swiper-slide:hover {
  transform: scale(1.05);
  /* Slight zoom effect on hover */
}

::v-deep .swiper-pagination {
  position: relative;
  margin-top: 20px;
  /* Increase the value to move it lower */
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