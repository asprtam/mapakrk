/** 
 * @typedef {Object} LOCALISATION
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_ATTRIBUTES]: String}} attributeNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_STATUSES]: String}} statusNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_INFO]: String}} infoNames
 * @property {String} attributes
 * @property {String} statuses
 * @property {String} friends
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
        boredom: "poziom nudy"
    },
    friends: 'Znajomi',
    infoNames: {
        age: 'Wiek',
        name: 'Imię',
        lastname: 'Nazwisko',
        gender: 'Płeć',
        genderPronoun: 'Zaimki',
        customGenderName: 'Niestandardowa nazwa płci'
    }
};

export {localisation};