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

/**
 * @typedef {Object} TICK_HUMAN_DATA
 * @property {Number} id
 * @property {HUMAN_ACTION} action
 * @property {pos} pos
 * @property {Array<pos>} crossedPoints
 */

/**
 * @typedef {Object} TICK_DATA
 * @property {Number} id
 * @property {Array<TICK_HUMAN_DATA>} humanPos
 */

/**
 * @typedef {{x: Number, y:Number}} pos
 */

const log = new LogWrite();

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

    logWrite = (...args) => {
        log.write(...args);
    }
    
    /** @type {TICK_DATA} */
    get tick() {
        /** @type {TICK_DATA} */
        let infoToReturn = {id: this.#tickId + 0, humanPos: []};
        this.humans.forEach((human) => {
            infoToReturn.humanPos.push({id: human.id, pos: human.pos, action: human.action, crossedPoints: human.currentTickVisitedPoints});
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
     * @returns {{id: Number, info: HUMAN_INFO, attributes: HUMAN_ATTRIBUTES, status: *}|null}
     */
    getHumanData = (id) => {
        if(this.humans[id]) {
            return {id: id, info: this.humans[id].info, attributes: this.humans[id].attributes, status: this.humans[id].status};
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
            for (let i = 0; i < this.humans.length; i++) {
                await this.humans[i].tick();
            }
            let calculationTime = Math.ceil(performance.now() - startTime);
            let msg = `Last tick (\x1b[32m${this.#tickId}\x1b[0m) calculation time \x1b[32m${(Math.ceil(calculationTime/10))/100}\x1b[0ms`;
            log.write(msg);
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
     */
    constructor(grid, startHumans, startHospitalities) {
        this.grid = grid;
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