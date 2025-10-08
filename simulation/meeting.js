import { Simulation } from "./simulation.js";
import { Path } from "./path.js";
import { Hospitality, Home, Plot } from "./entites.js";
import { Human } from "./human.js";
import { intrests, intrestCategories } from "../data/intrests.js";
import {Utils} from "./utils.js";
/** @typedef {import("./grid.js").PLOT_SLOT} PLOT_SLOT */
/** @typedef {import("../data/intrests.js").INTREST_CATEGORY_NAME} INTREST_CATEGORY_NAME */
/** @typedef {import("../data/intrests.js").INTREST_TAG} INTREST_TAG */
/**
 * @typedef {{x: Number, y:Number}} pos
 */

class Meeting {
    /** @type {Simulation} */
    simulation;
    /** @type {Array<Number>} */
    #currentParticipants = [];
    get currentParticipants() {
        return this.#currentParticipants;
    }
    set currentParticipants(val) {
        this.#currentParticipants = val;
    }
    /** @type {INTREST_TAG} */
    topic;
    /**
     * @returns {INTREST_TAG}
     */
    getNextTopic = () => { //@ts-ignore
        /** @type {{[key in INTREST_TAG]: Number}} */ //@ts-ignore
        let probabilityObj = {};
        this.currentParticipants.forEach((humanId) => {
            let _probObj = intrests.getConnectedIntrestsFromTagArray(this.simulation.humans[humanId].intrests);
            this.simulation.humans[humanId].intrests.forEach((tag) => {
                if(typeof _probObj[tag] == 'undefined') {
                    _probObj[tag] = (this.simulation.humans[humanId].attributes.social * 1.5);
                } else {
                    _probObj[tag] += (this.simulation.humans[humanId].attributes.social * 1.5);
                }
            });
            Object.keys(_probObj).forEach((key) => {
                if(typeof probabilityObj[key] == 'undefined') {
                    probabilityObj[key] = _probObj[key] * (this.simulation.humans[humanId].attributes.social / 10);
                } else {
                    probabilityObj[key] += _probObj[key] * (this.simulation.humans[humanId].attributes.social / 10);
                }
            });
        });
        Object.keys(probabilityObj).forEach((key) => {
            if(probabilityObj[key] < 0) {
                probabilityObj[key] = 1;
            } else {
                probabilityObj[key] = Math.ceil(probabilityObj[key]);
            }
        });
        let random = Utils.getRandomWithProbability(probabilityObj);
        this.simulation.logWrite(random, probabilityObj, this.currentParticipants);
        return random;
    }
    /** @param {Number} id */
    addParticipant = (id) => {
        if(!this.currentParticipants.includes(id)) {
            this.currentParticipants.push(id);
        }
    }
    /** @param {Number} id */
    removeParticipant = (id) => {
        const remove = () => {
            let indexOf = this.currentParticipants.indexOf(id);
            this.currentParticipants = this.currentParticipants.slice(0, indexOf).concat(this.currentParticipants.slice(indexOf+1));
        }
        while(this.currentParticipants.includes(id)) {
            remove();
        }
    }
    /**
     * @param {Simulation} simulation
     */
    constructor(simulation) {
        this.simulation = simulation;
    }
}

class PlotBoundMeeting extends Meeting {
    /** @type {Number} */
    plotId;
    /** @type {Home|Hospitality|Plot} */
    plot;
    /** @type {pos} */
    pos;
    /** @override */
    get currentParticipants() {
        return this.plot.currentVisitors;
    }
    /** @override */
    set currentParticipants(val) {
        this.plot.currentVisitors = val;
    }
    get humansWalkingTo() {
        return this.plot.humansWalkingTo;
    }
    set humansWalkingTo(val) {
        this.plot.humansWalkingTo = val;
    }
    /**
     * @param {Number} id
     */
    addWalker = (id) => {
        this.plot.addWalker(id);
    }
    /**
     * @param {Number} id
     */
    removeWalker = (id) => {
        this.plot.removeWalker(id);
    }
    /** 
     * @override
     * @param {Number} id
     */
    addParticipant = (id) => {
        this.plot.addVisitor(id);
        this.onAddParticipant();
    }
    /** 
     * @override
     * @param {Number} id
     */
    removeParticipant = (id) => {
        this.plot.removeVisitor(id);
        this.onRemoveParticipant();
    }
    onRemoveParticipant = () => {
        if(this.currentParticipants.length < 2) {
            this.topic = null;
        }
    }
    onAddParticipant = () => {
        if(this.currentParticipants.length >= 2) {
            if(this.topic == null) {
                this.topic = this.getNextTopic();
            }
        } else {
            this.topic = null;
        }
    }
    /**
     * @param {Simulation} simulation
     * @param {Home|Hospitality|Plot} plot
     */
    constructor(simulation, plot) {
        super(simulation);
        this.plot = plot;
        this.plotId = plot.id;
        this.pos = this.plot.pos;
    }
}

class FieldMeeting extends Meeting {
    /** @type {pos} */
    pos;
    /** @type {Boolean} */
    started = false;
    /**
     * @param {Number} id
     */
    addWalker = (id) => {
        if(!this.humansWalkingTo.includes(id)) {
            this.humansWalkingTo.push(id);
        }
    }
    /**
     * @param {Number} id
     */
    removeWalker = (id) => {
        const remove = () => {
            let indexOf = this.humansWalkingTo.indexOf(id);
            this.humansWalkingTo = this.humansWalkingTo.slice(0, indexOf).concat(this.humansWalkingTo.slice(indexOf+1));
        }
        while(this.humansWalkingTo.includes(id)) {
            remove();
        }
    }
    /** 
     * @override
     * @param {Number} id
     */
    addParticipant = (id) => {
        this.removeWalker(id);
        if(!this.currentParticipants.includes(id)) {
            this.currentParticipants.push(id);
        }
        if(!this.started) {
            if(this.currentParticipants.length >= 2) {
                this.topic = this.getNextTopic();
                this.started = true;
            }
        }
    }
    /** @type {Array<Number>} */
    humansWalkingTo = [];
    /**
     * @param {Simulation} simulation
     * @param {Array<Number>} walkers
     * @param {pos} pos
     */
    constructor(simulation, walkers, pos) {
        super(simulation);
        this.humansWalkingTo = walkers;
        this.pos = pos;
    }
}

export { Meeting, PlotBoundMeeting, FieldMeeting };