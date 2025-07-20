
import { Path } from "./path.js";
//@ts-ignore
import pkg from "easystarjs";
const Easystar = pkg.js;
/**
 * @typedef {{x: Number, y:Number}} pos
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
    /** @type {Array<Array<Number>>} */
    raw = [[]];

    /**
     * @param {(point:Number, pos?:pos) => void} callback
     */
    forEachPoint = (callback) => {
        this.raw.forEach((column, column_id) => {
            column.forEach((point, row_id) => {
                callback(point, {x: column_id, y: row_id});
            });
        });
    }

    /**
     * 
     * @param {pos} pos 
     * @param {Boolean} [allowDiagonal=true] 
     * @returns {Array<pos>}
     */
    getPointSiblings = (pos, allowDiagonal = true) => {
        /** @type {Array<pos>} */
        const returnArr = [];

        [{ x: pos.x - 1, y: pos.y }, { x: pos.x + 1, y: pos.y }, { x: pos.x, y: pos.y - 1 }, { x: pos.x, y: pos.y + 1 }].forEach((_pos) => {
            if (_pos.x >= 0 && _pos.x < this.width && _pos.y >= 0 && _pos.y < this.height) {
                returnArr.push(_pos);
            }
        });
        if (allowDiagonal) {
            [{ x: pos.x - 1, y: pos.y - 1 }, { x: pos.x + 1, y: pos.y - 1 }, { x: pos.x - 1, y: pos.y + 1 }, { x: pos.x + 1, y: pos.y + 1 }].forEach((_pos) => {
                if (_pos.x >= 0 && _pos.x < this.width && _pos.y >= 0 && _pos.y < this.height) {
                    returnArr.push(_pos);
                }
            });
        }

        return returnArr;
    }

    /**
     * @param {pos} pos
     * @param {(point:Number, pos?:pos) => void} callback
     * @param {Boolean} [allowDiagonal=true] 
     */
    forPointSiblings = (pos, callback, allowDiagonal=true) => {
        this.getPointSiblings(pos, allowDiagonal).forEach((pos) => {
            if(pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
                callback(this.raw[pos.x][pos.y], pos);
            }
        });
    }

    /** @returns {Array<pos>} */
    getWalkablePoints = () => {
        /** @type {Array<pos>} */
        let returnArr = [];
        this.forEachPoint((point, pos) => {
            if(point == 0) {
                returnArr.push(pos);
            }
        });
        return returnArr;
    }

    /**
     * @param {(point:Number, pos?:pos) => void} callback
     */
    forEachWalkablePoint = (callback) => {
        this.forEachPoint((point, pos) => {
            if(point == 0) {
                callback(point, pos);
            }
        });
    }

    /** @returns {Array<pos>} */
    getBlockedPoints = () => {
        /** @type {Array<pos>} */
        let returnArr = [];
        this.forEachPoint((point, pos) => {
            if(point == 1) {
                returnArr.push(pos);
            }
        });
        return returnArr;
    }

    /**
     * @param {(point:Number, pos?:pos) => void} callback
     */
    forEachBlockedPoint = (callback) => {
        this.forEachPoint((point, pos) => {
            if (point) {
                callback(point, pos);
            }
        });
    }

    /** @returns {Array<pos>} */
    getBoundaryPoints = () => {
        /** @type {Array<pos>} */
        let returnArr = [];
        this.forEachPoint((point, pos) => {
            if (point) {
                let found = false;
                this.forPointSiblings(pos, (_point) => {
                    if (_point == 0) {
                        found = true;
                    }
                });
                if (found) {
                    returnArr.push(pos);
                }
            }
        });
        return returnArr;
    }

    /** 
     * @param {pos} pos
     * @returns {Array<pos>}
     */
    getWalkableSiblings = (pos) => {
        /** @type {Array<pos>} */
        const returnArr = [];
        this.forPointSiblings(pos, (point, _pos) => {
            if(point == 0) {
                returnArr.push(_pos);
            }
        }, true);
        return returnArr;
    }

    /**
     * @param {(point:Number, pos?:pos) => void} callback
     */
    forEachBoundaryPoint = (callback) => {
        this.forEachPoint((point, pos) => {
            if (point) {
                let found = false;
                this.forPointSiblings(pos, (_point) => {
                    if (_point) {
                        found = true;
                    }
                });
                if(found) {
                    callback(point, pos);
                }
            }
        });
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

    constructor(raw) {
        this.raw = raw;
    }
}

export {Grid};