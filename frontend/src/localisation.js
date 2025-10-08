/** 
 * @typedef {Object} LOCALISATION
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_ATTRIBUTES]: String}} attributeNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_STATUSES]: String}} statusNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_INFO]: String}} infoNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_ACTION_NAMES]: String}} actions
 * @property {String} attributes
 * @property {String} statuses
 * @property {String} friends
 * @property {String} intrests
 */

/** @type {LOCALISATION} */
const localisation = {
    attributes: 'Umiejętności',
    statuses: 'Statusy',
    attributeNames: {
        social: `społeczne`,
        physical: `fizyczne`,
        intelligence: `umysłowe`
    },
    statusNames: {
        boredom: "poziom nudy",
        fatigue: "poziom zmęczenia"
    },
    friends: 'Znajomi',
    infoNames: {
        age: 'Wiek',
        name: 'Imię',
        lastname: 'Nazwisko',
        gender: 'Płeć',
        genderPronoun: 'Zaimki',
        customGenderName: 'Niestandardowa nazwa płci'
    },
    actions: {
        "in home": 'w domu',
        "walking": 'idzie do',
        "in hospitality": "w",
        "meeting": "spotyka się",
        "working": "w domu (pracuje)"
    },
    intrests: "Zainteresowania"
};

export {localisation};