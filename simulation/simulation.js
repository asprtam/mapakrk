import { Grid } from "./grid.js";
import { SimulationGlobals } from "./simulationGlobals.js";
import { Plot, Home, Hospitality, Human } from "./entites.js";
import { Utils } from "./utils.js";
import { LogWrite } from "../logWrite.js"; 
import { TimeManager } from "./timeManager.js"; //@ts-ignore
import pkg from "easystarjs";
const Easystar = pkg.js;
// import { EasyStar } from "easystarjs";
// const Easystar = require('easystarjs/bin/easystar-0.4.4.js');
// const Easystar = require('easystarjs');

/** @typedef {import("./entites").HUMAN_INFO} HUMAN_INFO */
/** @typedef {import("./entites").HUMAN_ATTRIBUTES} HUMAN_ATTRIBUTES */
/** @typedef {import("./entites").HUMAN_ACTION} HUMAN_ACTION */
/** @typedef {import("./entites").HUMAN_DATA} HUMAN_DATA */
/** @typedef {import("./entites").HUMAN_TARGET_TYPE} HUMAN_TARGET_TYPE */
/** @typedef {import("./entites").HUMAN_STATUSES} HUMAN_STATUSES */
/** @typedef {import("./entites").HUMAN_FRIEND_DATA} HUMAN_FRIEND_DATA */
/** @typedef {import("./entites").HUMAN_FRIENDS_LIST} HUMAN_FRIENDS_LIST */
/** @typedef {import("../data/intrests.js").INTREST_TAG} INTREST_TAG */
/** @typedef {import("./meeting.js").MEETING_DATA} MEETING_DATA */
/** @typedef {import("./human.js").HUMAN_SAVED_DATA} HUMAN_SAVED_DATA */
/** @typedef {import("./human.js").HUMAN_EVENT_INTREST} HUMAN_EVENT_INTREST */
/** @typedef {import("./human.js").HUMAN_EVENT_FRIEND} HUMAN_EVENT_FRIEND */
/** @typedef {import("./human.js").HUMAN_EVENT_FRIEND_CHANGE_RELATION} HUMAN_EVENT_FRIEND_CHANGE_RELATION */
/** @typedef {import("./entites.js").HOSPITALITY_SAVED_DATA} HOSPITALITY_SAVED_DATA */
/** @typedef {import("./meeting.js").Meeting} Meeting */
/** @typedef {import("./meeting.js").PlotBoundMeeting} PlotBoundMeeting */
/** @typedef {import("./meeting.js").FieldMeeting} FieldMeeting */

/**
 * @typedef {Object} TICK_HUMAN_DATA
 * @property {Number} id
 * @property {HUMAN_ACTION} action
 * @property {pos} pos
 * @property {pos} renderedPos
 * @property {HUMAN_TARGET_TYPE} targetType
 * @property {Number|null} target
 */

/**
 * @typedef {Object} TICK_PLOT_DATA
 * @property {Number} id
 * @property {Number} visitorsCount
 * @property {Boolean} isOpen
 */

/**
 * @typedef {Object} TICK_DATA
 * @property {Number} id
 * @property {Number} iteration
 * @property {Array<TICK_HUMAN_DATA>} humanPos
 * @property {Array<TICK_PLOT_DATA>} plots
 * @property {Boolean} plotsChanged
 */

/**
 * @typedef {{x: Number, y:Number}} pos
 */

/**
 * @typedef {Object} HUMAN_STATUS_SOCKET_MESSAGE
 * @property {Number} id
 * @property {HUMAN_STATUSES} status
 * @property {HUMAN_FRIENDS_LIST} friends
 * @property {Array<INTREST_TAG>} intrests
 * @property {MEETING_DATA|null} meeting
 * @property {Array<import("./humanSpecialTags.js").HUMAN_SPECIAL_TAG>} specialTags
 */

/**
 * @typedef {Object} SIMULATION_SAVED_DATA
 * @property {String} [simulationId]
 * @property {Number} [tick]
 * @property {Number} [tickIteration]
 * @property {{year: Number, day: Number, hour: Number}} [startDate]
 * @property {Array<HUMAN_SAVED_DATA>} [humans]
 * @property {Array<HOSPITALITY_SAVED_DATA>} [hospitalities]
 */

class Simulation {
    /** @type {String} */
    simulationId = Utils.makeId(10);
    /** @type {Array<Plot|Home|Hospitality>} */
    plots = [];
    /** @type {Array<Hospitality>} */
    hospitalities = [];
    /** @type {Array<Human>} */
    humans = [];
    /** @type {Grid} */
    grid;
    /** @type {Number} */
    tickTime = SimulationGlobals.tickTime;
    /** @type {Number} */
    currentSpeed = SimulationGlobals.currentSpeed;
    /** @type {*|null} */
    timeoout = null;
    /** @type {Boolean} */
    isRunning = false;
    /** @type {Number} */
    #tickId = 0;
    /** @type {Number} */
    #tickIteration = 0;
    /** @type {Array<Number>} */
    humanTickLookupTable = [];
    get tickId () {
        return this.#tickId;
    }
    get tickIteration () {
        return this.#tickIteration;
    }
    /** @type {LogWrite} */
    log;
    /** @type {Number} */
    startHour = 0;
    /** @type {Number} */
    startDay = 0;
    /** @type {Number} */
    startYear = 0;
    /** @type {TimeManager} */
    timeManager;
    /** @type {{hour: Number, minute: Number, day: Number, year: Number, month: 1|2|3|4|5|6|7|8|9|10|11|12, dayOfMonth: Number}} */
    currentTime = { hour: 0, minute: 0, day: 0, year: 0, month: 1, dayOfMonth: 1 };
    get parsedCurrentHour() {
        return this.currentTime.hour + (this.currentTime.minute / 60);
    }
    /** @type {Array<Meeting|PlotBoundMeeting|FieldMeeting>} */
    meetings = [];

    /** @returns {SIMULATION_SAVED_DATA} */
    getDataDump = () => {
        return {
            tick: this.#tickId,
            tickIteration: this.#tickIteration,
            startDate: { hour: this.startHour, day: this.startDay, year: this.startYear },
            humans: this.humans.map((human) => {
                return human.getDataDump();
            }),
            hospitalities: this.hospitalities.map((hos) => {
                return hos.getDataDump();
            })
        }
    }

    /** @param {String} str */
    onLogWrite = (str) => {

    }

    logWrite = (...args) => {
        this.log.write(...args);
        this.onLogWrite(JSON.stringify([...args]));
    }
    
    /** @type {TICK_DATA} */
    get tick() {
        /** @type {TICK_DATA} */
        let infoToReturn = {id: this.#tickId + 0, iteration: this.#tickIteration + 0, humanPos: [], plots: [], plotsChanged: false};
        this.humans.forEach((human) => {
            infoToReturn.humanPos.push({id: human.id, pos: human.pos, action: human.action, renderedPos: human.renderedPos, targetType: human.targetType, target: human.target});
        });
        this.plots.forEach((plot) => {
            infoToReturn.plots.push({id: plot.id, visitorsCount: plot.currentVisitors.length, isOpen: plot.isOpen });
        });
        return infoToReturn;
    }

    /**
     * @param {Number} id
     * @returns {{id: Number, pos:pos, action: String, crossedPoints: Array<pos>}|null}
     */
    getHumanPosition = (id) => {
        if(this.humans[id]) {
            return {id: id, pos: this.humans[id].pos, action: this.humans[id].action, crossedPoints: this.humans[id].currentTickVisitedPoints};
        }
        return null;
    }

    /** 
     * @param {Number} id
     * @returns {HUMAN_DATA|null}
     */
    getHumanData = (id) => {
        if(this.humans[id]) {
            return { id: id, info: this.humans[id].info, attributes: this.humans[id].attributes, intrests: this.humans[id].intrests };
        } else {
            return { id: id, info: { name: '', lastname: '', age: 0, gender: 'other', genderPronoun: 'other', customGenderName: null }, attributes: { social: 0, physical: 0, intelligence: 0 }, intrests: [] };
        }
    }
    /**
     * @param {Number} id
     * @returns {HUMAN_STATUS_SOCKET_MESSAGE}
     */
    getHumanStatus = (id) => {
        if(this.humans[id]) {
            if(this.humans[id].currentMeeting) {
                if(this.humans[id].currentMeeting && this.humans[id].currentMeeting.participants.length >= 2) {
                    return {id: id, status: this.humans[id].status, friends: this.humans[id].friends, intrests: this.humans[id].intrests, meeting: this.humans[id].currentMeeting, specialTags: this.humans[id].specialTags };
                } else {
                    return {id: id, status: this.humans[id].status, friends: this.humans[id].friends, intrests: this.humans[id].intrests, meeting: null, specialTags: this.humans[id].specialTags };
                }
            } else {
                return { id: id, status: this.humans[id].status, friends: this.humans[id].friends, intrests: this.humans[id].intrests, meeting: null, specialTags: this.humans[id].specialTags };
            }
        } else {
            /** @type {HUMAN_STATUSES} */ //@ts-ignore
            let emptyStatusesObj = {};
            Human.statusList.forEach((key) => {
                emptyStatusesObj[key] = 1;
            });
            return { id: id, status: emptyStatusesObj, friends: [], intrests: [], meeting: null, specialTags: [] };
        }
    }

    /**
     * @param {Number} id 
     * @returns {import("./entites").PLOT_STATUS}
     */
    getPlotStatus = (id) => {
        if(this.plots[id]) {
            return this.plots[id].getPlotStatus();
        } else {
            return { id: 0, visitors: [], isOpen: false };
        }
    }

    /**
     * @param {pos} pos
     * @returns {Plot|Home|Hospitality|null}
     */
    getPlotByPos = (pos) => {
        for(let plot of this.plots) {
            if(plot.pos.x == pos.x && plot.pos.y == pos.y) {
                return plot;
                break;
            } else if(plot.containsPos(pos)) {
                return plot;
                break;
            }
        }
        return null;
    }

    /**
     * @param {Array<Number>} arr
     * @returns {pos}
     */
    arrayToPos = (arr) => {
        if(arr.length > 1) {
            return { x: arr[0], y: arr[1] }
        } else if(arr.length > 0) {
            return { x: arr[0], y: 0 };
        }
        return { x: 0, y: 0 };
    }

    /** 
     * Tutaj do zmiany na razie zwraca tylko jedna sciezke (najszybsza)
     * @param {pos} from
     * @param {pos} to
     * @returns {Promise<{paths: Array<Array<pos>>, probability: {[id:Number]: Number}}>}
     */
    findPaths = (from, to) => {
        return new Promise((res) => {
            /** @type {{paths: Array<Array<pos>>, probability: {[id:Number]: Number}}} */
            let foundPaths = { paths: [], probability: {} };

            let gridClone = JSON.parse(JSON.stringify(this.grid.raw));
            // from.x = 1;
            // from.y = 0;
            // to.x = 67;
            // to.y = 39;
            // console.log(gridClone);
            // console.log(`findPaths from: ${JSON.stringify(from)}, to: ${JSON.stringify(to)}`, gridClone.length, gridClone[0].length, gridClone[from.x][from.y], gridClone[to.x][to.y])
            gridClone[from.x][from.y] = 0;
            gridClone[to.x][to.y] = 0;

            const easystar = new Easystar();
            easystar.setGrid(gridClone);
            easystar.setAcceptableTiles(0);
            // easystar.disableDiagonals();
            easystar.enableDiagonals();
            
            // easystar.findPath(0, 8, 15, 8, (path) => {
            easystar.findPath(from.y, from.x, to.y, to.x, (path) => {
                if(path) {
                    let id = foundPaths.paths.push(path.map((pos) => {
                        return {x: pos.y, y: pos.x};
                    })) - 1;
                    foundPaths.probability[id] = 1;
                }
                res(foundPaths);
            });
            easystar.calculate();
        });
    }

    /** 
     * @param {TICK_DATA} tickData
     * @param {String} msg
     * @returns {Promise<*>}
     *  */
    onNewTick = (tickData, msg) => {
        return new Promise((res) => {
            res(true);
        });
    }

    #tick = async () => {
        if(this.isRunning) {
            const startTime = performance.now();
            let nextTickId = this.#tickId + 1;
            let nextTickIteration = this.#tickIteration + 0;
            if(nextTickId >= Number.MAX_SAFE_INTEGER) {
                nextTickId = 0;
                nextTickIteration++;
            }
            let newTime = this.timeManager.tickToTime(nextTickId, nextTickIteration, true, SimulationGlobals.ticksPerHour);
            if(newTime.hour >= 23 || newTime.hour <= 5) {
                this.timeManager.isNight = true;
            } else {
                this.timeManager.isNight = false;
            }
            if(newTime.day != this.currentTime.day) {
                await Promise.all(this.humans.map((human) => { return human.tickNewDay(newTime.day, nextTickId, nextTickIteration); }));
            }
            this.currentTime = newTime;
            this.humanTickLookupTable = [];
            if(this.#tickId%Math.floor(SimulationGlobals.ticksPerHour/2) == 0) {
                await Promise.all(this.plots.map((plot) => { return plot.managementTick(); }));
            }
            /** @type {Array<Promise>} */
            const promiseArr = [];
            if(this.#tickId%SimulationGlobals.ticksPerHour == 0) {
                for(let i = 0;i < this.humans.length;i++) {
                    if(this.humans[i].isAlive) {
                        promiseArr.push(this.humans[i].tickDecisionMaking());
                    }
                }
            } else {
                for(let i = 0;i < this.humans.length;i++) {
                    if(this.humans[i].isAlive) {
                        promiseArr.push(this.humans[i].tick());
                    }
                }
            }
            await Promise.all(promiseArr);
            if(this.#tickId % Math.max(Math.floor(SimulationGlobals.ticksPerHour / (this.currentSpeed * SimulationGlobals.ticksPerHour)), 1) == 0) {
                await Promise.all(this.meetings.map((meeting) => { return meeting.meetingTick(nextTickId, nextTickIteration); }));
            }
            let calculationTime = Math.ceil(performance.now() - startTime);
            let msg = `Last tick (\x1b[32m${this.#tickId}\x1b[0m) calculation time \x1b[32m${calculationTime}\x1b[0mms`;
            this.log.write(msg);
            if(calculationTime >= this.tickTime) {
                this.timeoout = setTimeout(() => {
                    this.#tickId = nextTickId;
                    this.#tickIteration = nextTickIteration;
                    this.onNewTick(this.tick, msg).then(() => {
                        this.#tick();
                    }).catch((e) => {
                        console.error(e);
                    });
                });
            } else {
                this.timeoout = setTimeout(() => {
                    this.#tickId = nextTickId;
                    this.#tickIteration = nextTickIteration;
                    this.onNewTick(this.tick, msg).then(() => {
                        this.#tick();
                    }).catch((e) => {
                        console.error(e);
                    });
                }, this.tickTime - calculationTime);
            }
            
        }
    }

    stop = () => {
        if(this.isRunning) {
            if (this.timeoout !== null) {
                clearTimeout(this.timeoout);
            }
            this.timeoout = null;
            this.isRunning = false;
        }
    }

    start = () => {
        if(!this.isRunning) {
            if (this.timeoout !== null) {
                clearTimeout(this.timeoout);
            }
            this.timeoout = null;
            Promise.all(this.humans.map((human) => { return human.init(); })).then(() => {
                this.isRunning = true;
                this.#tick();
            });
        }
    }

    /**
     * @param {Grid} grid
     * @param {Number} startHumans
     * @param {Number} startHospitalities
     * @param {LogWrite} log
     * @param {Boolean} [useCurrentDate]
     * @param {SIMULATION_SAVED_DATA|null} [savedData]
     */
    constructor(grid, startHumans, startHospitalities, log, useCurrentDate = false, savedData=null) {
        this.grid = grid;
        this.log = log;

        const setStartDateToCurrent = () => {
            if(!useCurrentDate && SimulationGlobals.defaultStartDate) {
                this.startHour = SimulationGlobals.defaultStartDate.hour + 0;
                this.startYear = SimulationGlobals.defaultStartDate.year + 0;
                this.startDay = SimulationGlobals.defaultStartDate.day + 0;
            } else {
                let startDate = new Date(Date.now());
                this.startHour = startDate.getHours();
                this.startYear = startDate.getFullYear();
                /**
                 * @param {Date} date
                 * @returns {Number}
                 */
                const daysIntoYear = (date) => {
                    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
                };
                this.startDay = daysIntoYear(startDate);
            }
        }

        if(savedData) {
            if(savedData.simulationId) {
                this.simulationId = savedData.simulationId;
            }
            if(savedData.tick) {
                this.#tickId = savedData.tick + 0;
            }
            if(savedData.tickIteration) {
                this.#tickIteration = savedData.tickIteration + 0;
            }
            if(savedData.startDate) {
                this.startHour = savedData.startDate.hour;
                this.startYear = savedData.startDate.year;
                this.startDay = savedData.startDate.day;
            } else {
                setStartDateToCurrent();
            }
            this.timeManager = new TimeManager(this, this.startHour, this.startDay, this.startYear);
            this.currentTime = this.timeManager.tickToTime(this.#tickId, this.#tickIteration, true, SimulationGlobals.ticksPerHour);
            if(this.currentTime.hour >= 23 || this.currentTime.hour <= 5) {
                this.timeManager.isNight = true;
            } else {
                this.timeManager.isNight = false;
            }
            let extraHospitalities = startHospitalities;
            if(savedData.hospitalities) {
                extraHospitalities = startHospitalities - savedData.hospitalities.length;
                for(let hospData of savedData.hospitalities) {
                    new Hospitality(this, hospData);
                }
            }
            for(let i = 0;i < extraHospitalities; i++) {
                new Hospitality(this);
            }
            let extraHumans = startHumans;
            if(savedData.humans) {
                extraHumans = extraHumans - savedData.humans.length;
                for(let humanData of savedData.humans) {
                    new Human(this, humanData);
                }
            }
            for(let i = 0; i < extraHumans; i++) {
                new Human(this);
            }
        } else {
            setStartDateToCurrent();
            this.timeManager = new TimeManager(this, this.startHour, this.startDay, this.startYear);
            this.currentTime = this.timeManager.tickToTime(this.#tickId, this.#tickIteration, true, SimulationGlobals.ticksPerHour);
            if(this.currentTime.hour >= 23 || this.currentTime.hour <= 5) {
                this.timeManager.isNight = true;
            } else {
                this.timeManager.isNight = false;
            }
            for(let i = 0;i < startHospitalities;i++) {
                new Hospitality(this);
            }
            for(let i = 0;i < startHumans;i++) {
                new Human(this);
            }
        }
    }
}

export {Simulation};