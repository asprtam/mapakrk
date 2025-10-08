
import { Path } from "./path.js";
import { streets, streetsArr } from "../data/streets.js";
//@ts-ignore
import pkg from "easystarjs";
import {Utils} from "./utils.js";
const Easystar = pkg.js;
/**
 * @typedef {{x: Number, y:Number}} pos
 */
/** @typedef {import("../index.js").RAW_MAP} RAW_MAP */
/** @typedef {import("../index.js").RAW_MAP_PIXEL} RAW_MAP_PIXEL */
/** @typedef {import("../index.js").WALKABILITY_ARR} WALKABILITY_ARR */

/**
 * @typedef {Object} PLOT_SLOT
 * @property {Number} id
 * @property {pos} pos - pozycja x y
 * @property {String} streetName - nazwa
 * @property {Number} number - numer na ulicy
 * @property {"H"|"M"} [claimed] - zajęte prez "H" - hospitality, nie moze byc nic innego, "M" - zajęte przez dom, może być tu też kolejny dom
 */

class Grid {
    /** @type {Number} */
    get width() {
        return this.raw.length;
    }
    /** @type {Number} */
    get height() {
        return this.raw[0].length;
    }
    /** @type {WALKABILITY_ARR} */
    raw = [[]];
    /** @type {RAW_MAP} */
    mapData = [[]];
    /** @type {Array<PLOT_SLOT>} */
    slots = [];

    /**
     * @returns {PLOT_SLOT}
     */
    getRandomAvailableSlot = () => {
        let random = Utils.getRandomArrayElement(this.slots);
        if(random.claimed == 'H') {
            return this.getRandomAvailableSlot();
        } else {
            return random;
        }
    }

    /**
     * @param {Number} id
     * @param {"H"|"M"} claimType
     */
    claimSlot = (id, claimType) => {
        if(this.slots[id]) {
            this.slots[id].claimed = claimType;
        }
    }

    /**
     * @param {pos} pos 
     * @returns {RAW_MAP_PIXEL|Null}
     */
    getPointByPos = (pos) => {
        if(this.mapData[pos.x]) {
            if(this.mapData[pos.x][pos.y]) {
                return this.mapData[pos.x][pos.y];
            }
        }
        return null;
    }

    /**
     * @param {(point: RAW_MAP_PIXEL, pos?:pos) => void} callback
     */
    forEachPoint = (callback) => {
        this.mapData.forEach((column, column_id) => {
            column.forEach((point, row_id) => {
                callback(point, {x: column_id, y: row_id});
            });
        });
    }

    /** @returns {Array<pos>} */
    getBoundaryPoints = () => {
        /** @type {Array<pos>} */
        let returnArr = [];
        this.forEachPoint((point, pos) => {
            if(!point.w && typeof point.s == "number") {
                returnArr.push(pos);
            }
        });
        return returnArr;
    }

    /** 
     * Tutaj do zmiany na razie zwraca tylko jedna sciezke (najszybsza)
     * @param {pos} from
     * @param {pos} to
     * @returns {Promise<Path>}
     */
    findPath = (from, to) => {
        return new Promise((res) => {
            let gridClone = JSON.parse(JSON.stringify(this.raw));
            gridClone[from.x][from.y] = 0;
            gridClone[to.x][to.y] = 0;
            const easystar = new Easystar();
            easystar.setGrid(gridClone);
            easystar.setAcceptableTiles(0);
            easystar.enableDiagonals();
            easystar.findPath(from.y, from.x, to.y, to.x, (path) => {
                if(path) {
                    if(path.length >= 2) {
                        res(new Path(path.map((pos) => {return {x: pos.y, y: pos.x}})));
                    } else {
                        res(new Path(JSON.parse(JSON.stringify([from, to])), true));
                    }
                } else {
                    res(new Path(JSON.parse(JSON.stringify([from, to])), true));
                }
            });
            easystar.calculate();
        });
    }

    /** @returns {Array<PLOT_SLOT>} */
    #getPlotSlots = () => {
        /** @type {Array<PLOT_SLOT>} */
        let returnArr = [];
        /** @type {Array<Number>} */
        let _streetsCount = [];
        this.forEachPoint((point, pos) => {
            if(!point.w && typeof point.s == "number") {
                let _streetId = point.s + 0;
                if(streetsArr[_streetId]) {
                    let _pos = {x: pos.x + 0, y: pos.y + 0 };
                    let _number = 1;
                    if(typeof _streetsCount[_streetId] == "number") {
                        _streetsCount[_streetId]++;
                        _number = _streetsCount[_streetId] + 0;
                    } else {
                        _streetsCount[_streetId] = 1;
                    }
                    let obj = {
                        id: returnArr.length,
                        pos: _pos,
                        number: _number,
                    };
                    Object.defineProperty(obj, 'streetName', {
                        set: () => {},
                        get: () => {
                            return streetsArr[_streetId].name;
                        },
                        enumerable: true
                    }); //@ts-ignore
                    returnArr.push(obj);
                }
            }
        });

        return returnArr;
    }

    /**
     * @param {RAW_MAP} raw 
     */
    constructor(raw) {
        this.mapData = raw;
        this.raw = raw.map((row) => {
            return row.map((element) => {
                if(element.w) {
                    return 0;
                } else {
                    return 1;
                }
            });
        });
        this.slots = this.#getPlotSlots();
    }
}

export {Grid};