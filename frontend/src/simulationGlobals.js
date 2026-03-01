class SimulationGlobals {
    /** @type {Number} */
    static tickTime = 100;
    /** @type {Number} */
    static fps = 20;
    /** @type {Number} */
    static currentSpeed = 1;
    /** @type {Number} */
    static mapScalingFactor = 16;
    /** @type {Number} */
    static startHumans = 60;
    /** @type {Number} */
    static requiredFactor = 8;
    /** @type {Number} */
    static startHospitalities = 15;
    /** @type {Number} */
    static boredomRatio = 40;
    /** @type {Number} */
    static intrestPreferenceGain = 100;
    /** @type {Number} */
    static intrestCategoryPreferenceGain = 50;
    /** @type {Number} */
    static ticksPerHour = Math.round(120 * (1 / this.currentSpeed));
    /** @type {{hour: 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23, day: Number, year: Number}} */
    static defaultStartDate = {
        hour: 2,
        day: 150,
        year: 2024
    }

    constructor() {

    }
}

export {SimulationGlobals};