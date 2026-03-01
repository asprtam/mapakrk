import { SimulationGlobals } from "./simulationGlobals.js";
import { Simulation } from "./simulation.js";
//@ts-ignore
import { TG, TypeGoblin } from "../typeGoblin.js";

/** @namespace TIME_MANAGER */

/** 
 * @typedef {0|1|2|3|4|5|6|7|8|9|10|11|12} TIME_MANAGER.MONTH
 * @memberof TIME_MANAGER
 */
/** 
 * @typedef {0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23} TIME_MANAGER.HOUR 
 * @memberof TIME_MANAGER
 */
/** 
 * @typedef {0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59} TIME_MANAGER.MINUTE 
 * @memberof TIME_MANAGER
 */
/** 
 * @typedef {0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99|100|101|102|103|104|105|106|107|108|109|110|111|112|113|114|115|116|117|118|119|120|121|122|123|124|125|126|127|128|129|130|131|132|133|134|135|136|137|138|139|140|141|142|143|144|145|146|147|148|149|150|151|152|153|154|155|156|157|158|159|160|161|162|163|164|165|166|167|168|169|170|171|172|173|174|175|176|177|178|179|180|181|182|183|184|185|186|187|188|189|190|191|192|193|194|195|196|197|198|199|200|201|202|203|204|205|206|207|208|209|210|211|212|213|214|215|216|217|218|219|220|221|222|223|224|225|226|227|228|229|230|231|232|233|234|235|236|237|238|239|240|241|242|243|244|245|246|247|248|249|250|251|252|253|254|255|256|257|258|259|260|261|262|263|264|265|266|267|268|269|270|271|272|273|274|275|276|277|278|279|280|281|282|283|284|285|286|287|288|289|290|291|292|293|294|295|296|297|298|299|300|301|302|303|304|305|306|307|308|309|310|311|312|313|314|315|316|317|318|319|320|321|322|323|324|325|326|327|328|329|330|331|332|333|334|335|336|337|338|339|340|341|342|343|344|345|346|347|348|349|350|351|352|353|354|355|356|357|358|359|360|361|362|363|364|365} TIME_MANAGER.DAY
 * @memberof TIME_MANAGER */

/**
 * @typedef {Object} TIME_MANAGER.TIME
 * @property {TIME_MANAGER.HOUR} hour
 * @property {TIME_MANAGER.MINUTE} minute
 * @property {TIME_MANAGER.DAY} day
 * @property {Number} year
 * @memberof TIME_MANAGER
 */

/**
 * @typedef {Object} TIME_MANAGER.TIME_MONTH
 * @property {TIME_MANAGER.HOUR} hour
 * @property {TIME_MANAGER.MINUTE} minute
 * @property {TIME_MANAGER.DAY} day
 * @property {TIME_MANAGER.MONTH} month
 * @property {Number} dayOfMonth
 * @property {Number} year
 * @memberof TIME_MANAGER
 */

class TimeManager {
    /** @type {Number} */
    startHour;
    /** @type {Number} */
    startDay;
    /** @type {Number} */
    startYear;
    /** @type {Simulation} */
    simulation;
    /** @type {Boolean} */
    isNight = false;

    /** 
     * @param {TIME_MANAGER.TIME|TIME_MANAGER.TIME_MONTH} currentTime
     * @returns {'morning'|'evening'|'noon'|'afternoon'|'night'}
     */
    getDayTime = (currentTime) => {
        if(currentTime.hour <= 5) {
            return 'night';
        }
        if(currentTime.hour <= 10) {
            return 'morning';
        }
        if(currentTime.hour <= 14) {
            return 'noon';
        }
        if(currentTime.hour <= 18) {
            return 'afternoon';
        }
        return 'evening';
    }

    /** 
     * @param {Number} tickNumber
     * @param {Number} [tickIteration]
     * @returns {'morning'|'evening'|'noon'|'afternoon'|'night'}
     */
    getDayTimeOfTick = (tickNumber, tickIteration = 0) => {
        return this.getDayTime(this.tickToTime(tickNumber, tickIteration));
    }

    /** @type {'morning'|'evening'|'noon'|'afternoon'|'night'} */
    get dayTime() {
        let currentTime = this.currentTime;
        return this.getDayTime(currentTime);
    }

    /** @type {TIME_MANAGER.TIME} */
    get currentTime() {
        return this.tickToTime(this.simulation.tickId, this.simulation.tickIteration);
    }

    /**
     * @overload
     * @param {Number} tickId
     * @param {Number} [tickIterarion]
     * @param {true} [monthNumber]
     * @param {Number} [ticksPerHour]
     * @returns {TG.StealHisLook<TIME_MANAGER.TIME_MONTH>['=>']}
     */
    /**
     * @overload
     * @param {Number} tickId
     * @param {Number} [tickIterarion]
     * @param {false} [monthNumber]
     * @param {Number} [ticksPerHour]
     * @returns {TG.StealHisLook<TIME_MANAGER.TIME>['=>']}
     */
    /**
     * @param {Number} tickId
     * @param {Number} [tickIterarion]
     * @param {Boolean} [monthNumber]
     * @param {Number} [ticksPerHour]
     * @returns {TG.StealHisLook<TIME_MANAGER.TIME>['=>']}
     */
    tickToTime = (tickId, tickIterarion = 0, monthNumber = false, ticksPerHour = SimulationGlobals.ticksPerHour) => {
        /**
         * @param {Number} [_tickIterarion] 
         * @returns {TIME_MANAGER.TIME}
         */
        const getIterationResult = (_tickIterarion = 0) => {
            let _res = {hour: 0, minute: 0, day: 0, year: 0};
            if(tickIterarion) {
                for(let i = 0;i < _tickIterarion;i++) {
                    let __res = this.tickToTime(Number.MAX_SAFE_INTEGER);
                    _res.hour += __res.hour;
                    _res.minute += __res.minute;
                    _res.day += __res.day;
                    _res.year += __res.year;
                }
            } //@ts-ignore
            return _res;
        }; //@ts-ignore
        let tickOffset = getIterationResult(tickIterarion);
        let cTime = {hour: this.startHour + tickOffset.hour, minute: tickOffset.minute, day: this.startDay + tickOffset.day, year: this.startYear + tickOffset.year};
        cTime.hour += (Math.floor(tickId / ticksPerHour));
        cTime.minute += Math.floor(((tickId % ticksPerHour) / ticksPerHour) * 60);
        cTime.hour += Math.floor(cTime.minute / 60); //@ts-ignore
        cTime.minute = cTime.minute % 60;
        cTime.day = this.startDay + Math.floor(cTime.hour / 24);
        cTime.hour = cTime.hour % 24;
        cTime.year += Math.floor(cTime.day / 365);
        cTime.day = cTime.day % 366;
        if(cTime.day == 0) {
            cTime.day = 1;
        }

        /** 
         * @param {Number} day
         * @returns {{month: TIME_MANAGER.MONTH, dayOfMonth: Number}}
         */
        const getMonth = (day) => {
            const monthsLen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let iterator = 0;
            while(day > 0) {
                day = day - monthsLen[iterator % monthsLen.length];
                iterator++;
            }
            //@ts-ignore
            return {month: iterator, dayOfMonth: monthsLen[(iterator - 1) % monthsLen.length] + day};
        };

        if(monthNumber) {
            const {month, dayOfMonth} = getMonth(cTime.day);
            cTime.month = month;
            cTime.dayOfMonth = dayOfMonth;
        }
        //@ts-ignore
        return cTime;
    };
    /**
     * @param {Simulation} simulation
     * @param {Number} startHour
     * @param {Number} startDay
     * @param {Number} startYear
     */
    constructor(simulation, startHour, startDay, startYear) {
        this.simulation = simulation;
        this.startHour = startHour;
        this.startDay = startDay;
        this.startYear = startYear;
    }
}

const TIME_MANAGER = '';

export { TimeManager, TIME_MANAGER };