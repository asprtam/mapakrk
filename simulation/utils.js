class Utils {
    /**
     * @param {Number} [min] 
     * @param {Number} [max] 
     * @returns {Number}
     */
    static randomInRange = (min=0, max=Number.MAX_SAFE_INTEGER) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * @template {*} SRC_ARR_TYPE
     * @param {Array<SRC_ARR_TYPE>} arr
     * @returns {SRC_ARR_TYPE}
     */
    static getRandomArrayElement = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    /**
     * @template {{[id:string]:Number}} PROBABILITY
     * @param {PROBABILITY} probability 
     * @returns {keyof PROBABILITY}
     */
    static getRandomWithProbability = (probability) => {
        let max = 0;

        let tenthPow = 0;

        Object.keys(probability).forEach((key) => {
            let currentPow = 0;
            while(Math.floor(probability[key] * Math.pow(10, currentPow)) !== probability[key] * Math.pow(10, currentPow)) {
                currentPow++;
            }
            if(currentPow > tenthPow) {
                tenthPow = currentPow+0;
            }
        });
        
        /** @type {{[id:string]: {min: Number, max: Number}}} */
        let parsedProbability = {};
        Object.keys(probability).forEach((key) => {
            parsedProbability[key] = {min: max+0, max: 0};
            max += probability[key]*Math.pow(10, tenthPow);
            parsedProbability[key].max = max+0;
        });

        let random = Math.floor(Math.random() * max);
        /** @type {keyof PROBABILITY|null} */
        let foundKey = null;
        let iterator = 0;

        while(foundKey == null && iterator < Object.keys(parsedProbability).length) {
            if (random >= parsedProbability[Object.keys(parsedProbability)[iterator]].min && random < parsedProbability[Object.keys(parsedProbability)[iterator]].max) {
                foundKey = `${Object.keys(parsedProbability)[iterator]}`;
            }
            iterator++;
        }
        if(foundKey == null) {
            return `${Object.keys(probability)[Math.floor(Math.random() * Object.keys(probability).length)]}`;
        }

        return foundKey;
    }
    constructor() {

    }
}

export {Utils};