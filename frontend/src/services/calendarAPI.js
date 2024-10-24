/* global gapi */
export const fetchCalendarEvents = async () => {
    try {
        // Ensure that the API client is initialized before making the request
        if (sessionStorage.getItem('gapiinit')) {
            const response = await gapi.client.calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: 'startTime',
            });

            const events = response.result.items;
            if (events.length > 0) {
                console.log('Upcoming events:', events);
                return events;
            } else {
                console.log('No upcoming events found.');
                return [];
            }
        } else {
            console.error('gapi client is not initialized.');
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
};
