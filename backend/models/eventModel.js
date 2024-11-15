class Event {
    constructor(
        id,
        title,
        description = '',
        organiserId,
        start,
        end,
        allDay = false,
        colour = '#fb00bc',
        price,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.organiserId = organiserId;
        this.start = start;
        this.end = end;
        this.allDay = allDay;
        this.colour = colour;
        this.price = price
    }
}
module.exports = Event