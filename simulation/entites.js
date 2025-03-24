import { Simulation } from "./simulation";
import { SimulationGlobals } from "./simulationGlobals";
import { Utils } from "./utils";
import { LASTNAMES, MALE_NAMES, FEMALE_NAMES, OTHER_NAMES } from "./names";

/**
 * @typedef {{x: Number, y:Number}} pos
 */

class Plot {
    /** @type {Simulation} */
    simulation;
    /** @type {pos} */
    pos;
    /** @type {Number} */
    id;

    /**
     * @param {Simulation} simulation
     * @param {pos} pos 
     */
    constructor(simulation, pos) {
        this.simulation = simulation;
        this.pos = pos;
        this.id = simulation.plots.push(this) - 1;
    }
}

class Home extends Plot {
    /**
     * @param {Simulation} simulation
     * @param {pos} pos 
     */
    constructor(simulation, pos) {
        super(simulation, pos);
    }
}

class Hospitality extends Plot {
    /** @type {Number} */
    hospitalityId;
    /**
     * @param {Simulation} simulation
     * @param {pos} pos 
     */
    constructor(simulation, pos) {
        super(simulation, pos);
        this.hospitalityId = simulation.hospitalities.push(this) - 1;
    }
}

/**
 * @typedef {Object} HUMAN_ATTRIBUTES
 * @property {Number} physical
 * @property {Number} social
 * @property {Number} intelligence
 */
/**
 * @typedef {Object} HUMAN_ATTRIBUTES_SOFT_REQ
 * @property {Number} [physical]
 * @property {Number} [social]
 * @property {Number} [intelligence]
 */
/** 
 * @typedef {Object} HUMAN_INFO
 * @property {String} name
 * @property {String} lastname
 * @property {Number} age
 * @property {('male'|'female'|'other')} gender
 * @property {('male'|'female'|'other')} genderPronoun
 * @property {String|null} customGenderName
 */
/** 
 * @typedef {Object} HUMAN_INFO_SOFT_REQ
 * @property {String} [name]
 * @property {String} [lastname]
 * @property {Number} [age]
 * @property {('male'|'female'|'other')} [gender]
 * @property {('male'|'female'|'other')} [genderPronoun]
 * @property {String} [customGenderName]
 */

class Human {
    /** @type {Simulation} */
    simulation;
    /** @type {Number} */
    id;
    /** @type {Number} */
    homeId;
    /** @type {'in home'|'walking'|'meeting'|'in hospitality'} */
    action = 'in home';
    /** @type {{boredom: Number}} */
    status = {
        boredom: 1
    }
    /** @type {pos} */
    pos;
    /** @type {pos|null} */
    walkingTo = null;
    /** @type {Array<pos>|null} */
    pathToWalkOn = null;
    /** @type {Array<pos>} */
    currentTickVisitedPoints = [];

    onWalkEnd = () => {

    }

    /** @type {Array<String>} */
    static attriburesList = ['physical', 'social', 'intelligence'];

    /** @type {Home} */
    get home () {
        return this.simulation.plots[this.homeId];
    }

    /** 
     * @param {pos} from
     * @param {pos} to
     * @returns {Promise<Array<pos>>}
     */
    getPath = (from, to) => {
        return new Promise((res) => {
            this.simulation.findPaths(from, to).then((foundPaths) => {
                if (foundPaths.paths.length > 0) {
                    res(foundPaths.paths[Utils.getRandomWithProbability(foundPaths.probability)]);
                } else {
                    res([to]);
                }
            });
        });
    }

    /** @returns {Promise<Boolean>} */
    walkProgress = () => {
        return new Promise((res) => {
            let crossedPlots = (Math.floor(this.attributes.physical / 10) + 1) * this.simulation.currentSpeed;
            if(this.pathToWalkOn.length <= crossedPlots) {
                this.currentTickVisitedPoints = JSON.parse(JSON.stringify(this.pathToWalkOn));
                this.pathToWalkOn = null;
                this.pos = this.currentTickVisitedPoints[this.currentTickVisitedPoints.length - 1];
                this.onWalkEnd();
                this.onWalkEnd = () => {};
            } else {
                this.currentTickVisitedPoints = this.pathToWalkOn.slice(0, crossedPlots);
                this.pathToWalkOn = this.pathToWalkOn.slice(crossedPlots);
                this.pos = this.currentTickVisitedPoints[this.currentTickVisitedPoints.length - 1];
                if(this.pathToWalkOn.length == 0) {
                    this.pathToWalkOn = null;
                    this.onWalkEnd();
                    this.onWalkEnd = () => {};
                }
            }
            res(true);
        });
    }

    /** @returns {Promise<Boolean>} */
    decideNext = () => {
        return new Promise(async (res) => {
            switch (this.action) {
                case "in home": {
                    let nextAction = Utils.getRandomWithProbability({'stay home': 100 - this.status.boredom, 'leave home': this.status.boredom});
                    
                    if(nextAction == 'stay home') {
                        this.status.boredom += Math.floor((this.attributes.social + 10) / 10) * this.simulation.currentSpeed;
                        if(this.status.boredom > 99) {
                            this.status.boredom = 99;
                        }
                    } else {
                        this.status.boredom = 1;
                        this.walkingTo = Utils.getRandomArrayElement(this.simulation.hospitalities).pos;
                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                        this.action = 'walking';
                        this.onWalkEnd = () => {
                            this.action = 'in hospitality';
                        }
                    }

                    res(true);

                    break;
                }
                case "in hospitality": {
                    let nextAction = Utils.getRandomWithProbability({ 'return home': this.status.boredom, 'stay': 100 - this.status.boredom });

                    if(nextAction == 'return home') {
                        this.status.boredom = 1;
                        this.walkingTo = this.home.pos;
                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                        this.action = 'walking';
                        this.onWalkEnd = () => {
                            this.action = 'in home';
                        }
                    } else {
                        this.status.boredom += Math.floor((110 - this.attributes.social) / 10) * this.simulation.currentSpeed;
                    }

                    res(true);

                    break;
                }
                case "walking": {
                    await this.walkProgress();
                    res(true);

                    break;
                }
            }
        });
    }
    /**
     * @returns {Promise<Boolean>}
     */
    tick = () => {
        return new Promise((res) => {
            this.currentTickVisitedPoints = [this.pos];
            this.decideNext().then(() => {
                res(true);
            })
        });
    }

    /**
     * 
     * @param {*} srcInfo 
     * @returns {HUMAN_INFO}
     */
    parseInfo = (srcInfo) => {
        /** @type {HUMAN_INFO} */ //@ts-ignore
        let info = {};

        if(srcInfo.age) {
            info.age = srcInfo.age;
        } else {
            info.age = Utils.randomInRange(16, 65);
        }

        if(srcInfo.gender) {
            info.gender = srcInfo.gender;
        } else {
            info.gender = Utils.getRandomWithProbability({ 'male': 48, 'female': 48, 'other': 4 })
        }

        if(srcInfo.genderPronoun) {
            info.genderPronoun = srcInfo.genderPronoun;
        } else {
            switch(info.gender) {
                case "male": {
                    info.genderPronoun = Utils.getRandomWithProbability({ 'male': 95, 'female': 1, 'other': 4 });
                    break;
                }
                case "female": {
                    info.genderPronoun = Utils.getRandomWithProbability({ 'male': 1, 'female': 95, 'other': 4 });
                    break;
                }
                case "other": {
                    info.genderPronoun = Utils.getRandomWithProbability({ 'male': 20, 'female': 20, 'other': 60 });
                    break;
                }
            }
        }

        if(srcInfo.name) {
            info.name = srcInfo.name;
        } else {
            switch (info.gender) {
                case "male": {
                    info.name = Utils.getRandomArrayElement(MALE_NAMES);
                    break;
                }
                case "female": {
                    info.name = Utils.getRandomArrayElement(FEMALE_NAMES);
                    break;
                }
                case "other": {
                    switch (info.genderPronoun) {
                        case "male": {
                            info.name = Utils.getRandomArrayElement(MALE_NAMES);
                            break;
                        }
                        case "female": {
                            info.name = Utils.getRandomArrayElement(FEMALE_NAMES);
                            break;
                        }
                        case "other": {
                            info.name = Utils.getRandomArrayElement(OTHER_NAMES);
                            break;
                        }
                    }
                    break;
                }
            }
        }

        if(srcInfo.lastname) {
            info.lastname = srcInfo.lastname;
        } else {
            info.lastname = Utils.getRandomArrayElement(LASTNAMES)[info.genderPronoun];
        }

        if(srcInfo.customGenderName) {
            info.customGenderName = srcInfo.customGenderName;
        } else {
            info.customGenderName = null;
        }

        return info;
    }
    /** @returns {HUMAN_INFO} */
    getRandomInfo = () => {
        /** @type {HUMAN_INFO} */ //@ts-ignore
        let info = {
            age: Utils.randomInRange(16, 65),
            gender: Utils.getRandomWithProbability({'male': 48, 'female': 48, 'other': 4}),
            customGenderName: null
        };
        switch(info.gender) {
            case "male": {
                info.name = Utils.getRandomArrayElement(MALE_NAMES);
                info.genderPronoun = Utils.getRandomWithProbability({'male': 95, 'female': 1, 'other': 4});
                break;
            }
            case "female": {
                info.name = Utils.getRandomArrayElement(FEMALE_NAMES);
                info.genderPronoun = Utils.getRandomWithProbability({ 'male': 1, 'female': 95, 'other': 4 });
                break;
            }
            case "other": {
                info.genderPronoun = Utils.getRandomWithProbability({ 'male': 20, 'female': 20, 'other': 60 });
                switch(info.genderPronoun) {
                    case "male": {
                        info.name = Utils.getRandomArrayElement(MALE_NAMES);
                        break;
                    }
                    case "female": {
                        info.name = Utils.getRandomArrayElement(FEMALE_NAMES);
                        break;
                    }
                    case "other": {
                        info.name = Utils.getRandomArrayElement(OTHER_NAMES);
                        break;
                    }
                }
                break;
            }
        }
        info.lastname = Utils.getRandomArrayElement(LASTNAMES)[info.genderPronoun];
        return info;
    }

    /**
     * @param {HUMAN_ATTRIBUTES_SOFT_REQ} srcAttributes 
     * @returns {HUMAN_ATTRIBUTES}
     */
    parseAttributes = (srcAttributes) => {
        let parsedAttributes = this.getRandomAttributes();

        Human.attriburesList.forEach((attributeName) => {
            if(typeof srcAttributes[attributeName] == 'number') {
                parsedAttributes[attributeName] = (srcAttributes[attributeName]%100) + 1;
            }
        });

        return parsedAttributes;
    }

    /** 
     * @param {Number} [avg=50]
     * @returns {HUMAN_ATTRIBUTES}
     */
    getRandomAttributes = (avg=50) => {
        /** @type {HUMAN_ATTRIBUTES} */ //@ts-ignore
        let attributes = {};

        let desiredSum = avg*Human.attriburesList.length;
        let currentSum = 0;

        let currentMin = 1;
        let currentMax = 100;

        Human.attriburesList.forEach((attributeName, index) => {
            if(index == Human.attriburesList.length - 1) {
                attributes[attributeName] = desiredSum - currentSum;
                currentSum = desiredSum;
            } else {
                do {
                    attributes[attributeName] = Utils.randomInRange(currentMin, currentMax);
                } while (desiredSum - (currentSum + attributes[attributeName]) > currentMax / (Human.attriburesList.length - (index + 1)));

                currentSum += attributes[attributeName];

                if(desiredSum - currentSum <= 100 - (index + 1)) {
                    currentMax = (desiredSum - currentSum) - (index + 1);
                }
            }
        });

        return attributes;
    }

    /** @type {HUMAN_ATTRIBUTES} */
    attributes;
    /** @type {HUMAN_INFO} */
    info;

    /**
     * @param {Simulation} simulation
     * @param {Number} [home]
     * @param {HUMAN_INFO_SOFT_REQ} [info]
     * @param {HUMAN_ATTRIBUTES} [attributes]
     */
    constructor(simulation, home, info, attributes) {
        this.simulation = simulation;
        this.id = this.simulation.humans.push(this) - 1;

        if(typeof home == 'number') {
            this.homeId = home;
        } else {
            this.homeId = new Home(this.simulation, this.simulation.grid.getBoundaryPoints()[Math.floor(Math.random() * this.simulation.grid.getBoundaryPoints().length)]).id;
        }

        if(attributes) {
            this.attributes = this.parseAttributes(attributes);
        } else {
            this.attributes = this.getRandomAttributes();
        }

        if(info) {
            this.info = this.parseInfo(info);
        } else {
            this.info = this.getRandomInfo();
        }

        this.pos = { x: this.home.pos.x + 0, y: this.home.pos.y + 0 };
    }
}

export { Plot, Home, Hospitality, Human };