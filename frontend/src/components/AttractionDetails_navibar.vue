<template>
    <div class="navbar">
        <div class="navbar-item back" @click='goToEventsPage'>Back</div>
        <div class="navbar-item" @click="showModal = true">Share Event</div>
        <div class="navbar-item special" @click='openTickets'>Get Tickets</div>
    </div>

    <!-- Modal for Share-->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <h3>Share Event</h3>

        <!-- Event URL Section -->
        <div class="url-section">
          <label for="eventUrl">Event URL</label>
          <div class="url-container">
            <input
              type="text"
              id="eventUrl"
              :value="event.url"
              readonly
              ref="urlInput"
            />
            <button @click="copyToClipboard" class="copy-button">Copy</button>
          </div>
          <p v-if="copySuccess" class="copy-success">Copied to clipboard!</p>
        </div>
      </div>
    </div>

    <!-- Modal for seatmap -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Seatmap</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <img v-if="event.seatmap?.staticUrl" :src="event.seatmap.staticUrl"
                        class="img-fluid" alt="Seatmap" />
                    <p v-else>No seatmap available.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { Modal } from "bootstrap";

export default {
    name: 'AttrationNavibar',
    props: {
        event: Object,
    },

    data () {
        return {
            showModal: false,
            copySuccess: false,
            showTicketPopup: false,
            ticketPopupMessage: '',
            ticketPopupTitle: ''
        }
    },
    computed: {
        eventPrice() {
            if (this.isOrganiserEvent) {
                return this.event.price || 'Free';
            } else {
                if (this.event.priceRanges && this.event.priceRanges.length > 0) {
                    return `${this.event.priceRanges[0].min} ${this.event.priceRanges[0].currency}`;
                }
                return 'Price not available';
            }
        }
    },
    methods: {
        async openTickets() {
            window.open(this.event.url, '_blank');  
        },
        goToEventsPage() {
            this.$router.back();
        },
        showSeatmap() {
            const myModal = new Modal(document.getElementById("staticBackdrop"));
            myModal.show();
        },
        closeModal() {
            this.showModal = false;
            this.copySuccess = false;
        },
        copyToClipboard() {
            // Select and copy the URL to clipboard
            this.$refs.urlInput.select();
            document.execCommand('copy');
            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 2000);
        },
        formatDate(dateString) {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        },
        formatTime(dateString) {
            if (!dateString) return 'TBD';
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};
</script>

<style scoped>
.navbar {
    display: flex;
    align-items: center;
    padding: 20px 30px;
    background-color: #333; 
    border-radius: 12px; 
    gap: 8px;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}

.navbar-item {
    padding: 8px 16px;
    color: #ccc;
    background-color: #444;
    border: 1px solid #555;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s, color 0.3s; 
}

.navbar-item:hover {
    background-color: #555;
    color: #fff;
    border-color: #666;
    transform: scale(1.03);

}

.back{
    font-weight: bold;
    color: #fff;
    background-color: #000; 
    padding: 8px 16px; 
    margin-right: 40px;
}

.special {
    background-color: #7a5c85;
    color: #fff;
}

.special:hover {
    background-color: #9c7da1;
}

.navbar-item.active {
    background-color: #555;
    color: #fff;
    font-weight: bold;
    border-color: #666;
}

@media (max-width: 1050px) {
    .navbar {
        padding: 8px;
        gap: 4px;
    }

    .back{
    font-weight: bold;
    color: #fff;
    background-color: #000; 
    padding: 8px 16px; 
    margin-right: 0px;
    }

    .navbar-item {
        padding: 6px 12px;
        font-size: 10px;
    }
}

@media (max-width: 650px) {
    .navbar {
        position: static;
        margin: auto;
        flex-direction: column; /* Change layout to vertical */
        padding: 11px; /* Adjust padding for vertical layout */
        transform: translateX(0%);
        width: 65%;
    }

    .back{
    font-weight: bold;
    color: #fff;
    background-color: #000; 
    padding: 8px 16px; 
    margin-right: 0px;
    }

    .navbar-item {
        padding: 6px 12px;
        padding-right: 0px;
        font-size: 10px;
        width: 100%; /* Full width for vertical layout */
        text-align: left; /* Align text to the left */
    }
}

/* Modal overlay background */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal content styling */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
}

/* Close button styling */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

/* URL Section */
.url-section label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

.url-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
}

.copy-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

.copy-button:hover {
  background-color: #45a049;
}

/* Success message styling */
.copy-success {
  color: green;
  margin-top: 10px;
}

</style>
