import { Simulation } from "./simulation.js";
import { SimulationGlobals } from "./simulationGlobals.js";
import { Utils } from "./utils.js";
import { LASTNAMES, MALE_NAMES, FEMALE_NAMES, OTHER_NAMES } from "./names.js";

/**
 * @typedef {{x: Number, y:Number}} pos
 */

class Plot {
    /** @type {Array<Number>} */
    currentVisitors = [];
    /** @param {Number} id */
    addVisitor = (id) => {
        if(!this.currentVisitors.includes(id)) {
            this.currentVisitors.push(id);
        }
    }
    /** @param {Number} id */
    removeVisitor = (id) => {
        const remove = () => {
            let indexOf = this.currentVisitors.indexOf(id);
            this.currentVisitors = this.currentVisitors.slice(0, indexOf).concat(this.currentVisitors.slice(indexOf+1));
        }
        while(this.currentVisitors.includes(id)) {
            remove();
        }
    }
    /** @type {Simulation} */
    simulation;
    /** @type {pos} */
    pos;
    /** @type {Number} */
    id;
    /** @type {false} */
    isHospitality = false;

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
    /** @type {true} */ //@ts-ignore
    isHospitality = true;
    /**
     * @param {Simulation} simulation
     * @param {pos} pos 
     */
    constructor(simulation, pos) {
        super(simulation, pos);
        this.isHospitality = true;
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

/** @typedef {'in home'|'walking'|'meeting'|'in hospitality'} HUMAN_ACTION */

/**
 * @typedef {Object} HUMAN_STATUSES
 * @property {Number} boredom
 */

/**
 * @typedef {Object} HUMAN_DATA
 * @property {Number} id
 * @property {HUMAN_INFO} info
 * @property {HUMAN_ATTRIBUTES} attributes
 */

/** @typedef {'home'|'hospitality'} HUMAN_TARGET_TYPE */

/**
 * @typedef {Object} HUMAN_FRIEND_DATA
 * @property {Number} id
 * @property {Number} preference
 */
/** @typedef {Array<HUMAN_FRIEND_DATA>} HUMAN_FRIENDS_LIST */

//atrybuty jako komentarz (modność, im więcej wystaw tym szybsza smierć), strata modności za wystawe z kimś niemodnym

class Human {
    /** @type {Simulation} */
    simulation;
    /** @type {Number} */
    id;
    /** @type {Number} */
    homeId;
    /** @type {HUMAN_ACTION} */
    action = 'in home';
    /** @type {HUMAN_STATUSES} */
    status = {
        boredom: 1
    }
    /** @type {pos} */
    pos;
    /** @type {Number|Null} */
    currentPlotId = null;
    /** @type {Number|null} */
    target = null;
    /** @type {HUMAN_TARGET_TYPE} */
    targetType = 'home';
    /** @type {pos|null} */
    walkingTo = null;
    /** @type {Array<pos>|null} */
    pathToWalkOn = null;
    /** @type {Array<pos>} */
    currentTickVisitedPoints = [];
    /** @type {HUMAN_FRIENDS_LIST} */
    friends = [];

    /** @type {Number} */
    get walkTickRange() {
        return Math.floor(this.attributes.physical / 30) + 1;
    }

    /**
     * Zwaraca obiekt - klucz = id, wartość = szansa
     * @param {Number|null} [range=null]
     * @param {Array<Number>} [exclude=[]]
     * @returns {{[id:String]:Number}}
     */
    getHospitalitiesInRange = (range=null, exclude=[]) => {
        /** @type {{[id:String]:Number}} */
        let returnHospitalities = {};
        if(range === null) {
            this.simulation.hospitalities.forEach((hospitality) => {
                if(!exclude.includes(hospitality.id)) {
                    returnHospitalities[`${hospitality.id}`] = this.getHospitalityPreferenceScore(hospitality.id);
                }
            });
        } else {
            this.simulation.hospitalities.forEach((hospitality) => {
                if(!exclude.includes(hospitality.id)) {
                    let distance = Math.sqrt(Math.pow(this.pos.x - hospitality.pos.x, 2) + Math.pow(this.pos.y - hospitality.pos.y, 2));
                    if(distance <= range) {
                        returnHospitalities[`${hospitality.id}`] = this.getHospitalityPreferenceScore(hospitality.id);
                    }
                }
            });
        }
        return returnHospitalities;
    }

    /** 
     * @param {Number} id
     * @returns {Number} 
     */
    getHospitalityPreferenceScore = (id) => {
        let preferenceScore = 1;

        /** @type {Hospitality} */ //@ts-ignore
        let hospitality = this.simulation.plots[id];
        if(hospitality.isHospitality) {
            let socialScore = Math.round(hospitality.currentVisitors.length * ((this.attributes.social-20)/40)*100);
            preferenceScore+=socialScore;
        }

        if(preferenceScore <= 0) {
            return 1;
        } else {
            return preferenceScore;
        }
    }

    /**
     * @overload
     * @param {Array<Number>} [exclude=[]]
     * @param {false} [allowNull=false]
     * @returns {Hospitality}
     */
    /**
     * @overload
     * @param {Array<Number>} [exclude=[]]
     * @param {true} [allowNull=false]
     * @returns {Hospitality|null}
     */
    getPreferredHospitality = (exclude=[], allowNull=false) => {
        /** @type {Number|Null} */
        let preferedHospitality = null;
        if(this.friends.length > 0) {
            /** @type {{[id:String]: Number}} obiekt - klucz = id, wartość = szansa */
            let hospitalitiesWithFriends = {};
            this.friends.forEach((friendData) => {
                let friend = this.simulation.humans[friendData.id];
                if(friend.targetType == 'hospitality' && !exclude.includes(friend.target)) {
                    if(Object.keys(hospitalitiesWithFriends).includes(`${friend.target}`)) {
                        hospitalitiesWithFriends[`${friend.target}`] += friendData.preference;
                    } else {
                        hospitalitiesWithFriends[`${friend.target}`] = friendData.preference + this.getHospitalityPreferenceScore(friend.target);
                    }
                }
            });
            switch (Object.keys(hospitalitiesWithFriends).length) {
                case 0: {
                    break;
                }
                case 1: {
                    preferedHospitality = Number(Object.keys(hospitalitiesWithFriends)[0]);
                    break;
                }
                default: {
                    preferedHospitality = Number(Utils.getRandomWithProbability(hospitalitiesWithFriends));
                    break;
                }
            }
        }
        if(preferedHospitality === null || typeof this.simulation.plots[preferedHospitality] == 'undefined') {
            let closestHospitalities = this.getHospitalitiesInRange(this.attributes.physical * 5, exclude);
            switch (Object.keys(closestHospitalities).length) {
                case 0: {
                    break;
                }
                case 1: {
                    preferedHospitality = Number(Object.keys(closestHospitalities)[0]);
                    break;
                }
                default: {
                    preferedHospitality = Number(Utils.getRandomWithProbability(closestHospitalities));
                    break;
                }
            }
        }
        if(preferedHospitality === null || typeof this.simulation.plots[preferedHospitality] == 'undefined') {
            if(allowNull) {
                return null;
            } else {
                let closestHospitalities = this.getHospitalitiesInRange(null, exclude);
                switch (Object.keys(closestHospitalities).length) {
                    case 0: {
                        return Utils.getRandomArrayElement(this.simulation.hospitalities);
                        break;
                    }
                    case 1: {
                        preferedHospitality = Number(Object.keys(closestHospitalities)[0]);
                        break;
                    }
                    default: {
                        preferedHospitality = Number(Utils.getRandomWithProbability(closestHospitalities));
                        break;
                    }
                }
                if(typeof this.simulation.plots[preferedHospitality] == 'undefined') {
                    return Utils.getRandomArrayElement(this.simulation.hospitalities);
                } else {
                    //@ts-ignore
                    return this.simulation.plots[preferedHospitality];
                }
            }
        } else {
            //@ts-ignore
            return this.simulation.plots[preferedHospitality];
        }
    }

    onWalkEnd = () => {

    }

    /** @type {Array<keyof HUMAN_ATTRIBUTES>} */
    static attriburesList = ['physical', 'social', 'intelligence'];
    /** @type {Array<keyof HUMAN_STATUSES>} */
    static statusList = ['boredom'];

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
                this.simulation.logWrite(`foundPaths ${this.info.name} ${this.info.lastname}`, foundPaths);
                if (foundPaths.paths.length > 0) {
                    let randomPath = foundPaths.paths[Utils.getRandomWithProbability(foundPaths.probability)];
                    if(randomPath.length > 0) {
                        res(randomPath.slice(1));
                    } else {
                        res([to]);
                    }
                } else {
                    res([to]);
                }
            });
        });
    }

    /** @returns {Promise<Boolean>} */
    walkProgress = () => {
        return new Promise((res) => {
            let crossedPlots = this.walkTickRange * this.simulation.currentSpeed;
            if(this.pathToWalkOn.length <= crossedPlots) {
                this.currentTickVisitedPoints = JSON.parse(JSON.stringify(this.pathToWalkOn));
                this.pathToWalkOn = null;
                this.simulation.logWrite(`walk progress ${this.info.name} ${this.info.lastname}`, this.currentTickVisitedPoints);
                this.pos = this.currentTickVisitedPoints[this.currentTickVisitedPoints.length - 1];
                while(this.currentTickVisitedPoints.length < crossedPlots) {
                    this.currentTickVisitedPoints.push({x: this.pos.x, y: this.pos.y});
                }
                this.onWalkEnd();
                this.onWalkEnd = () => {};
            } else {
                this.currentTickVisitedPoints = this.pathToWalkOn.slice(0, crossedPlots);
                this.pathToWalkOn = this.pathToWalkOn.slice(crossedPlots);
                this.pos = this.currentTickVisitedPoints[this.currentTickVisitedPoints.length - 1];
                this.simulation.logWrite(`walk progress ${this.info.name} ${this.info.lastname}`, this.currentTickVisitedPoints);
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
                        this.targetType = 'home';
                        this.target = this.homeId;
                        this.status.boredom += Math.floor((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed;
                        if(this.status.boredom > 99) {
                            this.status.boredom = 99;
                        }
                    } else {
                        this.simulation.plots[this.homeId].removeVisitor(this.id);
                        this.status.boredom = 1;
                        this.targetType = 'hospitality';
                        let targetHospitality = this.getPreferredHospitality();
                        this.target = targetHospitality.id;
                        this.walkingTo = targetHospitality.pos;
                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                        this.action = 'walking';
                        this.currentPlotId = null;
                        this.onWalkEnd = () => {
                            this.action = 'in hospitality';
                            this.simulation.plots[this.target+0].addVisitor(this.id);
                            this.currentPlotId = this.target + 0;
                        }
                    }
                    res(true);
                    break;
                }
                case "in hospitality": {
                    let nextAction = Utils.getRandomWithProbability({ 'change': this.status.boredom, 'stay': 100 - this.status.boredom });
                    if(nextAction == 'change') {
                        this.simulation.plots[this.target+0].removeVisitor(this.id);
                        const goHome = async () => {
                            this.targetType = 'home';
                            this.target = this.homeId;
                            this.status.boredom = 1;
                            this.walkingTo = this.home.pos;
                            this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                            this.action = 'walking';
                            this.currentPlotId = null;
                            this.onWalkEnd = () => {
                                this.action = 'in home';
                                this.simulation.plots[this.homeId].addVisitor(this.id);
                                this.currentPlotId = this.homeId + 0;
                            }
                            res(true);
                        }

                        let goHomeOrNew = Utils.getRandomWithProbability({'go home': 100 - this.attributes.social, 'change place': this.attributes.social});
                        if(goHomeOrNew == 'go home') {
                            goHome();
                        } else {
                            let targetHospitality = this.getPreferredHospitality([this.target+0], true);
                            if(targetHospitality === null) {
                                goHome();
                            } else {
                                this.status.boredom = this.status.boredom - 50;
                                if(this.status.boredom < 1) {
                                    this.status.boredom = 1;
                                }
                                this.targetType = 'hospitality';
                                this.target = targetHospitality.id;
                                this.walkingTo = targetHospitality.pos;
                                this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                                this.action = 'walking';
                                this.currentPlotId = null;
                                this.onWalkEnd = () => {
                                    this.action = 'in hospitality';
                                    this.simulation.plots[this.target+0].addVisitor(this.id);
                                    this.currentPlotId = this.target + 0;
                                }
                                res(true);
                            }
                        }
                    } else {
                        this.status.boredom += Math.floor(((100 + SimulationGlobals.boredomRatio) - this.attributes.social) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed;
                        res(true);
                    }
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
     * @returns {HUMAN_ATTRIBUTES}
     */
    getRandomAttributes = () => {
        /** @type {HUMAN_ATTRIBUTES} */ //@ts-ignore
        let attributes = {};

        let maxTotal = Utils.randomInRange(40, 90)*Human.attriburesList.length;
        let minTotal = 30*Human.attriburesList.length;
        let currentTotal = Number.MAX_SAFE_INTEGER;
        while(!(currentTotal <= maxTotal && currentTotal >= minTotal)) {
            currentTotal = 0;
            Human.attriburesList.forEach((attributeName) => {
                attributes[attributeName] = Utils.randomInRange(1, 100);
                currentTotal+=attributes[attributeName];
            });
        }
        return attributes;
    }

    /** @type {HUMAN_ATTRIBUTES} */
    attributes;
    /** @type {HUMAN_INFO} */
    info;

    get data () {
        return {info: this.info, attributes: this.attributes}
    }

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
        this.targetType = 'home';
        this.target = this.homeId;
        this.currentPlotId = this.homeId + 0;
        this.simulation.plots[this.homeId].addVisitor(this.id);
    }
}

export { Plot, Home, Hospitality, Human };