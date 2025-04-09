import { Grid } from "./map";
import { SimulationGlobals } from "./simulationGlobals";
import { Plot, Home, Hospitality, Human } from "./entites";
import { Utils } from "./utils";
import { js as Easystar } from "easystarjs";

/** @typedef {import("./entites").HUMAN_INFO} HUMAN_INFO */
/** @typedef {import("./entites").HUMAN_ATTRIBUTES} HUMAN_ATTRIBUTES */

/**
 * @typedef {{x: Number, y:Number}} pos
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
    /** @type {Timer|null} */
    timeoout = null;
    /** @type {Boolean} */
    isRunning = false;

    get humanPositions() {
        let infoToReturn = [];
        this.humans.forEach((human) => {
            let humanData = {id: human.id, pos: human.pos, action: human.action, crossedPoints: human.currentTickVisitedPoints};
            infoToReturn.push(humanData);
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
            gridClone[from.y][from.x] = 0;
            gridClone[to.y][to.x] = 0;

            const easystar = new Easystar();
            easystar.setGrid(gridClone);
            easystar.setAcceptableTiles([0]);
            easystar.enableDiagonals();

            easystar.findPath(from.x, from.y, to.x, to.y, (path) => {
                if(path) {
                    let id = foundPaths.paths.push(path) - 1;
                    foundPaths.probability[id] = 1;
                }
                res(foundPaths);
            });
            easystar.calculate();
        });
    }

    tick = async () => {
        if(this.isRunning) {
            for (let i = 0; i < this.humans.length; i++) {
                await this.humans[i].tick();
            }
            // console.log(JSON.stringify(this.humanPositions));
            this.timeoout = setTimeout(() => {
                this.tick();
            }, this.tickTime);
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
            this.tick();
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