import { Simulation } from "./simulation.js";
import { Human } from "./human.js";
import { intrests, intrestCategories } from "../data/intrests.js";
import { PlotBoundMeeting } from "./meeting.js";
import { Utils } from "./utils.js";
//@ts-ignore
import { TG, TypeGoblin } from "../typeGoblin.js";
//@ts-ignore
import { TIME_MANAGER } from "./timeManager.js";

/**
 * @typedef {{x: Number, y:Number}} pos
 */
/** @typedef {import("./grid.js").PLOT_SLOT} PLOT_SLOT */
/** @typedef {import("../data/intrests.js").INTREST_CATEGORY_NAME} INTREST_CATEGORY_NAME */
/** @typedef {import("../data/intrests.js").INTREST_TAG} INTREST_TAG */

/** 
 * @typedef {Object} PLOT_STATUS
 * @property {Number} id
 * @property {Array<{name: String, id: Number}>} visitors
 * @property {Boolean} isOpen
 * @property {Number} [popularityScore]
 */

/**
 * @typedef {Object} PLOT_MANAGEMENT_TIME
 * @property {TIME_MANAGER.HOUR} hour
 * @property {TIME_MANAGER.MINUTE} minute
 */

/**
 * @typedef {Object} PLOT_OPEN_HOURS
 * @property {PLOT_MANAGEMENT_TIME} open
 * @property {PLOT_MANAGEMENT_TIME} close
 */

/**
 * @typedef {Object} HOSPITALITY_SAVED_DATA
 * @property {PLOT_OPEN_HOURS} [hours]
 * @property {{[id: String]: Number}} [inheritedIntrestEvents]
 * @property {pos} [pos]
 * @property {Array<INTREST_TAG>} [connectedTopics]
 * @property {String} [name]
 * @property {HOSPITALITY_SUBTYPE} [subtype]
 * @property {Number} [popularityScore]
 * @property {Boolean} [hasIncreasedPopularityInCurrentDay]
 */

class Plot {
    /** @type {Array<Number>} */
    currentVisitors = [];
    /** @type {Array<Number>} */
    humansWalkingTo = [];
    /** @param {Number} id */
    addWalker = (id) => {
        if(!this.humansWalkingTo.includes(id)) {
            this.humansWalkingTo.push(id);
        }
    }
    /** @param {Number} id */
    removeWalker = (id) => {
        const remove = () => {
            let indexOf = this.humansWalkingTo.indexOf(id);
            this.humansWalkingTo = this.humansWalkingTo.slice(0, indexOf).concat(this.humansWalkingTo.slice(indexOf+1));
        }
        while(this.humansWalkingTo.includes(id)) {
            remove();
        }
    }
    /** @param {Number} id */
    addVisitor = (id) => {
        this.removeWalker(id);
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

    /** @returns {PLOT_STATUS} */
    getPlotStatus = () => {
        /** @type {PLOT_STATUS} */
        let plotStatus = { id: this.id + 0, visitors: [], isOpen: this.isOpen };

        this.currentVisitors.forEach((humanId) => {
            if(this.simulation.humans[humanId]) {
                plotStatus.visitors.push({name: `${this.simulation.humans[humanId].info.name} ${this.simulation.humans[humanId].info.lastname}`, id: humanId+0});
            }
        }); //@ts-ignore
        if(this.popularityScore) { //@ts-ignore
            plotStatus.popularityScore = this.popularityScore;
        }
        
        return plotStatus;
    }

    /** @type {Boolean} */
    isOpen = true;

    /** @type {Simulation} */
    simulation;
    /** @type {pos} */
    pos;
    /** @type {Array<pos>} */
    squares = [];
    /**
     * @param {pos} pos 
     * @returns {Boolean}
     */
    containsPos = (pos) => {
        for(let square of this.squares) {
            if(square.x == pos.x && square.y == pos.y) {
                return true;
                break;
            }
        }
        return false;
    }
    /** @type {Number} */
    id;
    /** @type {Number} */
    slotId;
    get slot() {
        return this.simulation.grid.slots[this.slotId];
    }
    /** @type {String} */
    name = '';
    /** @type {String} */
    adress;
    /** @type {false} */
    isHospitality = false;

    /** @returns {Promise<Boolean>} */
    managementTick = () => {
        return new Promise((res) => {
            res(true);
        });
    }

    /**
     * @param {Simulation} simulation
     * @param {PLOT_SLOT|null} [slot]
     * @param {Boolean} [dontClaim]
     */
    constructor(simulation, slot = null, dontClaim = false) {
        this.simulation = simulation;
        if(slot == null && !dontClaim) {
            slot = this.simulation.grid.getRandomAvailableSlot();
        }
        if(!dontClaim) {
            this.pos = slot.pos;
            this.squares = [slot.pos];
            this.slotId = slot.id;
            this.id = simulation.plots.push(this) - 1;
            this.adress = `${slot.streetName} ${slot.number}`;
            this.name = `${slot.streetName} ${slot.number}`;
        }
    }
}
//@ts-ignore
class Home extends Plot {
    /**
     * @param {Simulation} simulation
     * @param {PLOT_SLOT|null} [slot] 
     */
    constructor(simulation, slot = null) {
        super(simulation, slot); 
        this.isHospitality = false;
        this.simulation.grid.claimSlot(slot.id, "M");
    }
}

/** 
 * @typedef {Object} HOSPITALITY_SUBTYPE_INFO
 */

const HospitalitySubtypes = {
    /** @type {HOSPITALITY_SUBTYPE_INFO} */ //@ts-ignore
    'bar': {},
    /** @type {HOSPITALITY_SUBTYPE_INFO} */ //@ts-ignore
    'cafe': {},
    /** @type {HOSPITALITY_SUBTYPE_INFO} */ //@ts-ignore
    'club': {},
    /** @type {HOSPITALITY_SUBTYPE_INFO} */ //@ts-ignore
    'gallery': {}
}

/** @typedef {keyof typeof HospitalitySubtypes} HOSPITALITY_SUBTYPE */

class Hospitality extends Plot {
    /** @type {Number} */
    hospitalityId;
    /** @type {true} */ //@ts-ignore
    isHospitality = true;
    /** @type {PLOT_OPEN_HOURS} */
    openHours;
    /** @type {HOSPITALITY_SUBTYPE} */
    subtype;
    /** @type {Boolean} */
    hasIncreasedPopularityInCurrentDay = false;
    /** @type {Number} */
    popularityScore = 0;
    /** @type {{open: Number, close: Number}} */
    get parsedOpenHours() {
        return { open: this.openHours.open.hour + (this.openHours.open.minute / 60), close: this.openHours.close.hour + (this.openHours.close.minute / 60) }
    }

    /** @param {Number} id */
    addWalker = (id) => {
        if(!this.humansWalkingTo.includes(id)) {
            this.humansWalkingTo.push(id);
        }
    }
    /** @param {Number} id */
    removeWalker = (id) => {
        const remove = () => {
            let indexOf = this.humansWalkingTo.indexOf(id);
            this.humansWalkingTo = this.humansWalkingTo.slice(0, indexOf).concat(this.humansWalkingTo.slice(indexOf+1));
        }
        while(this.humansWalkingTo.includes(id)) {
            remove();
        }
    }
    /** @param {Number} id */
    addVisitor = (id) => {
        this.removeWalker(id);
        this.meeting.onBeforeAddParticipant(id);
        if(!this.currentVisitors.includes(id)) {
            this.currentVisitors.push(id);
        }
        this.meeting.onAddParticipant(id);
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
        this.meeting.onRemoveParticipant(id);
    }

    /** @type {{[id: String]: Number}} */
    inheritedIntrestEvents = {};

    /**
     * @returns {HOSPITALITY_SAVED_DATA}
     */
    getDataDump = () => {
        if(this.name != this.adress) {
            return {
                hours: this.openHours,
                inheritedIntrestEvents: this.inheritedIntrestEvents,
                pos: this.pos,
                connectedTopics: this.welcomeIntrestsTags,
                name: this.name,
                subtype: this.subtype,
                popularityScore: this.popularityScore,
                hasIncreasedPopularityInCurrentDay: this.hasIncreasedPopularityInCurrentDay
            }
        } else {
            return {
                hours: this.openHours,
                inheritedIntrestEvents: this.inheritedIntrestEvents,
                pos: this.pos,
                connectedTopics: this.welcomeIntrestsTags,
                subtype: this.subtype,
                popularityScore: this.popularityScore,
                hasIncreasedPopularityInCurrentDay: this.hasIncreasedPopularityInCurrentDay
            }
        }
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

    /** @type {PlotBoundMeeting} */
    meeting;

    /** @type {Array<import("../data/intrests.js").INTREST_TAG>} */
    welcomeIntrestsTags = [];
    /** @type {Array<import("../data/intrests.js").INTREST_TAG>} */
    unwelcomeIntrestsTags = [];
    /** @type {Array<import("../data/intrests.js").INTREST_CATEGORY_NAME>} */
    welcomeIntrestCategories = [];
    /** @type {Array<import("../data/intrests.js").INTREST_CATEGORY_NAME>} */
    unwelcomeIntrestCategories = [];

    /** @returns {Boolean} */
    checkIfOpen = () => {
        if(this.openHours.close.hour == this.openHours.open.hour && this.openHours.close.minute == this.openHours.open.minute) {
            return true;
        } else {
            let parsedCurrentHour = this.simulation.parsedCurrentHour + 0;
            if(this.openHours.close.hour < this.openHours.open.hour || (this.openHours.close.hour == this.openHours.open.hour && this.openHours.close.minute < this.openHours.open.minute)) {
                if(parsedCurrentHour >= this.parsedOpenHours.open || (parsedCurrentHour < this.parsedOpenHours.open && parsedCurrentHour < this.parsedOpenHours.close)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if(parsedCurrentHour >= this.parsedOpenHours.open && parsedCurrentHour < this.parsedOpenHours.close) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    /** @returns {Promise<Boolean>} */
    onClose = () => {
        return new Promise(async (res) => {
            res(true);
        });
    }

    /** @returns {Promise<Boolean>} */
    onOpen = () => {
        return new Promise(async (res) => {
            res(true);
        });
    }

    /** @returns {HOSPITALITY_SUBTYPE} */
    getRandomSubtype = () => {
        /** @type {{[key in HOSPITALITY_SUBTYPE]?: Number}} */
        let subtypeProbabilityObject = {};
        Object.keys(HospitalitySubtypes).forEach((subtype) => {
            subtypeProbabilityObject[subtype] = Math.round(100 / Object.keys(HospitalitySubtypes).length);
        });
        if(this.hospitalityId >= 4) {
            let containsClub = false;
            let containsBar = false;
            let containsCafe = false;
            let containsGallery = false;
            for(let hospitality of this.simulation.hospitalities) {
                if(!containsClub) {
                    hospitality.subtype == 'club';
                    containsClub = true;
                }
                if(!containsBar) {
                    hospitality.subtype == 'bar';
                    containsBar = true;
                }
                if(!containsCafe) {
                    hospitality.subtype == 'cafe';
                    containsCafe = true;
                }
                if(!containsGallery) {
                    hospitality.subtype == 'gallery';
                    containsGallery = true;
                }
                if(containsClub && containsBar && containsCafe && containsGallery) {
                    break;
                }
            }
            if(!containsClub) {
                if(!this.welcomeIntrestsTags.includes('teology') && !this.welcomeIntrestsTags.includes('traditionalValues')) {
                    subtypeProbabilityObject['club'] += 100;
                }
            }
            if(!containsBar) {
                subtypeProbabilityObject['bar'] += 100;
            }
            if(!containsCafe) {
                if(!this.welcomeIntrestsTags.includes('techno')) {
                    subtypeProbabilityObject['cafe'] += 100;
                }
            }
            if(!containsGallery) {
                subtypeProbabilityObject['gallery'] += 100;
            }
        }
        if(this.welcomeIntrestsTags.includes('music') || this.welcomeIntrestsTags.includes('techno') || this.welcomeIntrestsTags.includes('hiphop')) {
            subtypeProbabilityObject['club'] += 100;
        }
        if(intrests.intrestsArrContainsCategory(this.welcomeIntrestsTags, 'drugs')) {
            subtypeProbabilityObject['club'] += 100;
            subtypeProbabilityObject['bar'] += 50;
        }
        if(intrests.intrestsArrContainsCategory(this.welcomeIntrestsTags, 'artforms')) {
            subtypeProbabilityObject['gallery'] += 200;
        }
        if(intrests.intrestsArrContainsCategory(this.welcomeIntrestsTags, 'socialTopics')) {
            subtypeProbabilityObject['cafe'] += 100;
            subtypeProbabilityObject['bar'] += 50;
            if(this.welcomeIntrestsTags.includes('lgbtActivism')) {
                subtypeProbabilityObject['club'] += 100;
            }
        }
        return Utils.getRandomWithProbability(subtypeProbabilityObject);
    }

    /** 
     * @override
     * @returns {Promise<Boolean>}
     */
    managementTick = () => {
        return new Promise((res) => {
            let isNowOpen = this.checkIfOpen();
            if(!isNowOpen) {
                if(isNowOpen != this.isOpen) {
                    this.isOpen = isNowOpen;
                    this.onClose().then(() => {
                        res(true);
                    });
                } else {
                    this.isOpen = isNowOpen;
                    res(true);
                }
            } else {
                if(isNowOpen != this.isOpen) {
                    this.isOpen = isNowOpen;
                    this.onOpen().then(() => {
                        res(true);
                    });
                } else {
                    this.isOpen = isNowOpen;
                    res(true);
                }
            }
        });
    }
    
    /**
     * @param {Simulation} simulation
     * @param {HOSPITALITY_SAVED_DATA|null} [savedData] 
     */
    constructor(simulation, savedData=null) {
        super(simulation, null, true);
        this.isHospitality = true;
        this.hospitalityId = simulation.hospitalities.push(this) - 1;

        const getRandomIntrests = () => {
            let intrestCount = 0;
            switch(Utils.getRandomWithProbability({ 'any': 2, 'none': 1 })) {
                case "any": {
                    intrestCount = Utils.randomInRange(1, 3);
                    break;
                }
                default: {
                    break;
                }
            }
            if(intrestCount > 0) {
                let firstIntrest = intrests.getRandomIntrest();
                while(intrests.list[firstIntrest].categories.includes('artforms')) {
                    firstIntrest = intrests.getRandomIntrest();
                }
                this.welcomeIntrestsTags = [firstIntrest];
                const loopFunc = () => {
                    let possibleIntrests = intrests.normalizeConnectedIntrests(intrests.getConnectedIntrestsFromTagArray(this.welcomeIntrestsTags, true, true), 1, true, 5);
                    this.welcomeIntrestsTags.forEach((tag) => {
                        if(typeof possibleIntrests[tag] !== 'undefined') {
                            delete possibleIntrests[tag];
                        }
                    });
                    if(Object.keys(possibleIntrests).length > 0) {
                        let randomIntrest = Utils.getRandomWithProbability(possibleIntrests);
                        this.welcomeIntrestsTags.push(randomIntrest);
                    }
                };
                for(let i = 1; i > intrestCount; i++) {
                    loopFunc();
                }
                this.welcomeIntrestCategories = this.getIntrestCategories(this.welcomeIntrestsTags);
            }
        }

        const getDefaultHours = () => {
            let minOpenTime = 6;
            let maxOpenTime = 16;
            let minOpenHour = 7;
            let maxOpenHour = 10;
            switch(this.subtype) {
                case "bar": {
                    minOpenTime = 8;
                    maxOpenTime = 12;
                    minOpenHour = 10;
                    maxOpenHour = 15;
                    break;
                }
                case "cafe": {
                    maxOpenHour = 12;
                    minOpenTime = 8;
                    break;
                }
                case "club": {
                    maxOpenTime = 12;
                    minOpenHour = 17;
                    maxOpenHour = 20;
                    break;
                }
                case "gallery": {
                    maxOpenHour = 11;
                    maxOpenTime = 12;
                    break;
                }
            }
            let openHour = Utils.randomInRange(minOpenHour, maxOpenHour);
            let openTime = Utils.randomInRange(minOpenTime, maxOpenTime);
            return { open: { hour: openHour, minute: 0 }, close: { hour: (openHour + openTime)%24, minute: 0 } }
        }

        if(savedData) {
            if(savedData.pos) {
                let preexistingSlot = this.simulation.grid.getSlotByPos(savedData.pos);
                if(preexistingSlot) {
                    this.slotId = preexistingSlot.id;
                } else {
                    this.slotId = this.simulation.grid.getRandomAvailableSlot().id;
                }
            } else {
                this.slotId = this.simulation.grid.getRandomAvailableSlot().id;
            }
            if(savedData.connectedTopics) {
                this.welcomeIntrestsTags = savedData.connectedTopics;
                this.unwelcomeIntrestCategories = this.getIntrestCategories(this.welcomeIntrestsTags);
            } else {
                getRandomIntrests();
            }
            if(savedData.subtype) {
                this.subtype = savedData.subtype;
            } else {
                this.subtype = this.getRandomSubtype();
            }
            if(savedData.inheritedIntrestEvents) {
                this.inheritedIntrestEvents = savedData.inheritedIntrestEvents;
            }
            if(savedData.hours) {
                this.openHours = savedData.hours; //@ts-ignore
                this.openHours.open.hour = this.openHours.open.hour % 24; //@ts-ignore
                this.openHours.close.hour = this.openHours.close.hour % 24; //@ts-ignore
                this.openHours.open.minute = this.openHours.open.minute % 60; //@ts-ignore
                this.openHours.close.minute = this.openHours.close.minute % 60;
            } else { //@ts-ignore
                this.openHours = getDefaultHours();
            }
            if(savedData.name) {
                this.name = savedData.name;
            }
            if(savedData.popularityScore) {
                this.popularityScore = savedData.popularityScore;
            }
            if(savedData.hasIncreasedPopularityInCurrentDay) {
                this.hasIncreasedPopularityInCurrentDay = savedData.hasIncreasedPopularityInCurrentDay;
            }
        } else {
            this.slotId = this.simulation.grid.getRandomAvailableSlot().id;
            getRandomIntrests();
            this.subtype = this.getRandomSubtype(); //@ts-ignore
            this.openHours = getDefaultHours();
        }

        this.simulation.grid.claimSlot(this.slotId, "H");
        this.pos = this.slot.pos;
        this.squares = [this.slot.pos];
        this.id = simulation.plots.push(this) - 1;
        this.adress = `${this.slot.streetName} ${this.slot.number}`;
        if(this.name.trim() == '') {
            this.name = `${this.slot.streetName} ${this.slot.number}`;
        }
        
        this.isOpen = this.checkIfOpen();
        this.meeting = new PlotBoundMeeting(simulation, this);
    }
}

/**
 * @typedef {import("./human.js").HUMAN_ATTRIBUTES} HUMAN_ATTRIBUTES
 */
/**
 * @typedef {import("./human.js").HUMAN_ATTRIBUTES_SOFT_REQ} HUMAN_ATTRIBUTES_SOFT_REQ
 */
/** 
 * @typedef {import("./human.js").HUMAN_INFO} HUMAN_INFO
 */
/** 
 * @typedef {import("./human.js").HUMAN_INFO_SOFT_REQ} HUMAN_INFO_SOFT_REQ
 */

/** @typedef {import("./human.js").HUMAN_ACTION} HUMAN_ACTION */
/** @typedef {import("./human.js").HUMAN_ACTION_NAMES} HUMAN_ACTION_NAMES */

/**
 * @typedef {import("./human.js").HUMAN_STATUSES} HUMAN_STATUSES
 */

/**
 * @typedef {import("./human.js").HUMAN_DATA} HUMAN_DATA
 */

/** @typedef {import("./human.js").HUMAN_TARGET_TYPE} HUMAN_TARGET_TYPE */

/**
 * @typedef {import("./human.js").HUMAN_FRIEND_DATA} HUMAN_FRIEND_DATA
 */
/** @typedef {import("./human.js").HUMAN_FRIENDS_LIST} HUMAN_FRIENDS_LIST */

export { Plot, Home, Hospitality, Human };