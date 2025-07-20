import { Grid } from "./grid.js";
import { SimulationGlobals } from "./simulationGlobals.js";
import { Plot, Home, Hospitality, Human } from "./entites.js";
import { Utils } from "./utils.js";
import { LogWrite } from "../logWrite.js"; //@ts-ignore
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
 * @typedef {Object} TICK_DATA
 * @property {Number} id
 * @property {Array<TICK_HUMAN_DATA>} humanPos
 */

/**
 * @typedef {{x: Number, y:Number}} pos
 */

/**
 * @typedef {Object} HUMAN_STATUS_SOCKET_MESSAGE
 * @property {Number} id
 * @property {HUMAN_STATUSES} status
 * @property {HUMAN_FRIENDS_LIST} friends
 */

class Simulation {
    /** @type {Array<Plot>} */
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
    get tickId () {
        return this.#tickId;
    }
    /** @type {LogWrite} */
    log;

    logWrite = (...args) => {
        this.log.write(...args);
    }
    
    /** @type {TICK_DATA} */
    get tick() {
        /** @type {TICK_DATA} */
        let infoToReturn = {id: this.#tickId + 0, humanPos: []};
        this.humans.forEach((human) => {
            infoToReturn.humanPos.push({id: human.id, pos: human.pos, action: human.action, renderedPos: human.renderedPos, targetType: human.targetType, target: human.target});
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
            return {id: id, info: this.humans[id].info, attributes: this.humans[id].attributes};
        } else {
            return {id: id, info: {name: '', lastname: '', age: 0, gender: 'other', genderPronoun: 'other', customGenderName: null}, attributes: {social: 0, physical: 0, intelligence: 0}};
        }
    }
    /**
     * @param {Number} id
     * @returns {HUMAN_STATUS_SOCKET_MESSAGE}
     */
    getHumanStatus = (id) => {
        if(this.humans[id]) {
            return {id: id, status: this.humans[id].status, friends: this.humans[id].friends};
        } else {
            /** @type {HUMAN_STATUSES} */ //@ts-ignore
            let emptyStatusesObj = {};
            Human.statusList.forEach((key) => {
                emptyStatusesObj[key] = 1;
            });
            return {id: id, status: emptyStatusesObj, friends: []};
        }
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
            /** @type {Array<Promise>} */
            const promiseArr = [];
            if(this.#tickId%10 == 0) {
                for(let i = 0;i < this.humans.length;i++) {
                    promiseArr.push(this.humans[i].tick());
                }
            } else {
                for(let human of this.humans) {
                    if(human.action == 'walking') {
                        promiseArr.push(human.walkProgress());
                    }
                }
            }
            await Promise.all(promiseArr);
            let calculationTime = Math.ceil(performance.now() - startTime);
            let msg = `Last tick (\x1b[32m${this.#tickId}\x1b[0m) calculation time \x1b[32m${calculationTime}\x1b[0mms`;
            this.log.write(msg);
            if(calculationTime >= this.tickTime) {
                this.timeoout = setTimeout(() => {
                    this.#tickId++;
                    if(this.#tickId >= Number.MAX_SAFE_INTEGER) {
                        this.#tickId = 0;
                    }
                    this.onNewTick(this.tick, msg).then(() => {
                        this.#tick();
                    }).catch((e) => {
                        console.error(e);
                    });
                });
            } else {
                this.timeoout = setTimeout(() => {
                    this.#tickId++;
                    if(this.#tickId >= Number.MAX_SAFE_INTEGER) {
                        this.#tickId = 0;
                    }
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
            this.isRunning = true;
            this.#tick();
        }
    }

    /**
     * @param {Grid} grid
     * @param {Number} startHumans
     * @param {Number} startHospitalities
     * @param {LogWrite} log
     */
    constructor(grid, startHumans, startHospitalities, log) {
        this.grid = grid;
        this.log = log;
        for(let i = 0; i<startHospitalities; i++) {
            new Hospitality(this, Utils.getRandomArrayElement(this.grid.getBoundaryPoints()));
        }
        for(let i = 0; i<startHumans; i++) {
            new Human(this);
        }
        // console.log(JSON.stringify(this.getHumanData(0)));
    }
}

export {Simulation};