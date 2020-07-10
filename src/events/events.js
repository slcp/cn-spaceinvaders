class EventBus {
    constructor() {
        this.events = {}
    }

    subscribe(event, callback) {
        return new Promise(function (res) {
            this.events[event] = this.events[event] || []
            this.events[event].push(callback)
            res()
        }.bind(this))
    }

    async publish(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(async (cb) => {
            await cb(...args);
        });

    }
}

export const BAD_SHIP_KILLED_BY_GOOD_BULLET = "BAD_SHIP_KILLED_BY_GOOD_BULLET";
export const GOOD_SHIP_KILLED_BY_BAD_BULLET = "GOOD_SHIP_KILLED_BY_BAD_BULLET";
export const ROCK_SLICE_KILLED_BY_GOOD_BULLET = "ROCK_SLICE_KILLED_BY_GOOD_BULLET";
export const ROCK_SLICE_KILLED_BY_BAD_BULLET = "ROCK_SLICE_KILLED_BY_BAD_BULLET";
export const ROCK_KILLED_BY_GOOD_BULLET = "ROCK_KILLED_BY_GOOD_BULLET";
export const ROCK_KILLED_BY_BAD_BULLET = "ROCK_KILLED_BY_BAD_BULLET";

export default EventBus;