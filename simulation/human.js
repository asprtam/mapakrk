import { Simulation } from "./simulation.js";
import { Hospitality, Home } from "./entites.js";
import { SimulationGlobals } from "./simulationGlobals.js";
import { Utils } from "./utils.js";
import { LASTNAMES, MALE_NAMES, FEMALE_NAMES, OTHER_NAMES } from "./names.js";
import { Path } from "./path.js";
import { intrests, intrestCategories } from "../data/intrests.js";
import { Meeting, FieldMeeting } from "./meeting.js";

/**
 * @typedef {{x: Number, y:Number}} pos
 */
/** @typedef {import("./grid.js").PLOT_SLOT} PLOT_SLOT */
/** @typedef {import("../data/intrests.js").INTREST_CATEGORY_NAME} INTREST_CATEGORY_NAME */
/** @typedef {import("../data/intrests.js").INTREST_TAG} INTREST_TAG */

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

/** @typedef {'in home'|'working'|'walking'|'meeting'|'in hospitality'} HUMAN_ACTION */
/** @typedef {{'in home': '', 'working': '', 'walking': '', 'meeting': '', 'in hospitality': ''}} HUMAN_ACTION_NAMES */

/**
 * @typedef {Object} HUMAN_STATUSES
 * @property {Number} boredom
 * @property {Number} fatigue
 */

/**
 * @typedef {Object} HUMAN_DATA
 * @property {Number} id
 * @property {HUMAN_INFO} info
 * @property {HUMAN_ATTRIBUTES} attributes
 * @property {Array<INTREST_TAG>} intrests
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
        boredom: 1,
        fatigue: 1
    }
    /** @type {{[key in keyof HUMAN_STATUSES]: Boolean}} */
    statusClearedFlags = {
        boredom: false,
        fatigue: false
    }
    /** @type {pos} */
    pos;
    /** @type {pos} */
    renderedPos;
    /** @type {Number|Null} */
    currentPlotId = null;
    /** @type {Number|null} */
    target = null;
    /** @type {HUMAN_TARGET_TYPE} */
    targetType = 'home';
    /** @type {pos|null} */
    walkingTo = null;
    /** @type {Path|null} */
    pathToWalkOn = null;
    /** @type {Number} */
    crossedDistance = 0;
    /** @type {Array<pos>} */
    currentTickVisitedPoints = [];
    /** @type {Array<INTREST_CATEGORY_NAME>} */
    intrestCategories = [];
    /** @type {Array<INTREST_TAG>} */
    intrests = [];
    /**
     * @param {Number} id
     * @returns {Boolean} 
     */
    isFriendOf = (id) => {
        for(let friendData of this.friends) {
            if(friendData.id == id) {
                return true;
                break;
            }
        }
        return false;
    }

    /** @type {HUMAN_FRIENDS_LIST} */
    friends = [];

    /** @type {Number} */
    get walkTickRange() {
        return Math.floor(this.attributes.physical / 30) + 6;
    }

    /** @type {Number} */
    get looseFocusChance() {
        return Math.round((((100 - this.attributes.intelligence)/100) * (this.status.boredom / 10)) / 4)
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
     * @param {Boolean} [socialScore=true]
     * @returns {Number} 
     */
    getHospitalityPreferenceScore = (id, socialScore=true) => {
        let preferenceScore = 1;

        /** @type {Hospitality} */ //@ts-ignore
        let hospitality = this.simulation.plots[id];
        if(hospitality.isHospitality && socialScore) {
            let socialScore = Math.round(hospitality.currentVisitors.length * ((this.attributes.social-30)/30)*100);
            socialScore+= Math.round(hospitality.humansWalkingTo.length * ((this.attributes.social-30)/30)*50);
            preferenceScore+=socialScore;

            if(hospitality.welcomeIntrestsTags.length > 0 || hospitality.unwelcomeIntrestsTags.length > 0) {
                for(let intrestTag of this.intrests) {
                    if(hospitality.unwelcomeIntrestsTags.includes(intrestTag)) {
                        preferenceScore -= SimulationGlobals.intrestPreferenceGain * 2;
                    } else if(hospitality.welcomeIntrestsTags.includes(intrestTag)) {
                        preferenceScore += SimulationGlobals.intrestPreferenceGain;
                    }
                }
            }
            if(hospitality.welcomeIntrestCategories.length > 0 || hospitality.unwelcomeIntrestCategories.length > 0) {
                for(let categoryName of this.intrestCategories) {
                    if(hospitality.unwelcomeIntrestCategories.includes(categoryName)) {
                        preferenceScore -= SimulationGlobals.intrestCategoryPreferenceGain * 2;
                    } else if(hospitality.welcomeIntrestCategories.includes(categoryName)) {
                        preferenceScore += SimulationGlobals.intrestCategoryPreferenceGain;
                    }
                }
            }
        }

        if(preferenceScore <= 0) {
            return 1;
        } else {
            return preferenceScore;
        }
    }

    /** 
     * @param {Number} id
     * @returns {Number}
     */
    getHospitalityFatigueGain = (id) => {
        let gain = 1;
        let hospitality = this.simulation.plots[id];
        if(hospitality) {
            gain += Math.round(hospitality.currentVisitors.length * ((100 - this.attributes.social)/20));
        }
        return gain;
    }

    /**
     * @param {Number} id
     * @returns {Number}
     */
    getHospitalityFatigueLoss = (id) => {
        let loss = this.getHospitalityPreferenceScore(id, false);
        let hospitality = this.simulation.plots[id];
        if(hospitality) {
            loss += Math.round(hospitality.currentVisitors.length * ((this.attributes.social-30)/20));
        }
        return loss;
    }

    /**
     * @overload
     * @param {Array<Number>} [exclude=[]]
     * @param {false} [allowNull=false]
     * @param {Number} [rangeMult]
     * @returns {Hospitality}
     */
    /**
     * @overload
     * @param {Array<Number>} [exclude=[]]
     * @param {true} [allowNull=false]
     * @param {Number} [rangeMult]
     * @returns {Hospitality|null}
     */
    getPreferredHospitality = (exclude = [], allowNull = false, rangeMult = 5) => {
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
            let closestHospitalities = this.getHospitalitiesInRange(this.attributes.physical * rangeMult, exclude);
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
     * @returns {Promise<Path>}
     */
    getPath = (from, to) => {
        return new Promise((res) => {
            this.simulation.grid.findPath(from, to).then((path) => {
                res(path);
            });
        });
    }

    /** @returns {Promise<Boolean>} */
    walkProgress = () => {
        return new Promise((res) => {
            this.crossedDistance += this.walkTickRange;
            if(this.crossedDistance >= this.pathToWalkOn.distance) {
                this.onWalkEnd();
                this.onWalkEnd = () => {};
            } else {
                let {point, rendered} = this.pathToWalkOn.getPositionOfDistance(this.crossedDistance);
                this.renderedPos = rendered;
                this.pos = JSON.parse(JSON.stringify(this.pathToWalkOn.plots[point]));
            }
            res(true);
        });
    }

    /**
     * @returns {Promise<Boolean>}
     */
    tickDecisionMaking = () => {
        return new Promise((res) => {
            this.currentTickVisitedPoints = [this.pos];
            this.decideNext().then(() => {
                this.tick().then(() => {
                    res(true);
                });
            });
        });
    }

    /** @returns {Promise<Boolean>} */
    decideNext = () => {
        return new Promise(async (res) => {
            switch(this.action) {
                case "in home": {
                    let nextAction = Utils.getRandomWithProbability({'stay home': 1700 - this.status.boredom, 'leave home': Math.max(0, this.status.boredom - 300)});
                    if(nextAction == 'stay home') {

                    } else {
                        this.simulation.plots[this.homeId].removeVisitor(this.id);
                        this.statusClearedFlags.boredom = false;
                        this.statusClearedFlags.fatigue = false;
                        this.targetType = 'hospitality';
                        let targetHospitality = this.getPreferredHospitality();
                        this.target = targetHospitality.id;
                        this.walkingTo = targetHospitality.pos;
                        targetHospitality.addWalker(this.id);
                        this.crossedDistance = 0;
                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                        this.action = 'walking';
                        this.currentPlotId = null;
                        this.onWalkEnd = () => {
                            this.statusClearedFlags.boredom = false;
                            this.statusClearedFlags.fatigue = false;
                            this.action = 'in hospitality';
                            this.simulation.plots[this.target + 0].addVisitor(this.id);
                            this.pos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                            this.renderedPos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                            this.currentPlotId = this.target + 0;
                            this.crossedDistance = 0;
                            this.pathToWalkOn = null;
                        }
                    }
                    res(true);
                    break;
                }
                case "in hospitality": {
                    if(this.statusClearedFlags.boredom || this.statusClearedFlags.fatigue) {
                        let nextAction = Utils.getRandomWithProbability({'change': Math.max(0, this.status.boredom - 300), 'stay': 1700 - this.status.boredom});
                        if(nextAction == 'change') {
                            this.simulation.plots[this.target + 0].removeVisitor(this.id);
                            const goHome = async () => {
                                this.home.addWalker(this.id);
                                this.targetType = 'home';
                                this.target = this.homeId;
                                this.statusClearedFlags.boredom = false;
                                this.statusClearedFlags.fatigue = false;
                                this.walkingTo = this.home.pos;
                                this.crossedDistance = 0;
                                this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                                this.action = 'walking';
                                this.currentPlotId = null;
                                this.onWalkEnd = () => {
                                    this.statusClearedFlags.boredom = false;
                                    this.statusClearedFlags.fatigue = false;
                                    this.action = 'in home';
                                    this.simulation.plots[this.homeId].addVisitor(this.id);
                                    this.pos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                    this.renderedPos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                    this.currentPlotId = this.homeId + 0;
                                    this.crossedDistance = 0;
                                    this.pathToWalkOn = null;
                                }
                                res(true);
                            }

                            let goHomeOrNew = Utils.getRandomWithProbability({'go home': ((100 + Math.round(this.status.fatigue / 10)) - this.attributes.social), 'change place': this.attributes.social + Math.round((1000 - this.status.fatigue)/10)});
                            if(goHomeOrNew == 'go home') {
                                goHome();
                            } else {
                                let targetHospitality = this.getPreferredHospitality([this.target + 0], true);
                                if(targetHospitality === null) {
                                    goHome();
                                } else {
                                    targetHospitality.addWalker(this.id);
                                    this.statusClearedFlags.boredom = false;
                                    this.statusClearedFlags.fatigue = false;
                                    this.targetType = 'hospitality';
                                    this.target = targetHospitality.id;
                                    this.walkingTo = targetHospitality.pos;
                                    this.crossedDistance = 0;
                                    this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                                    this.action = 'walking';
                                    this.currentPlotId = null;
                                    this.onWalkEnd = () => {
                                        this.statusClearedFlags.boredom = false;
                                        this.statusClearedFlags.fatigue = false;
                                        this.action = 'in hospitality';
                                        this.simulation.plots[this.target + 0].addVisitor(this.id);
                                        this.pos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                        this.renderedPos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                        this.currentPlotId = this.target + 0;
                                        this.crossedDistance = 0;
                                        this.pathToWalkOn = null;
                                    }
                                    res(true);
                                }
                            }
                        } else {
                            res(true);
                        }
                    } else {
                        res(true);
                    }
                    break;
                }
                case "walking": {
                    let looseFocusChance = this.looseFocusChance + 0;
                    let obj = {'lose': Math.round(looseFocusChance*0.5), 'keep': (100 - looseFocusChance) + this.attributes.intelligence };
                    if(this.targetType == 'home') {
                        obj.lose = Math.round(looseFocusChance*0.1);
                    }
                    // console.log(obj, this.info);
                    // this.simulation.logWrite(obj, this.info);
                    let loseFocusOrKeepWalking = Utils.getRandomWithProbability(obj);
                    if(loseFocusOrKeepWalking == 'lose') {
                        this.simulation.plots[this.target].removeWalker(this.id);
                        let hospitalityOrHome = Utils.getRandomWithProbability({'hospitality': Math.round((this.status.boredom / 5) + (100 - (this.status.fatigue / 10)) + this.attributes.social), 'home': Math.round((100 - (this.status.boredom / 10)) + (this.status.fatigue / 5) + (100 - this.attributes.social))});
                        switch(hospitalityOrHome) {
                            case "hospitality": {
                                let targetHospitality = this.getPreferredHospitality([], true, 2);
                                if(targetHospitality) {
                                    if(targetHospitality.id !== this.target) {
                                        this.statusClearedFlags.boredom = false;
                                        this.statusClearedFlags.fatigue = false;
                                        this.targetType = 'hospitality';
                                        this.target = targetHospitality.id;
                                        this.walkingTo = targetHospitality.pos;
                                        targetHospitality.addWalker(this.id);
                                        this.crossedDistance = 0;
                                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                                        this.action = 'walking';
                                        this.currentPlotId = null;
                                        this.onWalkEnd = () => {
                                            this.statusClearedFlags.boredom = false;
                                            this.statusClearedFlags.fatigue = false;
                                            this.action = 'in hospitality';
                                            this.simulation.plots[this.target + 0].addVisitor(this.id);
                                            this.pos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                            this.renderedPos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                            this.currentPlotId = this.target + 0;
                                            this.crossedDistance = 0;
                                            this.pathToWalkOn = null;
                                        };
                                    }
                                }
                                break;
                            }
                            case "home": {
                                this.home.addWalker(this.id);
                                this.targetType = 'home';
                                this.target = this.homeId;
                                this.statusClearedFlags.boredom = false;
                                this.statusClearedFlags.fatigue = false;
                                this.walkingTo = this.home.pos;
                                this.crossedDistance = 0;
                                this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                                this.action = 'walking';
                                this.currentPlotId = null;
                                this.onWalkEnd = () => {
                                    this.statusClearedFlags.boredom = false;
                                    this.statusClearedFlags.fatigue = false;
                                    this.action = 'in home';
                                    this.simulation.plots[this.homeId].addVisitor(this.id);
                                    this.pos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                    this.renderedPos = JSON.parse(JSON.stringify(this.simulation.plots[this.target + 0].pos));
                                    this.currentPlotId = this.homeId + 0;
                                    this.crossedDistance = 0;
                                    this.pathToWalkOn = null;
                                }
                                break;
                            }
                        }
                    }
                    this.status.fatigue++;
                    if(this.status.fatigue > 999) {
                        this.status.fatigue = 999;
                    }
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
        return new Promise(async (res) => {
            switch(this.action) {
                case "in home": {
                    this.targetType = 'home';
                    this.target = this.homeId;
                    if(this.statusClearedFlags.fatigue) {
                        this.status.boredom += Math.floor((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed;
                        if(this.status.boredom > 999) {
                            this.status.boredom = 999;
                        }
                    } else {
                        this.status.fatigue -= Math.max(0, (10 - (this.simulation.plots[this.homeId].currentVisitors.length - 1)));
                        if(this.status.fatigue < 1) {
                            this.status.fatigue = 1;
                            this.statusClearedFlags.fatigue = true;
                        }
                    }
                    res(true);
                    break;
                }
                case "working": {
                    res(true);
                    break;
                }
                case "walking": {
                    await this.walkProgress();
                    res(true);
                    break;
                }
                case "meeting": {
                    res(true);
                    break;
                }
                case "in hospitality": {
                    if(this.statusClearedFlags.fatigue) {
                        this.status.fatigue += this.getHospitalityFatigueGain(this.currentPlotId);
                        if(this.status.fatigue > 999) {
                            this.status.fatigue = 999;
                        } else if(this.status.fatigue <= 1) {
                            this.status.fatigue = 1;
                        }
                    } else {
                        this.status.fatigue -= this.getHospitalityFatigueLoss(this.currentPlotId);
                        if(this.status.fatigue <= 1) {
                            this.status.fatigue = 1;
                            this.statusClearedFlags.fatigue = true;
                        } else if(this.status.fatigue > 999) {
                            this.status.fatigue = 999;
                        }
                    }
                    if(this.statusClearedFlags.boredom) {
                        this.status.boredom += Math.floor(((100 + SimulationGlobals.boredomRatio) - this.attributes.social) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed;
                        if(this.status.boredom > 999) {
                            this.status.boredom = 999;
                        }
                    } else {
                        this.status.boredom -= Math.floor((50 + this.attributes.social) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed;
                        if(this.status.boredom <= 1) {
                            this.status.boredom = 1;
                            this.statusClearedFlags.boredom = true;
                        }
                    }
                    res(true);
                    break;
                }
                default: {
                    res(true);
                    break;
                }
            }
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
        /**
         * @returns {Number}
         */
        const getAge = () => {
            switch(Utils.getRandomWithProbability({'16-20': 10, '20-30': 50, '30-40': 25, '40-50': 10, '60-70': 5})) {
                case "16-20": {
                    return Utils.randomInRange(16, 20)
                }
                case "20-30": {
                    return Utils.randomInRange(20, 30);
                }
                case "30-40": {
                    return Utils.randomInRange(30, 40);
                }
                case "40-50": {
                    return Utils.randomInRange(40, 50);
                }
                case "60-70": {
                    return Utils.randomInRange(60, 70);
                }
            }
        }
        /** @type {HUMAN_INFO} */ //@ts-ignore
        let info = {
            age: getAge(),
            gender: Utils.getRandomWithProbability({'male': 48, 'female': 48, 'other': 64}),
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

    /** 
     * @param {Array<INTREST_TAG>} intrestsTags
     * @returns {Array<INTREST_CATEGORY_NAME>}
     */
    getIntrestCategories = (intrestsTags) => {
        /** @type {Array<INTREST_CATEGORY_NAME>} */
        let categoriesArr = [];
        intrestsTags.forEach((intrestTag) => {
            if(intrests.list[intrestTag]) {
                intrests.list[intrestTag].categories.forEach((catName) => {
                    if(!categoriesArr.includes(catName)) {
                        categoriesArr.push(catName);
                    }
                });
            }
        });
        return categoriesArr.toSorted();
    }

    /**
     * @returns {Array<INTREST_TAG>}
     */
    getRandomIntrests = () => {
        /** @type {Array<INTREST_TAG>} */
        let intrestsArr = [intrests.getRandomIntrest()];

        let intrestCount = 1;
        switch(Utils.getRandomWithProbability({'below4': 3, 'over4': 1})) {
            case "below4": {
                intrestCount = Utils.randomInRange(1, 3);
                break;
            }
            case "over4": {
                intrestCount = Utils.randomInRange(3, 6);
                break;
            }
        }

        const loopFunc = () => {
            let possibleIntrests = intrests.normalizeConnectedIntrests(intrests.getConnectedIntrestsFromTagArray(intrestsArr, true, true), 1, true, 5);
            intrestsArr.forEach((tag) => {
                if(typeof possibleIntrests[tag] !== 'undefined') {
                    delete possibleIntrests[tag];
                }
            });
            if(Object.keys(possibleIntrests).length > 0) {
                intrestsArr.push(Utils.getRandomWithProbability(possibleIntrests));
            }
        }

        for(let i = 1; i<intrestCount; i++) {
            loopFunc();
        }

        if(intrests.intrestsArrContainsCategory(intrestsArr, 'artforms')) {
            loopFunc();
        } else {
            let possibleIntrests = intrests.filterConnectedIntrestsByCategory(intrests.getConnectedIntrestsFromTagArray(intrestsArr, true, true), 'artforms');
            if(Object.keys(possibleIntrests).length > 0) { //@ts-ignore
                possibleIntrests = intrests.normalizeConnectedIntrests(possibleIntrests, 1, false, 10);
                intrestsArr.push(Utils.getRandomWithProbability(possibleIntrests));
            } else { //@ts-ignore
                intrestsArr.push(Utils.getRandomArrayElement(Object.keys(intrests.getIntrestsOfCategory('artforms'))));
            }
        }

        return intrestsArr.toSorted();
    }

    /** @type {HUMAN_ATTRIBUTES} */
    attributes;
    /** @type {HUMAN_INFO} */
    info;

    get data () {
        return {info: this.info, attributes: this.attributes, intrests: this.intrests};
    }

    /**
     * @param {Simulation} simulation
     * @param {Number} [home]
     * @param {HUMAN_INFO_SOFT_REQ} [info]
     * @param {HUMAN_ATTRIBUTES} [attributes]
     * @param {Array<INTREST_TAG>} [_intrests]
     */
    constructor(simulation, home, info, attributes, _intrests) {
        this.simulation = simulation;
        this.id = this.simulation.humans.push(this) - 1;

        if(typeof home == 'number') {
            this.homeId = home;
        } else {
            this.homeId = new Home(this.simulation, this.simulation.grid.getRandomAvailableSlot()).id;
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

        if(_intrests) {
            this.intrests = _intrests;
            if(!intrests.intrestsArrContainsCategory(this.intrests, 'artforms')) {
                let allArtforms = intrests.getIntrestsOfCategory('artforms'); //@ts-ignore
                this.intrests.push(Utils.getRandomArrayElement(Object.keys(allArtforms)));
            }
        } else {
            this.intrests = this.getRandomIntrests();
        }
        this.intrestCategories = this.getIntrestCategories(this.intrests);

        this.pos = { x: this.home.pos.x + 0, y: this.home.pos.y + 0 };
        this.renderedPos = { x: this.home.pos.x + 0, y: this.home.pos.y + 0 };
        this.targetType = 'home';
        this.target = this.homeId;
        this.currentPlotId = this.homeId + 0;
        this.simulation.plots[this.homeId].addVisitor(this.id);
    }
}

export { Human };