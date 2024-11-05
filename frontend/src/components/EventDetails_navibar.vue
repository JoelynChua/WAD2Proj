<template>
    <div class="navbar">
        <div class="navbar-item back" aria-label="Back to Events">Back</div>
        <div class="navbar-item" aria-label="TicketMaster">TicketMaster</div>
        <div class="navbar-item" aria-label="Seatmap">Seatmap</div>
        <div class="navbar-item special" aria-label="Share Event">Share Event</div>
    </div>
</template>

<script>
export default {
    name: 'EventNavibar',
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
    transition: background-color 0.3s, color 0.3s;
}

.navbar-item:hover {
    background-color: #555;
    color: #fff;
    border-color: #666;
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
        flex-direction: column; /* Change layout to vertical */
        padding: 10px; /* Adjust padding for vertical layout */
        left: 10px; /* Position on the left */
        transform: translateY(-50%); /* Center vertically */
        transform: translateX(10%);
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
        width: 100%; /* Full width for vertical layout */
        text-align: left; /* Align text to the left */
    }
}

</style>
