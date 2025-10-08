import { Simulation } from "./simulation.js";
import { Human } from "./human.js";
import { intrests, intrestCategories } from "../data/intrests.js";
import { PlotBoundMeeting } from "./meeting.js";
import { Utils } from "./utils.js";

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
        let plotStatus = { id: this.id + 0, visitors: [] };

        this.currentVisitors.forEach((humanId) => {
            if(this.simulation.humans[humanId]) {
                plotStatus.visitors.push({name: `${this.simulation.humans[humanId].info.name} ${this.simulation.humans[humanId].info.lastname}`, id: humanId+0});
            }
        });
        
        return plotStatus;
    }

    /** @type {Simulation} */
    simulation;
    /** @type {pos} */
    pos;
    /** @type {Array<pos>} */
    squares = [];
    /** @type {Number} */
    id;
    /** @type {Number} */
    slotId;
    get slot() {
        return this.simulation.grid.slots[this.slotId];
    }
    /** @type {String} */
    name;
    /** @type {String} */
    adress;
    /** @type {false} */
    isHospitality = false;

    /**
     * @param {Simulation} simulation
     * @param {PLOT_SLOT} slot 
     */
    constructor(simulation, slot) {
        this.simulation = simulation;
        this.pos = slot.pos;
        this.squares = [slot.pos];
        this.slotId = slot.id;
        this.id = simulation.plots.push(this) - 1;
        this.adress = `${slot.streetName} ${slot.number}`;
        this.name = `${slot.streetName} ${slot.number}`;
    }
}
//@ts-ignore
class Home extends Plot {
    /**
     * @param {Simulation} simulation
     * @param {PLOT_SLOT} slot 
     */
    constructor(simulation, slot) {
        super(simulation, slot); 
        this.isHospitality = false;
        this.simulation.grid.claimSlot(slot.id, "M");
    }
}

class Hospitality extends Plot {
    /** @type {Number} */
    hospitalityId;
    /** @type {true} */ //@ts-ignore
    isHospitality = true;

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
        this.meeting.onAddParticipant();
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
        this.meeting.onRemoveParticipant();
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
    
    /**
     * @param {Simulation} simulation
     * @param {PLOT_SLOT} slot 
     */
    constructor(simulation, slot) {
        super(simulation, slot);
        this.isHospitality = true;
        this.hospitalityId = simulation.hospitalities.push(this) - 1;
        this.simulation.grid.claimSlot(slot.id, "H");
        let intrestCount = 0;
        switch(Utils.getRandomWithProbability({'any': 1, 'none': 1})) {
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
                    while(intrests.list[firstIntrest].categories.includes('artforms')) {
                        randomIntrest = Utils.getRandomWithProbability(possibleIntrests);
                    }
                    this.welcomeIntrestsTags.push(randomIntrest);
                }
            }
            for(let i = 1; i>intrestCount; i++) {
                loopFunc();
            }
            this.welcomeIntrestCategories = this.getIntrestCategories(this.welcomeIntrestsTags);
        }
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