/** @typedef {import("./app").App} App */
import { SimulationGlobals } from "./simulationGlobals.js";
class TimeManager {
    /** @type {Number} */
    startHour;
    /** @type {Number} */
    startDay;
    /** @type {Number} */
    startYear;
    /** @type {App} */
    app;



    /** @type {{hour: Number, minute: Number, day: Number, year: Number}} */
    get currentTime() {
        return this.tickToTime(this.app.lastTick.id, this.app.lastTick.iteration);
    }

    /**
     * @overload
     * @param {Number} tickId
     * @param {Number} [tickIterarion]
     * @param {true} [monthNumber]
     * @param {Number} [ticksPerHour]
     * @returns {{hour: Number, minute: Number, day: Number, year: Number, month: 1|2|3|4|5|6|7|8|9|10|11|12, dayOfMonth: Number}}
     */
    /**
     * @overload
     * @param {Number} tickId
     * @param {Number} [tickIterarion]
     * @param {false} [monthNumber]
     * @param {Number} [ticksPerHour]
     * @returns {{hour: Number, minute: Number, day: Number, year: Number}}
     */
    /**
     * @param {Number} tickId
     * @param {Number} [tickIterarion]
     * @param {Boolean} [monthNumber]
     * @param {Number} [ticksPerHour]
     * @returns {{hour: Number, minute: Number, day: Number, year: Number}}
     */
    tickToTime = (tickId, tickIterarion = 0, monthNumber = false, ticksPerHour = SimulationGlobals.ticksPerHour) => {
        /**
         * @param {Number} [_tickIterarion] 
         * @returns {{hour: Number, minute: Number, day: Number, year: Number}}
         */
        const getIterationResult = (_tickIterarion = 0) => {
            let _res = {hour: 0, minute: 0, day: 0, year: 0};
            if(tickIterarion) {
                for(let i = 0; i<_tickIterarion; i++) {
                    let __res = this.tickToTime(Number.MAX_SAFE_INTEGER)
                    _res.hour += __res.hour;
                    _res.minute += __res.minute;
                    _res.day += __res.day;
                    _res.year += __res.year;
                }
            }
            return _res;
        } //@ts-ignore
        let tickOffset = getIterationResult(tickIterarion);
        let cTime = {hour: this.startHour + tickOffset.hour, minute: tickOffset.minute, day: this.startDay + tickOffset.day, year: this.startYear + tickOffset.year };
        cTime.hour += (Math.floor(tickId / ticksPerHour));
        cTime.minute += Math.floor(((tickId % ticksPerHour)/ticksPerHour) * 60);
        cTime.hour += Math.floor(cTime.minute/60);
        cTime.minute = cTime.minute%60;
        cTime.day = this.startDay + Math.floor(cTime.hour / 24);
        cTime.hour = cTime.hour%24;
        cTime.year += Math.floor(cTime.day / 365);
        cTime.day = cTime.day%366;
        if(cTime.day == 0) {
            cTime.day = 1;
        }

        /** 
         * @param {Number} day
         * @returns {{month: 1|2|3|4|5|6|7|8|9|10|11|12, dayOfMonth: Number}}
         */
        const getMonth = (day) => {
            const monthsLen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let iterator = 0;
            while(day > 0) {
                day = day - monthsLen[iterator%monthsLen.length];
                iterator++;
            }
            //@ts-ignore
            return { month: iterator, dayOfMonth: monthsLen[(iterator - 1)%monthsLen.length] + day };
        }

        if(monthNumber) {
            const {month, dayOfMonth} = getMonth(cTime.day);
            cTime.month = month;
            cTime.dayOfMonth = dayOfMonth;
        }

        return cTime;
    }
    /**
     * @param {App} app
     * @param {Number} startHour
     * @param {Number} startDay
     * @param {Number} startYear
     */
    constructor(app, startHour, startDay, startYear) {
        this.app = app;
        this.startHour = startHour;
        this.startDay = startDay;
        this.startYear = startYear;
    }
}

export { TimeManager }