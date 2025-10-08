/**
 * @typedef {{x: Number, y:Number}} pos
 */
class Path {
    /** @type {Array<pos>} */
    #plots;
    get plots() {
        return this.#plots;
    }
    /** @type {Number} */
    #distance = 0;
    get distance() {
        return this.#distance;
    }
    /** @type {Map<Number, Number>} */
    #mapping = new Map();
    /**
     * @param {{x: Number, y: Number}} point0
     * @param {{x: Number, y: Number}} point1
     * @param {Number} factor
     * @returns {{x: Number, y: Number}}
     */
    getBetweenPoint = (point0, point1, factor) => {
        if(point0.x == point1.x) {
            let desiredDistance = (Math.max(point0.y, point1.y) - Math.min(point0.y, point1.y)) * factor;
            if(point0.y < point1.y) {
                return { x: point0.x, y: point0.y + desiredDistance };
            } else {
                return { x: point0.x, y: point0.y - desiredDistance };
            }
        } else if(point0.y == point1.y) {
            let desiredDistance = (Math.max(point0.x, point1.x) - Math.min(point0.x, point1.x)) * factor;
            if(point0.x < point1.x) {
                return { x: point0.x + desiredDistance, y: point0.y };
            } else {
                return { x: point0.x - desiredDistance, y: point0.y };
            }
        } else {
            let returnPoint = { x: point0.x, y: point1.y };
            let distance = Math.sqrt(Math.pow(point0.x - point1.x, 2) + Math.pow(point0.y - point1.y, 2));
            let desiredDistance = distance * factor;

            if(point0.x < point1.x) {
                returnPoint.x = point0.x + desiredDistance;
            } else {
                returnPoint.x = point0.x - desiredDistance;
            }

            if(point0.y < point1.y) {
                returnPoint.y = point0.y + desiredDistance;
            } else {
                returnPoint.y = point0.y - desiredDistance;
            }

            return returnPoint;
        }
    }
    /**
     * @param {Number} id
     * @returns {Number}
     */
    getDistanceOfPoint = (id) => {
        if(this.#mapping.has(id)) {
            return this.#mapping.get(id);
        } else {
            return this.#distance;
        }
    }
    /**
     * @overload
     * @param {Number} distance
     * @param {true} returnId
     * @returns {Number}
     */
    /**
     * @overload
     * @param {Number} distance
     * @param {false} returnId
     * @returns {pos}
     */
    /**
     * @param {Number} distance
     * @param {Boolean} returnId
     * @returns {pos|Number}
     */
    getPointOfDistance = (distance, returnId=false) => {
        let foundId = 0;
        for(let [key, value] of Array.from(this.#mapping).reverse()) {
            if(distance >= value) {
                foundId = key + 0;
                break;
            }
        }
        if(returnId) {
            return foundId;
        } else {
            return this.#plots[foundId];
        }
    }
    /** 
     * @param {Number} distance
     * @returns {{point: Number, rendered: pos}}
     */
    getPositionOfDistance = (distance) => {
        let point0Id = this.getPointOfDistance(distance, true);
        if(point0Id + 1 < this.#plots.length) {
            let factor = (distance - this.#mapping.get(point0Id))/(this.#mapping.get(point0Id+1) - this.#mapping.get(point0Id));
            return { point: point0Id, rendered: this.getBetweenPoint(this.plots[point0Id], this.plots[point0Id+1], factor) };
        } else {
            return { point: point0Id, rendered: this.#plots[point0Id] };
        }
    }
    /**
     * 
     * @param {Array<pos>} plots 
     * @param {Boolean} emergencyMode 
     */
    constructor(plots, emergencyMode = false) {
        this.#plots = plots;
        if(!emergencyMode) {
            this.#mapping.set(0, 0);
            for(let i = 1; i < this.#plots.length; i++) {
                if(this.#plots[i - 1].x == this.#plots[i].x || this.#plots[i - 1].y == this.#plots[i].y) {
                    this.#distance += 10;
                } else if(Math.abs(this.#plots[i - 1].x - this.#plots[i].x) == 1 && Math.abs(this.#plots[i - 1].y - this.#plots[i].y) == 1) {
                    this.#distance += 14;
                } else {
                    this.#distance += Math.floor(Math.sqrt(Math.pow(this.#plots[i - 1].x - this.#plots[i].x, 2) + Math.pow(this.#plots[i - 1].y - this.#plots[i].y, 2)) * 10);
                }
                this.#mapping.set(i, this.#distance + 0);
            }
        } else {
            this.#distance = Math.floor(Math.sqrt(Math.pow(this.#plots[0].x - this.#plots[this.#plots.length - 1].x, 2) + Math.pow(this.#plots[0].y - this.#plots[this.#plots.length - 1].y, 2)) * 10);
            this.#mapping.set(0, 0);
            this.#mapping.set(this.#plots.length - 1, this.#distance + 0);
        }
    }
}
export {Path};