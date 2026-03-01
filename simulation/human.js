import { Simulation } from "./simulation.js";
import { Hospitality, Home, Plot } from "./entites.js";
import { SimulationGlobals } from "./simulationGlobals.js";
import { Utils } from "./utils.js";
import { LASTNAMES, MALE_NAMES, FEMALE_NAMES, OTHER_NAMES } from "./names.js";
import { Path } from "./path.js";
import { intrests, intrestCategories } from "../data/intrests.js";
import { Meeting, FieldMeeting, PlotBoundMeeting } from "./meeting.js";
import { SpecialTagsNoPolitical, SpecialTagsNoKiller, SpecialTagsNoPoliticalOrKiller } from "./humanSpecialTags.js";
import { TypeGoblin } from "../frontend/src/goblinTypes.js";


/**
 * @typedef {{x: Number, y:Number}} pos
 */
/** @typedef {import("./grid.js").PLOT_SLOT} PLOT_SLOT */
/** @typedef {import("./meeting.js").MEETING_DATA} MEETING_DATA */
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

/** @typedef {'in home'|'working'|'walking'|'meeting'|'in hospitality'|'dead'} HUMAN_ACTION */
/** @typedef {{'in home': '', 'working': '', 'walking': '', 'meeting': '', 'in hospitality': '', 'dead': ''}} HUMAN_ACTION_NAMES */

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

/**
 * @typedef {Object} HUMAN_EVENT_BASE
 * @property {Number} id
 * @property {Number} [hospitalityId]
 * @property {Number} tickNumber
 * @property {Number} tickIteration
 */

/**
 * @typedef {Object} DUMPED_HUMAN_EVENT_BASE
 * @property {Number} [hospitalityId]
 * @property {Number} tickNumber
 * @property {Number} tickIteration
 */

/** @typedef {{id: Number, name: String}} HUMAN_EVENT_PERSON_DATA */

/** 
 * @template {{[id:String]: *}} THEY_THEM
 * @typedef {{LOOK: {[key in keyof THEY_THEM]: THEY_THEM[key]}}} STEAL_HIS_LOOK
 */

/**
 * @typedef {STEAL_HIS_LOOK<HUMAN_EVENT_BASE>['LOOK'] & {type: 'newIntrest', intrest: INTREST_TAG, participants: Array<HUMAN_EVENT_PERSON_DATA>}} HUMAN_EVENT_INTREST
 */

/**
 * @typedef {STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_BASE>['LOOK'] & {type: 'newIntrest', intrest: INTREST_TAG, participants: Array<Number>}} DUMPED_HUMAN_EVENT_INTREST
 */

/**
 * @typedef {STEAL_HIS_LOOK<HUMAN_EVENT_BASE>['LOOK'] & {type: 'loseIntrest', intrest: INTREST_TAG}} HUMAN_LOSE_INTREST_EVENT
 */

/**
 * @typedef {STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_BASE>['LOOK'] & {type: 'loseIntrest', intrest: INTREST_TAG}} DUMPED_HUMAN_LOSE_INTREST_EVENT
 */

/** 
 * @typedef {STEAL_HIS_LOOK<HUMAN_EVENT_BASE>['LOOK'] & {type: 'birthDay'}} HUMAN_EVENT_BIRTHDAY
 */

/** 
 * @typedef {STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_BASE>['LOOK'] & {type: 'birthDay'}} DUMPED_HUMAN_EVENT_BIRTHDAY
 */

/** 
 * @typedef {STEAL_HIS_LOOK<HUMAN_EVENT_BASE>['LOOK'] & {type: 'closerToMadness'}} HUMAN_EVENT_CLOSER_TO_MADNESS
 */

/** 
 * @typedef {STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_BASE>['LOOK'] & {type: 'closerToMadness'}} DUMPED_HUMAN_EVENT_CLOSER_TO_MADNESS
 */

/** 
 * @typedef {Object} HUMAN_EVENT_FRIEND_REST
 * @property {'befriend'} type
 * @property {'becameEnemies'|'becameFriends'} subType
 * @property {HUMAN_EVENT_PERSON_DATA} human
 * @property {INTREST_TAG} reason
 * @property {Number} initalScore
 */

/** 
 * @typedef {Object} DUMPED_HUMAN_EVENT_FRIEND_REST
 * @property {'befriend'} type
 * @property {'becameEnemies'|'becameFriends'} subType
 * @property {Number} human
 * @property {INTREST_TAG} reason
 * @property {Number} initalScore
 */

/**
 * @typedef {STEAL_HIS_LOOK<HUMAN_EVENT_BASE>['LOOK'] & STEAL_HIS_LOOK<HUMAN_EVENT_FRIEND_REST>['LOOK']} HUMAN_EVENT_FRIEND
 */


/**
 * @typedef {STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_BASE>['LOOK'] & STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_FRIEND_REST>['LOOK']} DUMPED_HUMAN_EVENT_FRIEND
 */


/**
 * @typedef {Object} HUMAN_EVENT_FRIEND_CHANGE_RELATION_REST
 * @property {'relationChange'} type
 * @property {HUMAN_EVENT_PERSON_DATA} human
 * @property {Number} score
 * @property {INTREST_TAG} reason
 */

/**
 * @typedef {Object} DUMPED_HUMAN_EVENT_FRIEND_CHANGE_RELATION_REST
 * @property {'relationChange'} type
 * @property {Number} human
 * @property {Number} score
 * @property {INTREST_TAG} reason
 */

/**
 * @typedef {STEAL_HIS_LOOK<HUMAN_EVENT_BASE>['LOOK'] & STEAL_HIS_LOOK<HUMAN_EVENT_FRIEND_CHANGE_RELATION_REST>['LOOK']} HUMAN_EVENT_FRIEND_CHANGE_RELATION
 */

/**
 * @typedef {STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_BASE>['LOOK'] & STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_FRIEND_CHANGE_RELATION_REST>['LOOK']} DUMPED_HUMAN_EVENT_FRIEND_CHANGE_RELATION
 */

/**
 * @typedef {STEAL_HIS_LOOK<HUMAN_EVENT_INTREST|HUMAN_EVENT_FRIEND|HUMAN_EVENT_FRIEND_CHANGE_RELATION|HUMAN_EVENT_BIRTHDAY|HUMAN_LOSE_INTREST_EVENT|HUMAN_EVENT_CLOSER_TO_MADNESS>['LOOK']} HUMAN_EVENT
 */

/**
 * @template {'befriend'|'newIntrest'|'birthDay'|'relationChange'|'loseIntrest'|'closerToMadness'} TYPE
 * @typedef {{'befriend': HUMAN_EVENT_FRIEND, 'newIntrest': HUMAN_EVENT_INTREST, 'birthDay': HUMAN_EVENT_BIRTHDAY, 'relationChange': HUMAN_EVENT_FRIEND_CHANGE_RELATION, 'loseIntrest': HUMAN_LOSE_INTREST_EVENT, closerToMadness: HUMAN_EVENT_CLOSER_TO_MADNESS}[TYPE]} HUMAN_EVENT_TEMPLATED
 */

/**
 * @typedef {STEAL_HIS_LOOK<DUMPED_HUMAN_EVENT_INTREST|DUMPED_HUMAN_EVENT_FRIEND|DUMPED_HUMAN_EVENT_FRIEND_CHANGE_RELATION|DUMPED_HUMAN_EVENT_BIRTHDAY|DUMPED_HUMAN_LOSE_INTREST_EVENT|DUMPED_HUMAN_EVENT_CLOSER_TO_MADNESS>['LOOK']} DUMPED_HUMAN_EVENT
 */

/** @typedef {import("./humanSpecialTags.js").HUMAN_SPECIAL_TAG} HUMAN_SPECIAL_TAG */

/**
 * @typedef {HUMAN_EVENT_PERSON_DATA|'natural'|'accident'|'drugOverdose'} HUMAN_DEATH_INFO_REASON
 */

/**
 * @typedef {Object} HUMAN_DEATH_INFO_REST
 * @property {Number} tickIteration
 * @property {Number} tickNumber
 * @property {HUMAN_DEATH_INFO_REASON} reason
 */

/**
 * @typedef {Object} HUMAN_DEATH_INFO
 * @property {Number} tickIteration
 * @property {Number} tickNumber
 * @property {HUMAN_DEATH_INFO_REASON} reason
 */

/**
 * @typedef {Object} HUMAN_SAVED_DATA
 * @property {Number} [id]
 * @property {HUMAN_INFO_SOFT_REQ} [info]
 * @property {Number} [birthDay]
 * @property {HUMAN_ATTRIBUTES_SOFT_REQ} [attributes]
 * @property {HUMAN_STATUSES} [statuses]
 * @property {Array<DUMPED_HUMAN_EVENT>} [events]
 * @property {{[key in INTREST_TAG]?: Number}} [intrests]
 * @property {pos} [home]
 * @property {Array<HUMAN_FRIEND_DATA>} [friends]
 * @property {{type: HUMAN_ACTION, pos: pos, target: Number|null, targetType: HUMAN_TARGET_TYPE}} [currentAction]
 * @property {Array<HUMAN_SPECIAL_TAG>} [specialTags]
 * @property {HUMAN_DEATH_INFO|null} [deathDate]
 */

/**
 * @typedef {Object} HUMAN_WORK
 * @property {Number} progress
 * @property {Array<Number>} authors
 * @property {Array<'painting'|'drawing'|'music'|'sculpture'|'graffiti'|'photography'|'film'|'digitalArt'>} medium
 * @property {Array<INTREST_TAG>} topics
 */

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
        fatigue: true
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
    /** @type {{[key in INTREST_TAG]?: Number}} */
    #interestsActionCounts = {};
    /**
     * @param {INTREST_TAG} tag 
     * @param {Boolean} [allowCreation]
     * @param {Number} [count] 
     */
    addIntrestAction = (tag, allowCreation = false, count = 1) => {
        if(Object.keys(this.#interestsActionCounts).includes(tag)) {
            this.#interestsActionCounts[tag] += count;
        } else if(allowCreation) {
            this.#interestsActionCounts[tag] = count;
        }
    }
    /** @type {Array<INTREST_TAG>} */
    get intrests() { //@ts-ignore
        return Object.keys(this.#interestsActionCounts);
    }
    /** @type {MEETING_DATA|null} */
    currentMeeting = null;
    /** @type {Array<HUMAN_EVENT>} */
    events = [];
    /** @type {Number} */
    birthDay;
    /** @type {Array<HUMAN_SPECIAL_TAG>} */
    specialTags = [];
    /** @type {HUMAN_DEATH_INFO|null} */
    deathDate = null;
    /** @type {Number} */
    intrestsLimit = 10;
    /** @type {Number} */
    madnessScore = 0;
    /** @type {Boolean} */
    get isInterestsFull () {
        if(this.intrests.length < this.intrestsLimit) {
            return false;
        }
        return true;
    }
    /** @type {{eventsToParse?: Array<DUMPED_HUMAN_EVENT>}} */
    #temp = {};
    /** @type {Array<HUMAN_WORK>} */
    works;
    /** @type {HUMAN_WORK} */
    currentWork;

    /** @type {Boolean} */
    get isAlive() {
        if(this.deathDate) {
            return false;
        }
        return true;
    }

    /** 
     * @param {Array<HUMAN_EVENT>} events
     * @returns {Array<DUMPED_HUMAN_EVENT>}
     */
    dumpEvents = (events) => {
        /**
         * @param {Array<HUMAN_EVENT_PERSON_DATA>} participants
         * @returns {Array<Number>}
         */
        const parseParticipants = (participants) => {
            return participants.map((el) => {
                return el.id;
            });
        }

        return events.map((el) => {
            let copy = JSON.parse(JSON.stringify(el));
            delete copy.id;
            switch(el.type) {
                case "birthDay": {
                    return el;
                }
                case "newIntrest": {
                    copy.participants = parseParticipants(el.participants);
                    return copy;
                }
                case "relationChange":
                case "befriend": {
                    if(el.human) {
                        copy.human = el.human.id + 0;   
                    }
                    return copy;
                }
            }
            return copy;
        });
    };

    /**
     * @param {Array<DUMPED_HUMAN_EVENT>} dumpedEvents
     * @returns {Array<HUMAN_EVENT>}
     */
    dedumpEvent = (dumpedEvents) => {
        /**
         * @param {Array<Number>} participants
         * @returns {Array<HUMAN_EVENT_PERSON_DATA>}
         */
        const parseParticipants = (participants) => {
            /** @type {Array<HUMAN_EVENT_PERSON_DATA>} */
            let newParticipants = [];
            participants.forEach((el) => {
                if(this.simulation.humans[el]) {
                    newParticipants.push({ id: el + 0, name: `${this.simulation.humans[el].info.name} ${this.simulation.humans[el].info.lastname}` });
                } else {
                    this.simulation.logWrite(`warn missing human ${el}`);
                }
            });
            return newParticipants;
        }

        let isAutistic = false;
        if(this.specialTags.includes('autism')) {
            isAutistic = true;
        }

        return dumpedEvents.map((el, id) => {
            /** @type {HUMAN_EVENT_TEMPLATED<*>} */
            let copy = JSON.parse(JSON.stringify(el));
            copy.id = id+0;
            switch(el.type) {
                case "newIntrest": {
                    copy.participants = parseParticipants(el.participants);
                    return copy;
                }
                case "relationChange":
                case "befriend": {
                    copy.human = parseParticipants([copy.human])[0];
                    return copy;
                }
                case "birthDay": {
                    return copy;
                }
                case "closerToMadness": {
                    if(isAutistic) {
                        this.madnessScore += 3;
                    } else {
                        this.madnessScore += 2;
                    }
                    return copy;
                }
                case "loseIntrest": {
                    return copy;
                }
            }
            return copy;
        });
    }

    /**
     * @returns {HUMAN_SAVED_DATA}
     */
    getDataDump = () => {
        return JSON.parse(JSON.stringify({
            id: this.id + 0,
            info: this.info,
            birthDay: this.birthDay,
            attributes: this.attributes,
            statuses: this.status,
            events: this.dumpEvents(this.events),
            intrests: this.#interestsActionCounts,
            home: this.simulation.plots[this.homeId].pos,
            friends: this.friends,
            currentAction: {
                type: this.action,
                pos: this.pos,
                target: this.target,
                targetType: this.targetType
            },
            specialTags: this.specialTags,
            deathDate: this.deathDate
        }));
    }
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

    /**
     * @param {Number} id
     * @param {Number} change
     * @param {Number} tickId
     * @param {Number} tickIteration
     * @param {INTREST_TAG} reason
     */
    friendChangeRelation = (id, change, tickId, tickIteration, reason) => {
        if(this.isFriendOf(id)) {
            let friendDataInSelf = this.getFriendOfId(id);
            let friendDataExternal = this.simulation.humans[id].getFriendOfId(this.id);

            if(friendDataInSelf && friendDataExternal) {
                    let eventIdSelf = this.events.length;
                    let eventIdExternal = this.simulation.humans[id].events.length;
                    /** @type {null|'becameFriends'|'becameEnemies'} */
                    let typeOfChange = null;
                    if((friendDataInSelf.preference >= 0 && (friendDataInSelf.preference + change) < 0) || (friendDataExternal.preference >= 0 &&(friendDataExternal.preference + change) < 0)) {
                        typeOfChange = 'becameFriends';
                        friendDataInSelf.preference = 10;
                        friendDataExternal.preference = 10;
                    } else if ((friendDataInSelf.preference < 0 && (friendDataInSelf.preference + change) >= 0) || (friendDataExternal.preference < 0 &&(friendDataExternal.preference + change) >= 0)) {
                        typeOfChange = 'becameEnemies';
                        friendDataInSelf.preference = -10;
                        friendDataExternal.preference = -10;
                    } else {
                        friendDataInSelf.preference = friendDataInSelf.preference + change;
                        if(friendDataInSelf.preference > 100) {
                            friendDataInSelf.preference = 100;
                        } else if(friendDataInSelf.preference <= -100) {
                            friendDataInSelf.preference = -100;
                        }
                        friendDataExternal.preference = friendDataExternal.preference + change;
                        if(friendDataExternal.preference > 100) {
                            friendDataExternal.preference = 100;
                        } else if(friendDataExternal.preference <= -100) {
                            friendDataExternal.preference = -100;
                        }
                        this.addIntrestAction(reason);
                        this.events.push({
                            id: eventIdSelf,
                            type: "relationChange",
                            human: { id: id, name: `${this.simulation.humans[id].info.name} ${this.simulation.humans[id].info.lastname}` },
                            score: change,
                            tickNumber: tickId + 0,
                            tickIteration: tickIteration + 0,
                            reason: reason
                        });
                        this.simulation.humans[id].addIntrestAction(reason);
                        this.simulation.humans[id].events.push({
                            id: eventIdExternal,
                            human: { id: this.id, name: `${this.info.name} ${this.info.lastname}` },
                            type: 'relationChange',
                            score: change,
                            tickIteration: tickIteration + 0,
                            tickNumber: tickId + 0,
                            reason: reason
                        });
                    }
                    if(typeOfChange) {
                        this.addIntrestAction(reason);
                        this.events.push({
                            id: eventIdSelf,
                            type: "befriend",
                            subType: typeOfChange,
                            human: { id: id, name: `${this.simulation.humans[id].info.name} ${this.simulation.humans[id].info.lastname}` },
                            initalScore: change,
                            tickNumber: tickId + 0,
                            tickIteration: tickIteration + 0,
                            reason: reason
                        });
                        this.simulation.humans[id].addIntrestAction(reason);
                        this.simulation.humans[id].events.push({
                            id: eventIdExternal,
                            human: { id: this.id, name: `${this.info.name} ${this.info.lastname}` },
                            type: 'befriend',
                            subType: typeOfChange,
                            initalScore: change,
                            tickIteration: tickIteration + 0,
                            tickNumber: tickId + 0,
                            reason: reason
                        });
                    }
            }
        } else {
            /** @type {'becameFriends'|'becameEnemies'} */
            let typeOfChange = 'becameFriends';
            if(change < 0) {
                typeOfChange = 'becameEnemies';
                change = -10;
            } else {
                change = 10;
            }
            this.friends.push({id: id, preference: change});
            this.simulation.humans[id].friends.push({id: this.id, preference: change});
            let eventIdSelf = this.events.length;
            let eventIdExternal = this.simulation.humans[id].events.length;
            this.addIntrestAction(reason);
            this.events.push({
                id: eventIdSelf,
                human: { id: id, name: `${this.simulation.humans[id].info.name} ${this.simulation.humans[id].info.lastname}` },
                type: 'befriend',
                subType: typeOfChange,
                tickIteration: tickIteration + 0,
                tickNumber: tickId + 0,
                reason: reason,
                initalScore: change,
            });
            this.simulation.humans[id].addIntrestAction(reason);
            this.simulation.humans[id].events.push({
                id: eventIdExternal,
                human: { id: this.id, name: `${this.info.name} ${this.info.lastname}` },
                type: 'befriend',
                subType: typeOfChange,
                tickIteration: tickIteration + 0,
                tickNumber: tickId + 0,
                reason: reason,
                initalScore: change,
            });
        }
    }

    /**
     * @param {Number} id
     * @returns {null|HUMAN_FRIEND_DATA}
     */
    getFriendOfId = (id) => {
        for(let friendData of this.friends) {
            if(friendData.id == id) {
                let _friendDataPointerObj = {};
                Object.defineProperty(_friendDataPointerObj, 'id', {
                    set: () => {},
                    get: () => {
                        return friendData.id;
                    },
                    enumerable: true
                });
                Object.defineProperty(_friendDataPointerObj, 'preference', {
                    set: (newVal) => {
                        friendData.preference = newVal;
                    },
                    get: () => {
                        return friendData.preference;
                    },
                    enumerable: true
                }); //@ts-ignore
                return _friendDataPointerObj;
                break;
            }
        }
        return null;
    }

    /**
     * @param {{id: Number, affinity: Number, social: Number, age: Number}} human0Data
     * @param {{id: Number, affinity: Number, social: Number, age: Number}} human1Data
     * @returns {'befriend'|'dislike'|null}
     */
    static willBefriend = (human0Data, human1Data) => {
        let totalMax = 600;
        let socialDiff = Math.abs(human0Data.social - human1Data.social);
        let ageDiff = Math.abs(human0Data.age - human1Data.age) * 5;
        let probabilityObj = { 
            'befriend': Math.max(0, human0Data.affinity) + Math.max(human1Data.affinity, 0) + (100 - socialDiff),
            'dislike': Math.abs(((totalMax*0.25) + ageDiff + (socialDiff * 5)) + (Math.abs(Math.min(0, human0Data.affinity) + Math.abs(Math.min(0, human1Data.affinity))))),
            'dont': ((totalMax*0.75) + ageDiff + (100 - socialDiff)) - (Math.max(0, human0Data.affinity) + Math.max(human1Data.affinity, 0) + Math.max(human1Data.social, human0Data.social, 0))
        };
        const result = Utils.getRandomWithProbability(probabilityObj);
        switch(result) {
            case 'dont': {
                return null;
                break;
            }
            default: {
                return result;
                break;
            }
        }
    }

    /** @type {HUMAN_FRIENDS_LIST} */
    friends = [];

    /** @type {Number} */
    get walkTickRange() {
        return Math.floor(this.attributes.physical / Math.max(1, (9 * (1/this.simulation.currentSpeed)))) + Math.floor(10 * this.simulation.currentSpeed);
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
                if(!exclude.includes(hospitality.id) && hospitality.isOpen) {
                    returnHospitalities[`${hospitality.id}`] = this.getHospitalityPreferenceScore(hospitality.id);
                }
            });
        } else {
            this.simulation.hospitalities.forEach((hospitality) => {
                if(!exclude.includes(hospitality.id) && hospitality.isOpen) {
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

        if(hospitality.isHospitality) {
            preferenceScore += Math.round((hospitality.popularityScore) * ((this.attributes.social-30)/30))

            if(socialScore) {
                let socialScore = Math.round(hospitality.currentVisitors.length * ((this.attributes.social-30)/30)*100);
                socialScore+= Math.round(hospitality.humansWalkingTo.length * ((this.attributes.social-30)/30)*50);
                preferenceScore+=socialScore;
            }

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
     * @param {{tickId: Number, tickIteration: Number}|null} [from]
     * @param {{tickId: Number, tickIteration: Number}|null} [to]
     * @returns {Array<HUMAN_EVENT>}
     */
    getEventsInTimeRange = (from = null, to = null) => {
        const getStartId = () => {
            const isFirst = () => {
                return from == { tickId: 0, tickIteration: 0 };
            }
            switch(true) {
                case from == null: {
                    return 0;
                    break;
                }
                case isFirst(): {
                    return 0;
                    break;
                }
                default: {
                    for(let i = 0; i<this.events.length; i++) {
                        if(this.events[i].tickIteration >= from.tickIteration) {
                            if(this.events[i].tickNumber >= from.tickId) {
                                return i;
                            }
                        }
                    }
                    return this.events.length;
                    break;
                }
            }
        }

        let startId = getStartId();
        const getEndId = () => {
            switch(true) {
                case to == null: {
                    return this.events.length;
                    break;
                }
                case startId == this.events.length: {
                    return this.events.length;
                    break;
                }
                default: {
                    for(let i = this.events.length - 1; i>=0; i--) {
                        if(this.events[i].tickIteration <= to.tickIteration) {
                            if(this.events[i].tickNumber <= to.tickId) {
                                return i+1;
                                break;
                            }
                        }
                    }
                    return 0;
                    break;
                }
            }
        }
        let endId = getEndId();

        return this.events.slice(Math.min(startId, endId), Math.max(startId, endId));
    }

    /**
     * @param {Number|null} [from]
     * @param {Number|null} [to]
     * @returns {Array<HUMAN_EVENT>}
     */
    getEventsInRange = (from = null, to = null) => {
        const getStartId = () => {
            switch(true) {
                case from == null: {
                    return 0;
                    break;
                }
                case (from <= this.events.length && from >= 0): {
                    return from;
                    break;
                }
                default: {
                    return 0;
                    break;
                }
            }
        }
        let startId = getStartId();
        const getEndId = () => {
            switch(true) {
                case to == null: {
                    return this.events.length;
                    break;
                }
                case (to <= this.events.length && to >= 0): {
                    return to;
                    break;
                }
                default: {
                    return this.events.length;
                    break;
                }
            }
        }
        let endId = getEndId();
        return this.events.slice(Math.min(startId, endId), Math.max(startId, endId));
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
     * @param {true} [allowNull=true]
     * @param {Number} [rangeMult]
     * @returns {Hospitality|null}
     */
    /**
     * @param {Array<Number>} [exclude=[]]
     * @param {Boolean} [allowNull=false]
     * @param {Number} [rangeMult]
     * @returns {Hospitality}
     */
    getPreferredHospitality = (exclude = [], allowNull = false, rangeMult = 5) => {
        /** @type {Number|Null} */
        let preferedHospitality = null;
        if(this.friends.length > 0) {
            /** @type {{[id:String]: Number}} obiekt - klucz = id, wartość = szansa */
            let hospitalitiesWithFriends = {};
            if(this.specialTags.includes('confrontational')) {
                this.friends.forEach((friendData) => {
                let friend = this.simulation.humans[friendData.id];
                if(friend.targetType == 'hospitality' && !exclude.includes(friend.target) && this.simulation.plots[friend.target].isOpen) {
                    if(Object.keys(hospitalitiesWithFriends).includes(`${friend.target}`)) {
                        hospitalitiesWithFriends[`${friend.target}`] += Math.abs(friendData.preference);
                    } else {
                        hospitalitiesWithFriends[`${friend.target}`] = Math.abs(friendData.preference) + this.getHospitalityPreferenceScore(friend.target);
                    }
                }
            });
            } else {
                this.friends.forEach((friendData) => {
                let friend = this.simulation.humans[friendData.id];
                if(friend.targetType == 'hospitality' && !exclude.includes(friend.target) && this.simulation.plots[friend.target].isOpen) {
                    if(Object.keys(hospitalitiesWithFriends).includes(`${friend.target}`)) {
                        hospitalitiesWithFriends[`${friend.target}`] += friendData.preference;
                    } else {
                        hospitalitiesWithFriends[`${friend.target}`] = friendData.preference + this.getHospitalityPreferenceScore(friend.target);
                    }
                }
            });
            }
            switch (Object.keys(hospitalitiesWithFriends).length) {
                case 0: {
                    break;
                }
                case 1: {
                    if(hospitalitiesWithFriends[Object.keys(hospitalitiesWithFriends)[0]]) {
                        preferedHospitality = Number(Object.keys(hospitalitiesWithFriends)[0]);
                    }
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

    beginNewWork = () => {

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

    /**
     * @param {Human} human
     * @param {Array<Number>} [exclude]
     * @param {Number} [rangeMult]
     * @returns {Promise<Boolean>}
     */
    static goToRandomHospitality = (human, exclude = [], rangeMult = 5) => {
        return new Promise((res) => {
            let targetHospitality = human.getPreferredHospitality(exclude, true, rangeMult);
            if(targetHospitality) {
                switch(human.action) {
                    case "in hospitality":
                    case "in home":
                    case "working": {
                        if(human.simulation.plots[human.target]) {
                            human.simulation.plots[human.target].removeVisitor(human.id);
                        }
                        break;
                    }
                    case "walking": {
                        if(human.simulation.plots[human.target]) {
                            human.simulation.plots[human.target].removeWalker(human.id);
                        }
                        break;
                    }
                    case "meeting": {
                        break;
                    }
                }
                human.statusClearedFlags.boredom = false;
                human.statusClearedFlags.fatigue = false;
                human.targetType = 'hospitality';
                human.target = targetHospitality.id;
                human.walkingTo = targetHospitality.pos;
                targetHospitality.addWalker(human.id);
                human.crossedDistance = 0;
                human.action = 'walking';
                human.currentPlotId = null;
                human.onWalkEnd = () => {
                    human.statusClearedFlags.boredom = false;
                    human.statusClearedFlags.fatigue = false;
                    human.action = 'in hospitality';
                    human.simulation.plots[human.target + 0].addVisitor(human.id);
                    human.pos = JSON.parse(JSON.stringify(human.simulation.plots[human.target + 0].pos));
                    human.renderedPos = JSON.parse(JSON.stringify(human.simulation.plots[human.target + 0].pos));
                    human.currentPlotId = human.target + 0;
                    human.crossedDistance = 0;
                    human.pathToWalkOn = null;
                };
                human.getPath(human.pos, human.walkingTo).then((path) => {
                    human.pathToWalkOn = path;
                    res(true);
                });
            } else {
                res(false);
            }
        });
    }

    /**
     * @param {Human} human
     * @returns {Promise<true>}
     */
    static goHome = (human) => {
        return new Promise((res) => {
            const walkingFunc = () => {
                human.home.addWalker(human.id);
                human.targetType = 'home';
                human.target = human.homeId + 0;
                human.statusClearedFlags.boredom = false;
                human.statusClearedFlags.fatigue = false;
                human.walkingTo = human.home.pos;
                human.crossedDistance = 0;
                human.action = 'walking';
                human.currentPlotId = null;
                human.onWalkEnd = () => {
                    human.statusClearedFlags.boredom = false;
                    human.statusClearedFlags.fatigue = false;
                    human.action = 'in home';
                    human.simulation.plots[human.homeId].addVisitor(human.id);
                    human.pos = JSON.parse(JSON.stringify(human.simulation.plots[human.target + 0].pos));
                    human.renderedPos = JSON.parse(JSON.stringify(human.simulation.plots[human.target + 0].pos));
                    human.currentPlotId = human.homeId + 0;
                    human.crossedDistance = 0;
                    human.pathToWalkOn = null;
                };
                human.getPath(human.pos, human.walkingTo).then((path) => {
                    human.pathToWalkOn = path;
                    res(true);
                });
            }

            switch (human.action) {
                case "in home":
                case "working": {
                    res(true);
                    break;
                }
                case "walking": {
                    if(human.targetType == 'home') {
                        res(true);
                    } else {
                        if(human.simulation.plots[human.target]) {
                            human.simulation.plots[human.target].removeWalker(human.id);
                        }
                        walkingFunc();
                    }
                    break;
                }
                case "meeting": {
                    walkingFunc();
                    break;
                }
                case "in hospitality": {
                    if(human.simulation.plots[human.target]) {
                        human.simulation.plots[human.target].removeVisitor(human.id);
                    }
                    walkingFunc();
                    break;
                }
            }
        });
    }

    /** @returns {Promise<Boolean>} */
    decideNext = () => {
        return new Promise(async (res) => {
            switch(this.action) {
                case "in home": {
                    if(this.status.fatigue <= 250) {
                        let rangeMult = 5;
                        /** @type {'stay home'|'leave home'} */
                        let nextAction = 'stay home';
                        let nextActionProbabilityObject = {
                            'stay home': 1700 - this.status.boredom,
                            'leave home': Math.max(0, this.status.boredom - 300)
                        }
                        if((this.specialTags.includes('latePartyGoer') || this.specialTags.includes('nightOwl')) && ['night', 'evening'].includes(this.simulation.currentDayTime)) {
                            if(this.specialTags.includes('latePartyGoer') && this.specialTags.includes('nightOwl')) {
                                nextAction = Utils.getRandomWithProbability(nextActionProbabilityObject);
                                rangeMult = 10;
                            } else if(this.specialTags.includes('latePartyGoer')) {
                                nextAction = 'leave home';
                                rangeMult = 10;
                            }
                        } else {
                            nextAction = Utils.getRandomWithProbability(nextActionProbabilityObject);
                        }
                        if(nextAction == 'stay home') {
                            res(true)
                        } else {
                            Human.goToRandomHospitality(this, [], rangeMult).then(() => {
                                res(true);
                            });
                        }
                    } else {
                        res(true);
                    }
                    break;
                }
                case "in hospitality": {
                    if(this.statusClearedFlags.boredom || this.statusClearedFlags.fatigue || !this.simulation.plots[this.target].isOpen) {
                        let nextAction = 'change';
                        if(this.simulation.plots[this.target].isOpen) {
                            nextAction = Utils.getRandomWithProbability({ 'change': Math.max(0, this.status.boredom - 300), 'stay': 1700 - this.status.boredom });
                        }
                        if(nextAction == 'change') {
                            this.simulation.plots[this.target + 0].removeVisitor(this.id);
                            let rangeMult = 2;
                            /** @type {'go home'|'change place'} */
                            let goHomeOrNew = 'go home';
                            if(this.specialTags.includes('latePartyGoer') && ['night', 'evening'].includes(this.simulation.currentDayTime)) {
                                goHomeOrNew = 'change place';
                                rangeMult = 10;
                            } else {
                                let goHomeProbabilityObject = {
                                    'go home': ((100 + Math.round(this.status.fatigue / 10)) - this.attributes.social),
                                    'change place': this.attributes.social + Math.round((1000 - this.status.fatigue)/10)
                                }
                                goHomeOrNew = Utils.getRandomWithProbability(goHomeProbabilityObject);
                            }
                            if(goHomeOrNew == 'go home') {
                                Human.goHome(this).then(() => {
                                    res(true);
                                });
                            } else {
                                Human.goToRandomHospitality(this, [this.target + 0], rangeMult).then((found) => {
                                    if(found) {
                                        res(true);
                                    } else {
                                        if(this.simulation.plots[this.target]) {
                                            if(this.simulation.plots[this.target].isOpen) {
                                                res(true);
                                            } else {
                                                Human.goHome(this).then(() => {
                                                    res(true);
                                                });
                                            }
                                        } else {
                                            Human.goHome(this).then(() => {
                                                res(true);
                                            });
                                        }
                                    }
                                });
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
                    let loseFocusOrKeepWalking = 'lose';

                    if(this.targetType == 'home') {
                        obj.lose = Math.round(looseFocusChance*0.1);
                        loseFocusOrKeepWalking = Utils.getRandomWithProbability(obj);
                    } else if(this.targetType == 'hospitality' && !this.simulation.plots[this.target].isOpen) {
                        loseFocusOrKeepWalking = 'lose';
                    } else {
                        loseFocusOrKeepWalking = Utils.getRandomWithProbability(obj);
                    }
                    
                    if(loseFocusOrKeepWalking == 'lose') {
                        // this.simulation.plots[this.target].removeWalker(this.id);
                        let hospitalityOrHome = Utils.getRandomWithProbability({'hospitality': Math.round((this.status.boredom / 5) + (100 - (this.status.fatigue / 10)) + this.attributes.social), 'home': Math.round((100 - (this.status.boredom / 10)) + (this.status.fatigue / 5) + (100 - this.attributes.social))});
                        
                        switch(hospitalityOrHome) {
                            case "hospitality": {
                                Human.goToRandomHospitality(this, [], 1).then((found) => {
                                    if(found) {
                                        res(true);
                                    } else {
                                        if(this.simulation.plots[this.target]) {
                                            if(this.simulation.plots[this.target].isOpen) {
                                                res(true);
                                            } else {
                                                Human.goHome(this).then(() => {
                                                    res(true);
                                                });
                                            }
                                        } else {
                                            Human.goHome(this).then(() => {
                                                res(true);
                                            });
                                        }
                                    }
                                });
                                break;
                            }
                            case "home": {
                                Human.goHome(this).then(() => {
                                    res(true);
                                });
                                break;
                            }
                        }
                    } else {
                        res(true);
                    }
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
     * @returns {Promise<Boolean>}
     */
    tick = () => {
        return new Promise(async (res) => {
            switch(this.action) {
                case "in home": {
                    this.targetType = 'home';
                    this.target = this.homeId;
                    if(this.specialTags.includes('nightOwl')) {
                        if(['evening', 'night'].includes(this.simulation.currentDayTime)) {
                            if(this.status.boredom > 1) {
                                this.status.boredom -= Math.floor((((100 - this.attributes.social) + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed);
                                if(this.status.boredom < 1) {
                                    this.status.boredom = 1;
                                }
                            }
                            if(!this.statusClearedFlags.fatigue) {
                                this.status.fatigue -= Math.max(0, Math.round((10 - (this.simulation.plots[this.homeId].currentVisitors.length - 1)) * 2));
                                if(this.status.fatigue < 1) {
                                    this.status.fatigue = 1;
                                    this.statusClearedFlags.fatigue = true;
                                }
                            }
                        } else if(this.statusClearedFlags.fatigue) {
                            this.status.boredom += Math.floor(((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed) * 2;
                            if(this.status.boredom > 999) {
                                this.status.boredom = 999;
                            }
                        } else {
                            this.status.fatigue -= Math.max(0, Math.round((10 - (this.simulation.plots[this.homeId].currentVisitors.length - 1)) * 0.5));
                            if(this.status.fatigue < 1) {
                                this.status.fatigue = 1;
                                this.statusClearedFlags.fatigue = true;
                            }
                        }
                    } else {
                        if(this.statusClearedFlags.fatigue) {
                            if(['evening', 'night'].includes(this.simulation.currentDayTime)) {
                                if(this.status.boredom > 1) {
                                    this.status.boredom -= Math.floor((((100 - this.attributes.social) + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed);
                                    if(this.status.boredom < 1) {
                                        this.status.boredom = 1;
                                    }
                                }
                            } else {
                                this.status.boredom += Math.floor(((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed);
                                if(this.status.boredom > 999) {
                                    this.status.boredom = 999;
                                }
                            }
                        } else {
                            this.status.fatigue -= Math.max(0, (10 - (this.simulation.plots[this.homeId].currentVisitors.length - 1)));
                            if(this.status.fatigue < 1) {
                                this.status.fatigue = 1;
                                this.statusClearedFlags.fatigue = true;
                            }
                        }
                    }
                    res(true);
                    break;
                }
                case "working": {
                    if(this.currentWork == undefined || this.currentWork == null) {
                        this.beginNewWork();
                    }
                    if(this.specialTags.includes('nightOwl')) {
                        if(['evening', 'night'].includes(this.simulation.currentDayTime)) {
                            this.status.fatigue += 5;
                            if(this.status.fatigue > 999) {
                                this.status.fatigue = 999;
                            }
                            this.status.boredom += Math.max(1, Math.floor(((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * (this.simulation.currentSpeed * 0.5)));
                            if(this.status.boredom > 999) {
                                this.status.boredom = 999;
                            }
                        } else {
                            this.status.fatigue += 20;
                            if(this.status.fatigue > 999) {
                                this.status.fatigue = 999;
                            }
                            this.status.boredom += Math.max(1, Math.floor(((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * (this.simulation.currentSpeed * 2)));
                            if(this.status.boredom > 999) {
                                this.status.boredom = 999;
                            }
                        }
                    } else {
                        this.status.fatigue += 10;
                        if(this.status.fatigue > 999) {
                            this.status.fatigue = 999;
                        }
                        this.status.boredom += Math.max(1, Math.floor(((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * (this.simulation.currentSpeed)));
                        if(this.status.boredom > 999) {
                            this.status.boredom = 999;
                        }
                    }
                    if(this.currentWork) {
                        this.currentWork.progress += Math.min(1, Math.round(this.attributes.intelligence / 20));
                        if(this.currentWork.progress >= 100) {
                            this.currentWork.progress = 100;
                        }
                    }
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
                        this.status.boredom += Math.floor((((100 + SimulationGlobals.boredomRatio) - this.attributes.social) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed);
                        if(this.status.boredom > 999) {
                            this.status.boredom = 999;
                        }
                    } else {
                        this.status.boredom -= Math.floor(((50 + this.attributes.social) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed);
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
     * @param {Number} dayNum
     * @param {Number} tickId
     * @param {Number} tickIteration
     * @returns {Promise<Boolean>}
     */
    tickNewDay = (dayNum, tickId, tickIteration) => {
        return new Promise((res) => {
            if(dayNum == this.birthDay && this.isAlive) {
                this.events.push({
                    id: this.events.length,
                    type: 'birthDay',
                    tickNumber: tickId + 0,
                    tickIteration: tickIteration + 0
                });
                this.info.age++;
            }
            res(true);
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
        switch(Utils.getRandomWithProbability({ 'doubleLastName': 10, 'normal': 190 })) {
            case 'doubleLastName': {
                let randomSecondName = Utils.getRandomArrayElement(LASTNAMES)[info.genderPronoun];
                while(info.lastname == randomSecondName) {
                    randomSecondName = Utils.getRandomArrayElement(LASTNAMES)[info.genderPronoun];
                }
                info.lastname = `${info.lastname}-${randomSecondName}`;
                break;
            }
            default: {
                break;
            }
        }
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
        if(this.specialTags.includes('autism')) {
            attributes['social'] = Math.max(1, Math.round(attributes['social'] * 0.75));
            attributes['intelligence'] = Math.min(100, Math.max(Math.round(attributes['intelligence'] * 1.25), 45));
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
     * @returns {{[key in INTREST_TAG]?: Number}}
     */
    getRandomIntrests = () => {
        /** @type {Array<INTREST_TAG>} */
        let intrestsArr = [intrests.getRandomIntrest()];

        let intrestCount = 1;
        switch(Utils.getRandomWithProbability({'below4': 3, 'over4': 1})) {
            case "below4": {
                if(this.specialTags.includes('autism')) {
                    intrestCount = Utils.randomInRange(1, Math.min(6, this.intrestsLimit));
                } else {
                    intrestCount = Utils.randomInRange(1, Math.min(3, this.intrestsLimit));
                }
                break;
            }
            case "over4": {
                if(this.specialTags.includes('autism')) {
                    intrestCount = Utils.randomInRange(6, Math.min(12, this.intrestsLimit));
                } else {
                    intrestCount = Utils.randomInRange(3, Math.min(6, this.intrestsLimit));
                }
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
        let returnObj = {};
        intrestsArr.toSorted().forEach((el) => {
            returnObj[el] = 1;
        });
        return returnObj;
    }

    /** @returns {INTREST_TAG} */
    getLowestIntrest = () => {
        /** @type {INTREST_TAG} */
        let found = 'drawing';
        let lowest = Number.MAX_SAFE_INTEGER;
        Object.keys(this.#interestsActionCounts).forEach((key) => {
            if(this.#interestsActionCounts[key] < lowest) {
                lowest = this.#interestsActionCounts[key] + 0; //@ts-ignore
                found = `${key}`;
            }
        });
        return found;
    }

    /** 
     * @param {INTREST_TAG} tag
     * @param {Array<{id: Number, name: String}>} participantsObjArr
     * @param {Number} tickId
     * @param {Number} tickIteration
     * @param {Hospitality|null} [plot]
     */
    addIntrest = (tag, participantsObjArr, tickId, tickIteration, plot=null) => {
        if(!this.intrests.includes(tag)) {
            if(this.isInterestsFull) {
                let probObj = { 'loseOne': 100 - this.attributes.intelligence, 'keep': this.attributes.intelligence };
                let isAutistic = false;
                if(this.specialTags.includes('autism')) {
                    probObj.keep = probObj.keep * 2;
                    isAutistic = true;
                }
                switch(Utils.getRandomWithProbability(probObj)) {
                    case "loseOne": {
                        let _id = this.events.length;
                        let intrestToLoose = this.getLowestIntrest();
                        if(Object.keys(this.#interestsActionCounts).includes(intrestToLoose)) {
                            delete this.#interestsActionCounts[intrestToLoose];
                            this.events.push({
                                id: _id,
                                type: 'loseIntrest',
                                intrest: intrestToLoose,
                                tickNumber: tickId,
                                tickIteration: tickIteration
                            });
                        }
                    }
                    default:
                    case "keep": {
                        let probaObj = { 'closer': 100 - this.attributes.social, 'avoid': this.attributes.social };
                        if(isAutistic) {
                            probaObj.closer = probaObj.closer * 2;
                        }
                        switch(Utils.getRandomWithProbability(probaObj)) {
                            case 'closer': {
                                let _id = this.events.length;
                                if(isAutistic) {
                                    this.madnessScore += 3;
                                } else {
                                    this.madnessScore += 2;
                                }
                                this.events.push({
                                    id: _id,
                                    type: 'closerToMadness',
                                    tickNumber: tickId,
                                    tickIteration: tickIteration
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            this.#interestsActionCounts[tag] = 1;
            this.intrestCategories = this.getIntrestCategories(this.intrests);
            if(intrests.intrestsArrContainsCategies([tag], ['rightActivism', 'leftActivism'])) {
                this.getLeftwingOrRightWingSpecialTag();
            }
            let id = this.events.length;
            if(plot) {
                if(plot.isHospitality) {
                    if(typeof plot.inheritedIntrestEvents[tag] == 'number') {
                        plot.inheritedIntrestEvents[tag]++;
                    } else {
                        plot.inheritedIntrestEvents[tag] = 1;
                    }
                    this.events.push({
                        id: id,
                        type: "newIntrest",
                        participants: participantsObjArr,
                        intrest: tag,
                        tickNumber: tickId,
                        tickIteration: tickIteration,
                        hospitalityId: plot.id
                    });
                } else {
                    this.events.push({
                        id: id,
                        type: "newIntrest",
                        participants: participantsObjArr,
                        intrest: tag,
                        tickNumber: tickId,
                        tickIteration: tickIteration
                    });
                }
            } else {
                this.events.push({
                    id: id,
                    type: "newIntrest",
                    participants: participantsObjArr,
                    intrest: tag,
                    tickNumber: tickId,
                    tickIteration: tickIteration
                });
            }
        }
    }

    /** @type {HUMAN_ATTRIBUTES} */
    attributes;
    /** @type {HUMAN_INFO} */
    info;

    get data () {
        return {info: this.info, attributes: this.attributes, intrests: this.intrests};
    }

    getLeftwingOrRightWingSpecialTag = () => {
        if(!this.specialTags.includes('leftWing') && !this.specialTags.includes('rightWing')) {
            let scores = {'leftWing': 1, 'rightWing': 1};
            let connected = intrests.getConnectedIntrestsFromTagArray(this.intrests);

            let filteredLeft = intrests.filterConnectedIntrestsByCategory(connected, 'leftActivism');
            Object.keys(filteredLeft).forEach((name) => {
                scores.leftWing += filteredLeft[name];
            });
            let filteredRight = intrests.filterConnectedIntrestsByCategory(connected, 'rightActivism');
            Object.keys(filteredRight).forEach((name) => {
                scores.rightWing += filteredRight[name];
            });

            if(scores.leftWing <= 0) {
                scores.leftWing = 1;
            }
            if(this.info.gender == 'other') {
                scores.leftWing = Math.max(Math.round(scores.leftWing * 1.5), scores.leftWing + 100);
            }
            if(scores.rightWing <= 0) {
                scores.rightWing = 1;
            }
            let final = Utils.getRandomWithProbability(scores);
            if(!this.specialTags.includes(final)) {
                this.specialTags.push(final);
            }
        }
    }

    init = () => {
        return new Promise(async (res) => {
            if(this.#temp.eventsToParse) {
                this.events = [];
                this.events = this.dedumpEvent(this.#temp.eventsToParse);
                delete this.#temp.eventsToParse;
            }
            if(intrests.intrestsArrContainsCategies(this.intrests, ['rightActivism', 'leftActivism'])) {
                this.getLeftwingOrRightWingSpecialTag();
            }
            if(!this.isAlive) {
                this.action = 'dead';
            }
            switch(this.action) {
                case "in home":
                case "meeting":
                case "working": {
                    res(true);
                    break;
                }
                case "walking": {
                    if(this.targetType == 'hospitality') {
                        if(typeof this.target == 'number') {
                            this.walkingTo = JSON.parse(JSON.stringify(this.simulation.plots[this.target].pos));
                        } else {
                            let preferedHospitality = this.getPreferredHospitality();
                            this.target = preferedHospitality.id + 0;
                            this.walkingTo = JSON.parse(JSON.stringify(preferedHospitality.pos));
                        }
                        this.simulation.plots[this.target].addWalker(this.id);
                        this.crossedDistance = 0;
                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
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
                    } else {
                        this.targetType = 'home';
                        this.walkingTo = JSON.parse(JSON.stringify(this.home.pos));
                        this.home.addWalker(this.id);
                        this.crossedDistance = 0;
                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
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
                        };
                    }
                    res(true);
                    break;
                }
                case "in hospitality": {
                    this.simulation.plots[this.currentPlotId].addVisitor(this.id);
                    res(true);
                    break;
                }
                case 'dead': {
                    this.pos = { x: this.home.pos.x + 0, y: this.home.pos.y + 0 };
                    this.renderedPos = { x: this.home.pos.x + 0, y: this.home.pos.y + 0 };
                    this.targetType = 'home';
                    this.target = this.homeId;
                    this.currentPlotId = this.homeId + 0;
                    res(true);
                    break;
                }
            }
        });
    }

    /**
     * @param {Simulation} simulation
     * @param {null|HUMAN_SAVED_DATA} [savedData]
     */
    constructor(simulation, savedData=null) {
        this.simulation = simulation;
        this.id = this.simulation.humans.push(this) - 1;

        const getRandomHome = () => {
            this.homeId = new Home(this.simulation, this.simulation.grid.getRandomAvailableSlot()).id;
        }

        const getRandomSpecialTags = () => {
            this.specialTags = [];
            if(Utils.getRandomWithProbability({none: 90, some: 10}) == 'some') {
                let count = Utils.randomInRange(0, Math.min(3, SpecialTagsNoPoliticalOrKiller.length));
                for(let i = 0; i<count; i++) {
                    let random = Utils.getRandomArrayElement(SpecialTagsNoPoliticalOrKiller);
                    while(this.specialTags.includes(random)) {
                        random = Utils.getRandomArrayElement(SpecialTagsNoPoliticalOrKiller);
                    }
                    this.specialTags.push(`${random}`);
                }
            }
        }

        if(savedData) {
            if(savedData.specialTags) {
                this.specialTags = savedData.specialTags;
            } else {
                getRandomSpecialTags();
            }
            if(savedData.attributes) {
                this.attributes = this.parseAttributes(savedData.attributes);
            } else {
                this.attributes = this.getRandomAttributes();
            }
            this.intrestsLimit = Math.floor(this.attributes.intelligence / 10) + 5;
            if(this.specialTags.includes('autism')) {
                this.intrestsLimit = this.intrestsLimit * 2;
            }
            if(savedData.info) {
                this.info = this.parseInfo(savedData.info);
            } else {
                this.info = this.getRandomInfo();
            }
            if(typeof savedData.birthDay == 'number') {
                this.birthDay = Math.max(savedData.birthDay%366, 1);
            } else {
                this.birthDay = Math.floor(Math.random() * 365) + 1;
            }
            if(savedData.intrests) {
                if(Object.keys(savedData.intrests).length > 0) {
                    this.#interestsActionCounts = savedData.intrests;
                } else {
                    this.#interestsActionCounts = this.getRandomIntrests();
                }
            } else {
                this.#interestsActionCounts = this.getRandomIntrests();
            }
            if(savedData.home) {
                let preexistingHome = this.simulation.getPlotByPos(savedData.home);
                if(preexistingHome) {
                    this.homeId = preexistingHome.id + 0;
                } else {
                    let slot = this.simulation.grid.getSlotByPos(savedData.home);
                    if(slot) {
                        if(slot.claimed !== 'H') {
                            this.homeId = new Home(this.simulation, slot).id;
                        } else {
                            getRandomHome();
                        }
                    } else {
                        getRandomHome();
                    }
                }
            } else {
                getRandomHome();
            }
            if(savedData.statuses) {
                if(savedData.statuses.boredom) {
                    this.status.boredom = savedData.statuses.boredom + 0;
                }
                if(savedData.statuses.fatigue) {
                    this.status.fatigue = savedData.statuses.fatigue + 0;
                }
            }
            if(savedData.currentAction) {
                const setInHomeFallback = () => {
                    this.pos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
                    this.renderedPos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
                    this.targetType = 'home';
                    this.target = this.homeId;
                    this.currentPlotId = this.homeId + 0;
                    this.walkingTo = null;
                    this.pathToWalkOn = null;
                    this.simulation.plots[this.homeId].addVisitor(this.id);
                }
                const walkToRandomHospitalityFallback = () => {
                    if(this.simulation.grid.isValidPos(savedData.currentAction.pos)) {
                        this.pos = {x: savedData.currentAction.pos.x + 0, y: savedData.currentAction.pos.y + 0};
                        this.renderedPos = {x: savedData.currentAction.pos.x + 0, y: savedData.currentAction.pos.y + 0};
                    } else {
                        this.pos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
                        this.renderedPos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
                    }
                    this.action = 'walking';
                    this.targetType = 'hospitality';
                    this.crossedDistance = 0;
                    this.pathToWalkOn = null;
                    this.currentPlotId = null;
                    this.walkingTo = null;
                    this.target = null;
                }
                const setWalkingHomeFallback = () => {
                    if(this.simulation.grid.isValidPos(savedData.currentAction.pos)) {
                        this.pos = {x: savedData.currentAction.pos.x + 0, y: savedData.currentAction.pos.y + 0};
                        this.renderedPos = {x: savedData.currentAction.pos.x + 0, y: savedData.currentAction.pos.y + 0};
                        this.target = this.homeId;
                        this.targetType = 'home';
                        this.currentPlotId = null;
                        this.crossedDistance = 0;
                        this.pathToWalkOn = null;
                        this.walkingTo = JSON.parse(JSON.stringify(this.home.pos));
                        this.pathToWalkOn = null;
                        this.action = 'walking';
                    } else {
                        setInHomeFallback();
                        this.action = 'in home';
                    }
                }
                switch(savedData.currentAction.type) {
                    case "in home": {
                        setInHomeFallback();
                        this.action = 'in home';
                        break;
                    }
                    case "working": {
                        setInHomeFallback();
                        this.action = 'working';
                        break;
                    }
                    case "walking": {
                        if(savedData.currentAction.targetType == 'home') {
                            setWalkingHomeFallback();
                        } else if(typeof savedData.currentAction.target == 'number') {
                            if(this.simulation.plots[savedData.currentAction.target]) {
                                if(this.simulation.plots[savedData.currentAction.target].isHospitality) {
                                    if(this.simulation.grid.isValidPos(savedData.currentAction.pos)) {
                                        this.pos = {x: savedData.currentAction.pos.x + 0, y: savedData.currentAction.pos.y + 0};
                                        this.renderedPos = {x: savedData.currentAction.pos.x + 0, y: savedData.currentAction.pos.y + 0};
                                    } else {
                                        this.pos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
                                        this.renderedPos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
                                    }
                                    this.target = savedData.currentAction.target + 0;
                                    this.targetType = 'hospitality';
                                    this.action = 'walking';
                                    this.currentPlotId = null;
                                    this.crossedDistance = 0;
                                    this.pathToWalkOn = null;
                                    this.walkingTo = JSON.parse(JSON.stringify(this.simulation.plots[this.target].pos));
                                } else {
                                    walkToRandomHospitalityFallback();
                                }
                            } else {
                                walkToRandomHospitalityFallback();
                            }
                        } else {
                            walkToRandomHospitalityFallback();
                        }
                        break;
                    }
                    case "meeting": {
                        switch(Utils.getRandomWithProbability({'home': 50, 'hosp': 50})) {
                            case "home": {
                                setWalkingHomeFallback();
                                break;
                            }
                            case "hosp": {
                                walkToRandomHospitalityFallback();
                                break;
                            }
                        }
                        break;
                    }
                    case "in hospitality": {
                        if(typeof savedData.currentAction.target == 'number') {
                            if(this.simulation.plots[savedData.currentAction.target]) {
                                if(this.simulation.plots[savedData.currentAction.target].isHospitality) {
                                    this.target = this.simulation.plots[savedData.currentAction.target].id + 0;
                                    this.currentPlotId = this.target + 0;
                                    this.pos = JSON.parse(JSON.stringify(this.simulation.plots[this.currentPlotId].pos));
                                    this.renderedPos = JSON.parse(JSON.stringify(this.pos));
                                    this.action = 'in hospitality';
                                    this.targetType = 'hospitality';
                                } else {
                                    walkToRandomHospitalityFallback();
                                }
                            } else {
                                walkToRandomHospitalityFallback();
                            }
                        } else {
                            walkToRandomHospitalityFallback();
                        }
                        break;
                    }
                }
            }
            if(savedData.events) {
                this.#temp.eventsToParse = savedData.events;
            }
            if(savedData.deathDate) {
                this.deathDate = savedData.deathDate;
            }
        } else {
            getRandomSpecialTags();
            this.attributes = this.getRandomAttributes();
            this.intrestsLimit = Math.floor(this.attributes.intelligence / 10) + 5;
            if(this.specialTags.includes('autism')) {
                this.intrestsLimit = this.intrestsLimit * 2;
            }
            this.info = this.getRandomInfo();
            this.birthDay = Math.floor(Math.random() * 365) + 1;
            this.#interestsActionCounts = this.getRandomIntrests();
            getRandomHome();
            this.pos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
            this.renderedPos = {x: this.home.pos.x + 0, y: this.home.pos.y + 0};
            this.targetType = 'home';
            this.target = this.homeId;
            this.currentPlotId = this.homeId + 0;
            this.simulation.plots[this.homeId].addVisitor(this.id);
        }

        if(!intrests.intrestsArrContainsCategory(this.intrests, 'artforms')) {
            let allArtforms = intrests.getIntrestsOfCategory('artforms');
            this.#interestsActionCounts[Utils.getRandomArrayElement(Object.keys(allArtforms))] = 1;
        }
        this.intrestCategories = this.getIntrestCategories(this.intrests);
    }
}

export { Human };