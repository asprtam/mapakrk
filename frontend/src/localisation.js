/**
 * @typedef {Object} LOCALISATION_PLOT_DATA
 * @property {String} adress
 * @property {String} visitors
 * @property {String} theme
 * @property {String} closed
 * @property {String} open
 * @property {String} openHours
 * @property {String} subtype
 * @property {String} popularityScore
 * @property {String} plotAttributes
 */

/**
 * @typedef {{[key in import("../../simulation/entites").HOSPITALITY_SUBTYPE]: String}} LOCALISATION_HOSPITALITY_SUBTYPE
 */

/** 
 * @typedef {Object} LOCALISATION
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_ATTRIBUTES]: String}} attributeNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_STATUSES]: String}} statusNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_INFO]: String}} infoNames
 * @property {{[key in keyof import("../../simulation/entites").HUMAN_ACTION_NAMES]: String}} actions
 * @property {{[key in keyof import("../../simulation/human").HUMAN_ACTION_NAMES]: String}} actions
 * @property {String} attributes
 * @property {String} statuses
 * @property {String} friends
 * @property {String} intrests
 * @property {LOCALISATION_PLOT_DATA} plotData
 * @property {LOCALISATION_HOSPITALITY_SUBTYPE} plotTypes
 * @property {String} humanTooltipAction_GoingHome
 * @property {String} humanTooltipAction_GoingHosp
 * @property {String} humanTooltipAction_inHosp
 * @property {String} humanTooltipAction_inHome
 * @property {String} humanExtraAction_talkingWith
 * @property {String} humanExtraAction_talkingAbout
 * @property {String} humanWindowAction_inHome
 * @property {String} humanWindowAction_inHosp
 * @property {String} humanWindowAction_GoingHome
 * @property {String} humanWindowAction_GoingHosp
 * @property {String} events
 * @property {String} newIntrest
 * @property {String} loseIntrest
 * @property {String} closerToMadness
 * @property {String} humanWindowEvent_intrestGainedFrom
 * @property {String} humanWindowEvent_newFriend
 * @property {String} humanWindowEvent_newFriendConnectionReason
 * @property {String} humanWindowEvent_friendChangeRelationPositive
 * @property {String} humanWindowEvent_friendChangeRelationNegative
 * @property {String} humanWindowEvent_friendChangeRelationReason
 * @property {String} humanWindowEvent_birthDay
 * @property {String} specialTags
 */

/** @type {LOCALISATION} */
const localisationPl = {
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
        "meeting": "na spotkaniu",
        "working": "w domu (pracuje)",
        "dead": "nie żyje",
    },
    intrests: "Zainteresowania",
    plotData:{
        adress: "Adres",
        visitors: "Odwiedzający",
        theme: "Powiązana tematyka",
        closed: "Zamknięte",
        open: "Otwarte",
        openHours: "Godziny otwarcia",
        subtype: "Typ",
        popularityScore: "Popularność",
        plotAttributes: 'Właściwości'
    },
    plotTypes: {
        cafe: 'Kawiarnia',
        gallery: 'Galeria',
        bar: 'Bar',
        club: 'Klub'
    },
    humanTooltipAction_GoingHome: 'idzie do <span class="location">domu</span>',
    humanTooltipAction_GoingHosp: 'idzie do <span class="location">${name}</span>',
    humanTooltipAction_inHosp: 'w <span class="location">${name}</span>',
    humanTooltipAction_inHome: 'w <span class="location">domu</span>',
    humanExtraAction_talkingWith: 'Rozmawia z',
    humanExtraAction_talkingAbout: 'na temat <span class="topicName">${name}</span>',
    humanWindowAction_inHome: 'w <span class="location">domu <span class="location-adress">(${adress})</span></span>',
    humanWindowAction_GoingHome: 'idzie do <span class="location">domu <span class="location-adress">(${adress})</span></span>',
    humanWindowAction_inHosp: 'w <span class="location">${name} <span class="location-adress">(${adress})</span></span>',
    humanWindowAction_GoingHosp: 'idzie do <span class="location">${name} <span class="location-adress">(${adress})</span></span>',
    events: 'Zdarzenia',
    newIntrest: 'Nowe zainteresowanie',
    humanWindowEvent_intrestGainedFrom: 'Zdobyto w rozmowie z:',
    humanWindowEvent_newFriend: 'Nowy znajomy',
    humanWindowEvent_newFriendConnectionReason: 'Połączyła ich rozmowa o <span class="talk-topic">${topic}</span>',
    humanWindowEvent_friendChangeRelationPositive: 'Polepsza relację z',
    humanWindowEvent_friendChangeRelationNegative: 'Pogarsza relację z',
    humanWindowEvent_friendChangeRelationReason: 'przez rozmowę o <span class="talk-topic">${topic}</span>',
    humanWindowEvent_birthDay: 'Obchodzi urodziny',
    specialTags: 'Specjalne cechy',
    loseIntrest: "Traci zainteresowanie",
    closerToMadness: "Zbliża się do szaleństwa"
};

/** @type {LOCALISATION} */
const localisationEng = {
    attributes: 'Skills',
    statuses: "Status",
    attributeNames: {
        social: "social skill",
        physical: "physique",
        intelligence: "mental capacity"
    },
    statusNames: {
        boredom: "boredom level",
        fatigue: "fatigue level"
    },
    friends: "Friends",
    infoNames: {
        age: "Age",
        name: "Name",
        lastname: "Lastname",
        gender: "Gender",
        genderPronoun: "Pronouns",
        customGenderName: "Custom gender name"
    },
    actions: {
        "in home": "in home",
        "walking": "walking to",
        "meeting": "on a meeting",
        "working": "in home (working)",
        "in hospitality": "in",
        "dead": "dead"
    },
    intrests: "Interests",
    plotData: {
        adress: "Adress",
        visitors: "Visitors",
        theme: "Related topics",
        open: "Open",
        closed: "Closed",
        openHours: "Working hours",
        subtype: "Type",
        popularityScore: "Popularity",
        plotAttributes: "Attributes"
    },
    plotTypes: {
        cafe: 'Cafe',
        gallery: 'Gallery',
        bar: 'Bar',
        club: 'Club'
    },
    humanTooltipAction_GoingHome: 'walking <span class="location">home</span>',
    humanTooltipAction_GoingHosp: 'walking to <span class="location">${name}</span>',
    humanTooltipAction_inHosp: 'in <span class="location">${name}</span>',
    humanTooltipAction_inHome: 'in <span class="location">home</span>',
    humanExtraAction_talkingWith: 'Talking with',
    humanExtraAction_talkingAbout: 'about <span class="topicName">${name}</span>',
    humanWindowAction_inHome: 'in <span class="location">home <span class="location-adress">(${adress})</span></span>',
    humanWindowAction_GoingHome: 'walking <span class="location">home <span class="location-adress">(${adress})</span></span>',
    humanWindowAction_inHosp: 'in <span class="location">${name} <span class="location-adress">(${adress})</span></span>',
    humanWindowAction_GoingHosp: 'walking to <span class="location">${name} <span class="location-adress">(${adress})</span></span>',
    events: 'Events',
    newIntrest: 'New intrest',
    humanWindowEvent_intrestGainedFrom: 'Gained from conversation with:',
    humanWindowEvent_newFriend: 'New friend',
    humanWindowEvent_newFriendConnectionReason: 'meet during conversation about <span class="talk-topic">${topic}</span>',
    humanWindowEvent_friendChangeRelationPositive: 'Improves relation with',
    humanWindowEvent_friendChangeRelationNegative: 'Worsens relation with',
    humanWindowEvent_friendChangeRelationReason: 'due to conversation about <span class="talk-topic">${topic}</span>',
    humanWindowEvent_birthDay: 'Celebrated theirs birthday',
    specialTags: 'Special traits',
    loseIntrest: 'Lost intrest',
    closerToMadness: "Gets closer to madness"
};

let isPolish = false;
/** @type {LOCALISATION} */
let localisation = localisationEng;
if(window.navigator.language.toLowerCase().trim() == 'pl-pl' || window.navigator.language.toLowerCase().trim() == 'pl') {
    localisation = localisationPl;
    isPolish = true;
}

/**
 * @param {String} srcString
 * @param {{[id: String]: String}} srcObject
 * @returns {String}
 */
const localisationParse = (srcString, srcObject) => {
    let returnString = `${srcString}`;
    let matches = returnString.match(/\$\{[^\}]*\}/gmi);
    if(matches) {
        matches.forEach((match) => {
            let matchInner = match.slice(2, -1);
            if(typeof srcObject[matchInner] == 'string') {
                returnString = returnString.replace(match, `${srcObject[matchInner]}`);
            } else {
                returnString = returnString.replace(match, ``);
            }
        });
    }
    return returnString;
}

export { localisation, localisationParse, isPolish };