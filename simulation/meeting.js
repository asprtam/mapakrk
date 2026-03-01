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

/**
 * @typedef {Object} MEETING_DATA
 * @property {Array<{id: Number, name: String}>} participants
 * @property {INTREST_TAG} topic
 */

class Meeting {
    /** @type {Simulation} */
    simulation;
    /** @type {Number} */
    id;
    /** @type {Array<Number>} */
    #currentParticipants = [];
    get currentParticipants() {
        return this.#currentParticipants;
    }
    /** @type {Array<Human>} */
    get currentParticipantsObjects() {
        /** @type {Array<Human>} */
        const humans = [];
        for(let id of this.currentParticipants) {
            if(this.simulation.humans[id]) {
                humans.push(this.simulation.humans[id]);
            }
        }
        return humans;
    }
    /** @type {Array<{id: Number, name: String}>}} */
    get currentParicipantsSimpleData() {
        /** @type {Array<{id: Number, name: String}>}} */
        const humans = [];
        for(let id of this.currentParticipants) {
            if(this.simulation.humans[id]) {
                humans.push({id: id, name: `${this.simulation.humans[id].info.name} ${this.simulation.humans[id].info.lastname}`});
            }
        }
        return humans;
    }
    set currentParticipants(val) {
        this.#currentParticipants = val;
    }
    /** @type {MEETING_DATA} */
    get meetingData () {
        /** @type {MEETING_DATA} */
        let data = {topic: `${this.topic}`, participants: this.currentParicipantsSimpleData };
        return data;
    }
    /** @returns {{maxSocial: Number, humanId: Number}} */
    getCurrentMaxSocial = () => {
        let maxSocial = 0;
        let humanId = 0;
        this.currentParticipants.forEach((id) => {
            let human = this.simulation.humans[id];
            if(human) {
                if(maxSocial < human.attributes.social) {
                    maxSocial = human.attributes.social + 0;
                    humanId = human.id + 0;
                }
            }
        });
        return { maxSocial: maxSocial, humanId: humanId };
    }
    /** @returns {{maxSocial: Number, humanId: Number}} */
    getRandomSocialWithProbability = () => {
        if(this.currentParticipants.length == 1) {
            return { maxSocial: this.simulation.humans[this.currentParticipants[0]].attributes.social + 0, humanId: this.currentParticipants[0] + 0 }
        } else if(this.currentParticipants.length == 0) {
            return { maxSocial: 0, humanId: 0 };
        }

        /** @type {{[id: String]: Number}} */
        let participantsObj = {};

        this.currentParticipants.forEach((id) => {
            let participantDataObj = { maxSocial: this.simulation.humans[id].attributes.social, humanId: id+0 };
            participantsObj[`${JSON.stringify(participantDataObj)}`] = this.simulation.humans[id].attributes.social + 0;
        });

        if(Object.keys(participantsObj).length <= 1) {
            if(this.currentParticipants.length == 1) {
                return {maxSocial: this.simulation.humans[this.currentParticipants[0]].attributes.social + 0, humanId: this.currentParticipants[0] + 0};
            } else if(this.currentParticipants.length == 0) {
                return {maxSocial: 0, humanId: 0};
            }
        } else { //@ts-ignore
            return JSON.parse(Utils.getRandomWithProbability(participantsObj));
        }
    }
    /** @type {INTREST_TAG} */
    topic;
    /**
     * @param {() => { maxSocial: Number, humanId: Number }} [getMaxSocial]
     * @returns {INTREST_TAG}
     */
    getNextTopic = (getMaxSocial = this.getRandomSocialWithProbability) => {
        let { maxSocial, humanId } = getMaxSocial();
        let probabilityObj = intrests.normalizeConnectedIntrests(intrests.getConnectedIntrestsFromTagArray(this.simulation.humans[humanId].intrests), 1);
        let random = Utils.getRandomWithProbability(probabilityObj); //@ts-ignore
        if(this.plot) { //@ts-ignore
            this.simulation.logWrite(`topic pick: ${random}`, probabilityObj, this.currentParicipantsSimpleData, { maxSocial: maxSocial, humanId: humanId }, this.plot.name);
        } else {
            this.simulation.logWrite(`topic pick: ${random}`, probabilityObj, this.currentParicipantsSimpleData, { maxSocial: maxSocial, humanId: humanId });
        }
        return random;
    }
    /** @param {Number} id */
    addParticipant = (id) => {
        this.onBeforeAddParticipant(id);
        if(this.simulation.humans[id]) {
            if(!this.currentParticipants.includes(id)) {
                this.currentParticipants.push(id);
            }
        }
        this.onAddParticipant(id);
    }

    /** @param {Number} id */
    onBeforeAddParticipant = (id) => {
        if(this.topic !== null && this.currentParticipants.length > 2) {
            let human = this.simulation.humans[id];
            if(human) {
                let { maxSocial, humanId } = this.getCurrentMaxSocial();
                if(human.attributes.social > maxSocial) {
                    switch(Utils.getRandomWithProbability({'change': human.attributes.social, 'noChange': maxSocial})) {
                        case "change": {
                            this.topic = this.getNextTopic(() => {return {maxSocial: human.attributes.social, humanId: id};});
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {Number} id
     */
    onAddParticipant = (id) => {
        if(this.currentParticipants.length >= 2) {
            if(this.topic == null) {
                this.topic = this.getNextTopic();
                this.currentParticipants.forEach((_id) => {
                    this.simulation.humans[_id].addIntrestAction(this.topic);
                });
            } else {
                this.simulation.humans[id].addIntrestAction(this.topic);
            }
        } else {
            this.topic = null;
        }
        this.currentParticipants.forEach((_id) => {
            this.simulation.humans[_id].currentMeeting = this.meetingData;
            // this.simulation.logWrite(this.simulation.humans[id].currentMeeting);
        });
    }

    /**
     * @param {Number} id
     */
    onRemoveParticipant = (id) => {
        if(this.currentParticipants.length < 2) {
            this.topic = null;
        }
        if(this.simulation.humans[id]) {
            this.simulation.humans[id].currentMeeting = null;
        }
        this.currentParticipants.forEach((_id) => {
            if(_id !== id) {
                this.simulation.humans[_id].currentMeeting = this.meetingData;
            }
        });
    }

    /** @param {Number} id */
    removeParticipant = (id) => {
        const remove = () => {
            let indexOf = this.currentParticipants.indexOf(id);
            this.currentParticipants = this.currentParticipants.slice(0, indexOf).concat(this.currentParticipants.slice(indexOf+1));
        }
        if(this.simulation.humans[id]) {
            this.simulation.humans[id].currentMeeting = null;
        }
        while(this.currentParticipants.includes(id)) {
            remove();
        }
        this.onRemoveParticipant(id);
    }

    /** 
     * @param {Number} tickId
     * @param {Number} tickIteration
     * @returns {Promise<Boolean>}
     */
    meetingTick = (tickId, tickIteration) => {
        return new Promise((res) => {
            if(this.currentParticipants.length > 1) {
                const probabilityObj = { 'friendChance': 1, 'topicInheritance': 1, 'nothing': 998 };
                const result = Utils.getRandomWithProbability(probabilityObj);
                switch(result) {
                    case "friendChance": {
                        if(this.topic == null || this.topic == undefined) {
                            this.topic = this.getNextTopic();
                        }
                        /** @type {Array<{id: Number, affinity: Number, social: Number, age: Number}>} */
                        let humansWithTopicAffinity = [];
                        this.currentParticipants.forEach((humanId) => {
                            if(this.simulation.humans[humanId]) {
                                let affinity = intrests.getIntrestConnectionScoreFromArray(this.simulation.humans[humanId].intrests, this.topic, true) * 5;
                                if(affinity != 0) {
                                    humansWithTopicAffinity.push({id: humanId, affinity: affinity, social: this.simulation.humans[humanId].attributes.social + 0, age: this.simulation.humans[humanId].info.age + 0});
                                }
                            }
                        });
                        if(humansWithTopicAffinity.length > 1) {
                            for(let i = 0; i<humansWithTopicAffinity.length; i++) {
                                for(let j = i+1; j<humansWithTopicAffinity.length; j++) {
                                    let befriendResult = Human.willBefriend(humansWithTopicAffinity[i], humansWithTopicAffinity[j]);
                                    this.simulation.logWrite('friendChance', 'result = ', befriendResult, this.meetingData, humansWithTopicAffinity[i], humansWithTopicAffinity[j]);
                                    switch(befriendResult) {
                                        case "befriend": {
                                            this.simulation.humans[humansWithTopicAffinity[i].id].friendChangeRelation(
                                                humansWithTopicAffinity[j].id, 
                                                Math.max(Math.floor((100 - Math.abs(humansWithTopicAffinity[i].social - humansWithTopicAffinity[j].social)) / 5), 1), 
                                                tickId, 
                                                tickIteration, 
                                                this.topic
                                            );
                                            break;
                                        }
                                        case "dislike": {
                                            this.simulation.humans[humansWithTopicAffinity[i].id].friendChangeRelation(
                                                humansWithTopicAffinity[j].id, 
                                                Math.max(Math.floor(Math.abs(humansWithTopicAffinity[i].social - humansWithTopicAffinity[j].social) / 5), 1) * -1, 
                                                tickId, 
                                                tickIteration, 
                                                this.topic
                                            );
                                            break;
                                        }
                                        default: {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        res(true);
                        break;
                    }
                    case 'topicInheritance': {
                        if(this.topic) {
                            this.topic = this.getNextTopic();
                        }
                        /** @type {Array<Number>} */
                        let participantsWithTopic = [];
                        /** @type {Array<Number>} */
                        let participantsWithNoTopic = [];

                        for(let humanId of this.currentParticipants) {
                            if(this.simulation.humans[humanId].intrests.includes(this.topic)) {
                                participantsWithTopic.push(humanId);
                            } else {
                                participantsWithNoTopic.push(humanId);
                            }
                        }

                        if(participantsWithTopic.length > 0 && participantsWithNoTopic.length > 0) {
                            for(let humanId of participantsWithNoTopic) {
                                let baseAffinity = intrests.getIntrestConnectionScoreFromArray(this.simulation.humans[humanId].intrests, this.topic);
                                if(this.simulation.humans[humanId].isInterestsFull) {
                                    baseAffinity = Math.floor(baseAffinity/2);
                                }
                                if(baseAffinity > 0) {
                                    baseAffinity = baseAffinity*5;
                                    let maxAffinity = 0;
                                    for(let _humanId of participantsWithTopic) {
                                        let socialDiff = 100 - Math.abs(this.simulation.humans[humanId].attributes.social - this.simulation.humans[_humanId].attributes.social);
                                        let socialExtraScore = this.simulation.humans[_humanId].attributes.social + 0;
                                        let extraFriendScore = 0;
                                        let friendData = this.simulation.humans[humanId].getFriendOfId(_humanId);
                                        if(friendData) {
                                            if(friendData.preference < 0) {
                                                extraFriendScore = friendData.preference - 50;
                                            } else {
                                                extraFriendScore = friendData.preference + 50;
                                            }
                                        }

                                        let finalAffinity = Math.round((socialDiff + socialExtraScore) / 2) + extraFriendScore;
                                        if(finalAffinity > maxAffinity) {
                                            maxAffinity = finalAffinity + 0;
                                        }
                                    }

                                    let probabilityObj = { 'inherited': baseAffinity + maxAffinity, 'not inherited': 400 - (baseAffinity + maxAffinity) };
                                    let inherited = Utils.getRandomWithProbability(probabilityObj);
                                    switch(inherited) {
                                        case "inherited": {
                                            /** @type {Array<{id: Number, name: String}>} */
                                            let participantsObjArr = [];

                                            for(let _humanId of this.currentParticipants) {
                                                if(_humanId != humanId) {
                                                    participantsObjArr.push({ id: _humanId + 0, name: `${this.simulation.humans[_humanId].info.name} ${this.simulation.humans[_humanId].info.lastname}` });
                                                }
                                            } //@ts-ignore
                                            if(this.plot) { //@ts-ignore
                                                this.simulation.humans[humanId].addIntrest(`${this.topic}`, participantsObjArr, tickId + 0, tickIteration + 0, this.plot);
                                            } else {
                                                this.simulation.humans[humanId].addIntrest(`${this.topic}`, participantsObjArr, tickId + 0, tickIteration + 0);
                                            }
                                            this.simulation.logWrite(`topic ${this.topic} ${inherited}`, probabilityObj, participantsObjArr);
                                            break;
                                        }
                                        case "not inherited":
                                        default: {
                                            this.simulation.logWrite(`topic ${this.topic} ${inherited}`, probabilityObj);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        res(true);
                        break;
                    }
                    case "nothing": {
                        res(true);
                        break;
                    }
                }
            } else {
                res(true);
            }
        });
    }
    /**
     * @param {Simulation} simulation
     */
    constructor(simulation) {
        this.simulation = simulation;
        this.id = this.simulation.meetings.push(this);
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
        this.onAddParticipant(id);
    }
    /** 
     * @override
     * @param {Number} id
     */
    removeParticipant = (id) => {
        this.plot.removeVisitor(id);
        this.onRemoveParticipant(id);
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
        this.onBeforeAddParticipant(id);
        if(!this.currentParticipants.includes(id)) {
            this.currentParticipants.push(id);
        }
        this.onAddParticipant(id);
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