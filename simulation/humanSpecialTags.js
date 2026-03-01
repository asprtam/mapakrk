//@ts-ignore
import { TG } from "../typeGoblin.js";
/** 
 * @typedef {keyof typeof SpecialTagsObj} HUMAN_SPECIAL_TAG
 */
/** 
 * @typedef {keyof TG.FanumTax<typeof SpecialTagsObj, ['killer']>['=>']} HUMAN_SPECIAL_TAG_NO_KILLER
 */
/** 
 * @typedef {keyof TG.FanumTax<typeof SpecialTagsObj, ['killer', 'leftWing', 'rightWing']>['=>']} HUMAN_SPECIAL_TAG_NO_KILLER_OR_POLITICAL
 */
/** 
 * @typedef {keyof TG.FanumTax<typeof SpecialTagsObj, ['leftWing', 'rightWing']>['=>']} HUMAN_SPECIAL_TAG_NO_POLITICAL
 */
let SpecialTagsObj = {
    "leftWing": null,
    "rightWing": null,
    "autism": null,
    "drugAddict": null,
    "killer": null,
    "confrontational": null,
    "latePartyGoer": null,
    "nightOwl": null
};

/** @type {Array<HUMAN_SPECIAL_TAG>} */ //@ts-ignore
let SpecialTags = Object.keys(SpecialTagsObj);

/** @type {Array<HUMAN_SPECIAL_TAG_NO_KILLER>} */
let SpecialTagsNoKiller = [];

/** @type {Array<HUMAN_SPECIAL_TAG_NO_KILLER_OR_POLITICAL>} */
let SpecialTagsNoPoliticalOrKiller = [];

/** @type {Array<HUMAN_SPECIAL_TAG_NO_POLITICAL>} */
let SpecialTagsNoPolitical = [];

SpecialTags.forEach((tag) => {
    switch(tag) {
        case "rightWing":
        case "leftWing": {
            SpecialTagsNoKiller.push(tag);
            break;
        }
        case "killer": {
            SpecialTagsNoPolitical.push(tag);
            break;
        }
        default: {
            SpecialTagsNoKiller.push(tag);
            SpecialTagsNoPoliticalOrKiller.push(tag);
            SpecialTagsNoPolitical.push(tag);
            break;
        }
    }
});

export { SpecialTagsNoKiller, SpecialTags, SpecialTagsNoPolitical, SpecialTagsNoPoliticalOrKiller };