import { intrestCategories } from "./intrestCategories.js";
import { Utils } from "../simulation/utils.js";

/**
 * @typedef {import("./intrestCategories.js").INTREST_CATEGORY_NAME} INTREST_CATEGORY_NAME
 */

/**
 * @typedef {keyof typeof _list} INTREST_TAG
 */

/** 
 * @typedef {Object} INTREST
 * @property {String} name
 * @property {Array<INTREST_CATEGORY_NAME>} categories
 * @property {Array<INTREST_TAG>} connected
 * @property {Array<INTREST_TAG>} disconnected
 */

/*

    ZASADY NALICZANIA PUNKTÓW w connectedIntrests
    --bezposrednie polaczenie = 3
    --kazda dzielona kategoria = 2
    --kazda kategoria polaczona z kategoria zainteresowania ktorego powiazanych szukamy = 1
    --kazda kategoria rozlaczona z kategoria zainteresowania ktorego powiazanych szukamy = -1
    --bezposrednie rozlaczenie = -3

*/

const _list = {
    "drawing": {
        name: "rysunek",
        categories: ['artforms'],
        connected: ['digitalArt']
    },
    "painting": {
        name: "malarstwo",
        categories: ['artforms']
    },
    "music": {
        name: "muzyka",
        categories: ['artforms']
    },
    "sculpture": {
        name: "rzeżbiarstwo",
        categories: ['artforms']
    },
    "graffiti": {
        name: "graffiti",
        categories: ['artforms', 'streetCulture'],
    },
    "photography": {
        name: "fotografia",
        categories: ['artforms'],
        connected: ['film']
    },
    "film": {
        name: "film",
        categories: ['artforms'],
        connected: ['photography']
    },
    "digitalArt": {
        name: "digital art",
        categories: ['artforms', 'tech'],
        connected: ['drawing', 'gaming']
    },
    "communism": {
        name: "komunizm",
        categories: ['leftActivism', 'socialTopics', 'internetCulture'],
        disconnected: ['fascism', 'libertarianism']
    },
    "climateActivism": {
        name: "aktywizm klimatyczny",
        categories: ['leftActivism'],
        connected: ['animalActivism']
    },
    "feminism": {
        name: "feminizm",
        categories: ['leftActivism', 'socialTopics']
    },
    "lgbtActivism": {
        name: "aktywizm LGBTQ+",
        categories: ['leftActivism', 'socialTopics']
    },
    "animalActivism": {
        name: "aktywizm prozwierzęcy",
        categories: ['leftActivism', 'socialTopics'],
        connected: ['climateActivism']
    },
    "chanCulture": {
        name: "kultura chanów",
        categories: ['internetCulture', 'socialTopics'],
        disconnected: ['feminism']
    },
    "brainrot": {
        name: "brainrot",
        categories: ['internetCulture', 'socialTopics']
    },
    "incelism": {
        name: "incelizm",
        categories: ['internetCulture', 'rightActivism', 'socialTopics'],
        connected: ['chanCulture', 'eugenics', 'libertarianism', 'fascism'],
        disconnected: ['feminism']
    },
    "memes": {
        name: "memy internetowe",
        categories: ['internetCulture', 'socialTopics']
    },
    "gaming": {
        name: "gry komputerowe",
        categories: ['internetCulture', 'tech'],
        connected: ['digitalArt'],
    },
    "fascism": {
        name: "faszyzm",
        categories: ['rightActivism', 'internetCulture', 'socialTopics'],
        connected: ['incelism'],
        disconnected: ['communism']
    },
    "libertarianism": {
        name: "libertarianizm",
        categories: ['rightActivism', 'internetCulture'],
        connected: ['incelism'],
        disconnected: ['communism']
    },
    "eugenics": {
        name: "eugenika",
        categories: ['rightActivism'],
        connected: ['incelism'],
        disconnected: ['communism', 'feminism', 'lgbtActivism']
    },
    "traditionalValues": {
        name: "obrona tradycyjnych wartości",
        categories: ['rightActivism'],
        disconnected: ['communism', 'feminism', 'lgbtActivism', 'animalActivism'],
        connected: ['historyOfPoland']
    },
    "ai": {
        name: 'sztuczna inteligencja',
        categories: ['tech', 'socialTopics']
    },
    "religionStudies": {
        name: "religioznawstwo",
        categories: ['socialTopics', 'history'],
        connected: ['tradition']
    },
    "tradition": {
        name: "tradycje ludowe",
        categories: ['socialTopics', 'history'],
        connected: ['religionStudies']
    },
    "historyOfPoland": {
        name: "historia polski",
        categories: ['socialTopics', 'history'],
        connected: ['traditionalValues']
    },
    "medieval": {
        name: "średniowiecze",
        categories: ['history']
    },
    "ancientHistory": {
        name: "historia starożytna",
        categories: ['history'],
        connected: ['religionStudies']
    },
    "modernHistory": {
        name: "historia nowożytna",
        categories: ['history', 'socialTopics']
    },
    "hiphop": {
        name: "hiphop",
        categories: ['streetCulture'],
        connected: ['music'],
        disconnected: ['techno']
    },
    "techno": {
        name: "techno",
        categories: ['clubCulture'],
        connected: ['music'],
        disconnected: ['hiphop'],
    },
    "stimulants": {
        name: "stymulanty",
        categories: ['drugs', 'clubCulture'],
        connected: ['techno']
    },
    "depressants": {
        name: "depresanty",
        categories: ['drugs', 'streetCulture'],
        connected: ['hiphop']
    },
    "psychodelics": {
        name: "psychodeliki",
        categories: ['drugs'],
        connectedOneWay: ['tradition', 'religionStudies']
    }
}

Object.keys(_list).forEach((tag) => {
    if(typeof _list[tag].categories == 'undefined') {
        _list[tag].categories = [];
    }
    if(typeof _list[tag].connected == 'undefined') {
        _list[tag].connected = [];
    }
    if(typeof _list[tag].disconnected == 'undefined') {
        _list[tag].disconnected = [];
    }
    _list[tag].connected.forEach((_tag) => {
        if(typeof _list[_tag].connected == 'undefined') {
            _list[_tag].connected = [];
        }
        if(!_list[_tag].connected.includes(tag)) {
            _list[_tag].connected.push(tag);
        }
    });
    _list[tag].disconnected.forEach((_tag) => {
        if(typeof _list[_tag].disconnected == 'undefined') {
            _list[_tag].disconnected = [];
        }
        if(!_list[_tag].disconnected.includes(tag)) {
            _list[_tag].disconnected.push(tag);
        }
    });
    if(_list[tag].connectedOneWay) {
        _list[tag].connectedOneWay.forEach((el) => {
            if(!_list[tag].connected.includes(el)) {
                _list[tag].connected.push(el);
            }
        });
        delete _list[tag].connectedOneWay;
    }
    if(_list[tag].disconnectedOneWay) {
        _list[tag].disconnectedOneWay.forEach((el) => {
            if(!_list[tag].disconnected.includes(el)) {
                _list[tag].disconnected.push(el);
            }
        });
        delete _list[tag].disconnectedOneWay;
    }
});

const intrests = {
    /**
     * @type {{[key in INTREST_TAG]: INTREST}}
     *///@ts-ignore
    list: {
    },
    /**
     * @param {Array<INTREST>} intrests
     * @returns {Boolean}
     */
    doIntrestsShareCategory: (intrests) => {
        if(intrests.length > 1) {
            let includes = false;
            let iteratorCategories = 0;
            while(iteratorCategories < intrests[0].categories.length && !includes) {
                let _includes = true;
                let iteratorIntrests = 1;
                while(iteratorIntrests < intrests.length && _includes) {
                    _includes = intrests[iteratorIntrests].categories.includes(intrests[0].categories[iteratorCategories]);
                    iteratorIntrests++;
                }
                includes = _includes;
                iteratorCategories++;
            }
            return includes;
        } else {
            return true;
        }
    },
    /**
     * @param {INTREST_CATEGORY_NAME} name 
     * @returns {{[id: String]: INTREST}}
     */
    getIntrestsOfCategory: (name) => {
        /** @type {{[id: String]: INTREST}} */
        let list = {};
        for(let intrestName of Object.keys(_list)) {
            if(_list[intrestName].categories.includes(name)) {
                Object.defineProperty(list, intrestName, {
                    set: () => {},
                    get: () => {
                        return _list[intrestName];
                    },
                    enumerable: true
                });
            }
        }
        return list;
    },
    /**
     * @param {INTREST} intrest
     * @param {Boolean} [includeSameCategory = true]
     * @param {Boolean} [allowNegativeScore = true]
     * @returns {{[key in INTREST_TAG]?: Number}}
     */
    getConnectedIntrests: (intrest, includeSameCategory = true, allowNegativeScore = true) => {
        /** @type {{[key in INTREST_TAG]?: Number}} */
        let connected = {};

        if(includeSameCategory) {
            /** @type {{[id: String]: Array<String>}} */
            let checkedCategories = {};

            intrest.categories.forEach((name) => {
                if(typeof checkedCategories[name] == 'undefined') {
                    checkedCategories[name] = Object.keys(intrests.getIntrestsOfCategory(name));
                }
                checkedCategories[name].forEach((tag) => {
                    if(typeof connected[tag] == 'undefined') {
                        connected[tag] = 2;
                    } else {
                        connected[tag] += 2;
                    }
                });
                intrestCategories.list[name].connected.forEach((categoryName) => {
                    if(typeof checkedCategories[categoryName] == 'undefined') {
                        checkedCategories[categoryName] = Object.keys(intrests.getIntrestsOfCategory(categoryName));
                    }
                    checkedCategories[categoryName].forEach((tag) => {
                        if(typeof connected[tag] == 'undefined') {
                            connected[tag] = 1;
                        } else {
                            connected[tag]++;
                        }
                    });
                });
                intrestCategories.list[name].disconnected.forEach((categoryName) => {
                    if(typeof checkedCategories[categoryName] == 'undefined') {
                        checkedCategories[categoryName] = Object.keys(intrests.getIntrestsOfCategory(categoryName));
                    }
                    checkedCategories[categoryName].forEach((tag) => {
                        if(typeof connected[tag] == 'undefined') {
                            connected[tag] = -1;
                        } else {
                            connected[tag]--;
                        }
                    });
                });
            });
        }

        if(intrest.connected) {
            intrest.connected.forEach((tag) => {
                if(Object.keys(_list).includes(tag)) {
                    if(typeof connected[tag] == 'undefined') {
                        let score = 3;
                        intrest.categories.forEach((name) => {
                            if(_list[tag].categories.includes(name)) {
                                score+=2;
                            }
                            intrestCategories.list[name].connected.forEach((categoryName) => {
                                if(_list[tag].categories.includes(categoryName)) {
                                    score+=1;
                                }
                            });
                            intrestCategories.list[name].disconnected.forEach((categoryName) => {
                                if(_list[tag].categories.includes(categoryName)) {
                                    score-=1;
                                }
                            });
                        });
                        connected[tag] = score;
                    } else {
                        connected[tag]+=3;
                    }
                }
            });
        }

        if(intrest.disconnected) {
            intrest.disconnected.forEach((tag) => {
                if(Object.keys(_list).includes(tag)) {
                    if(typeof connected[tag] == 'undefined') {
                        let score = 3;
                        intrest.categories.forEach((name) => {
                            if(_list[tag].categories.includes(name)) {
                                score+=2;
                            }
                            intrestCategories.list[name].connected.forEach((categoryName) => {
                                if(_list[tag].categories.includes(categoryName)) {
                                    score+=1;
                                }
                            });
                            intrestCategories.list[name].disconnected.forEach((categoryName) => {
                                if(_list[tag].categories.includes(categoryName)) {
                                    score-=1;
                                }
                            });
                        });
                        connected[tag] = score;
                    } else {
                        connected[tag]-=3;
                    }
                }
            });
        }

        if(!allowNegativeScore) {
            Object.keys(connected).forEach((tag) => {
                if(connected[tag] <= 0) {
                    delete connected[tag];
                }
            });
        }

        return connected;
    },
    /**
     * @param {Array<INTREST_TAG>} intrestTags
     * @param {Boolean} [includeSameCategory = true]
     * @param {Boolean} [allowNegativeScore = true]
     * @returns {{[key in INTREST_TAG]?: Number}}
     */
    getConnectedIntrestsFromTagArray: (intrestTags, includeSameCategory = true, allowNegativeScore = true) => {
        /** @type {{[key in INTREST_TAG]?: Number}} */
        let connected = {};

        if(includeSameCategory) {
            /** @type {{[id: String]: Array<String>}} */
            let checkedCategories = {};

            intrestTags.forEach((intrestTag) => {
                let intrest = intrests.getIntrestByTag(intrestTag);

                intrest.categories.forEach((name) => {
                    if(typeof checkedCategories[name] == 'undefined') {
                        checkedCategories[name] = Object.keys(intrests.getIntrestsOfCategory(name));
                    }
                    checkedCategories[name].forEach((tag) => {
                        if(typeof connected[tag] == 'undefined') {
                            connected[tag] = 2;
                        } else {
                            connected[tag] += 2;
                        }
                    });
                    intrestCategories.list[name].connected.forEach((categoryName) => {
                        if(typeof checkedCategories[categoryName] == 'undefined') {
                            checkedCategories[categoryName] = Object.keys(intrests.getIntrestsOfCategory(categoryName));
                        }
                        checkedCategories[categoryName].forEach((tag) => {
                            if(typeof connected[tag] == 'undefined') {
                                connected[tag] = 1;
                            } else {
                                connected[tag]++;
                            }
                        });
                    });
                    intrestCategories.list[name].disconnected.forEach((categoryName) => {
                        if(typeof checkedCategories[categoryName] == 'undefined') {
                            checkedCategories[categoryName] = Object.keys(intrests.getIntrestsOfCategory(categoryName));
                        }
                        checkedCategories[categoryName].forEach((tag) => {
                            if(typeof connected[tag] == 'undefined') {
                                connected[tag] = -1;
                            } else {
                                connected[tag]--;
                            }
                        });
                    });
                });

                if(intrest.connected) {
                    intrest.connected.forEach((tag) => {
                        if(Object.keys(_list).includes(tag)) {
                            if(typeof connected[tag] == 'undefined') {
                                let score = 3;
                                intrest.categories.forEach((name) => {
                                    if(_list[tag].categories.includes(name)) {
                                        score+=2;
                                    }
                                    intrestCategories.list[name].connected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score+=1;
                                        }
                                    });
                                    intrestCategories.list[name].disconnected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score-=1;
                                        }
                                    });
                                });
                                connected[tag] = score;
                            } else {
                                connected[tag]+=3;
                            }
                        }
                    });
                }

                if(intrest.disconnected) {
                    intrest.disconnected.forEach((tag) => {
                        if(Object.keys(_list).includes(tag)) {
                            if(typeof connected[tag] == 'undefined') {
                                let score = 3;
                                intrest.categories.forEach((name) => {
                                    if(_list[tag].categories.includes(name)) {
                                        score+=2;
                                    }
                                    intrestCategories.list[name].connected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score+=1;
                                        }
                                    });
                                    intrestCategories.list[name].disconnected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score-=1;
                                        }
                                    });
                                });
                                connected[tag] = score;
                            } else {
                                connected[tag]-=3;
                            }
                        }
                    });
                }
            });
        } else {
            intrestTags.forEach((intrestTag) => {
                let intrest = intrests.getIntrestByTag(intrestTag);

                if(intrest.connected) {
                    intrest.connected.forEach((tag) => {
                        if(Object.keys(_list).includes(tag)) {
                            if(typeof connected[tag] == 'undefined') {
                                let score = 3;
                                intrest.categories.forEach((name) => {
                                    if(_list[tag].categories.includes(name)) {
                                        score+=2;
                                    }
                                    intrestCategories.list[name].connected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score+=1;
                                        }
                                    });
                                    intrestCategories.list[name].disconnected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score-=1;
                                        }
                                    });
                                });
                                connected[tag] = score;
                            } else {
                                connected[tag]+=3;
                            }
                        }
                    });
                }

                if(intrest.disconnected) {
                    intrest.disconnected.forEach((tag) => {
                        if(Object.keys(_list).includes(tag)) {
                            if(typeof connected[tag] == 'undefined') {
                                let score = 3;
                                intrest.categories.forEach((name) => {
                                    if(_list[tag].categories.includes(name)) {
                                        score+=2;
                                    }
                                    intrestCategories.list[name].connected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score+=1;
                                        }
                                    });
                                    intrestCategories.list[name].disconnected.forEach((categoryName) => {
                                        if(_list[tag].categories.includes(categoryName)) {
                                            score-=1;
                                        }
                                    });
                                });
                                connected[tag] = score;
                            } else {
                                connected[tag]-=3;
                            }
                        }
                    });
                }
            });
        }

        return connected;
    },
    /**
     * @param {Array<INTREST_TAG>} intrestTags
     * @param {INTREST_CATEGORY_NAME} intrestCategoryName
     * @returns {Boolean}
     */
    intrestsArrContainsCategory: (intrestTags, intrestCategoryName) => {
        for(let intrestTag of intrestTags) {
            if(_list[intrestTag]) {
                if(_list[intrestTag].categories.includes(intrestCategoryName)) {
                    return true;
                    break;
                }
            }
        }
        return false;
    },
    /**
     * @param {INTREST_TAG} intrestTag
     * @returns {INTREST}
     */
    getIntrestByTag: (intrestTag) => {
        if(intrests.list[intrestTag]) { //@ts-ignore
            return intrests.list[intrestTag];
        } else { //@ts-ignore
            return intrests.list[Object.keys(intrests.list)[0]];
        }
    },
    /**
     * @template {INTREST_TAG} T
     * @param {Array<T>} intrestTags
     * @returns {{[key in T]: INTREST}}
     */
    getIntrestsByTagsArr: (intrestTags) => {
        /** @type {{[key in T]: INTREST}} */ //@ts-ignore
        let obj = {};
        for(let intrest of intrestTags) {
            if(typeof obj[intrest] == 'undefined') {
                obj[intrest] = intrests.getIntrestByTag(intrest);
            }
        }
        return obj;
    },
    /**
     * @overload
     * @param {{[key in INTREST_TAG]?: Number}} connectedIntrests
     * @param {Number} [minValue]
     * @param {true} [addNonExistent=true]
     * @param {Number} [multiply=1]
     * @param {Number} [nonExistentStart=-3]
     * @returns {{[key in INTREST_TAG]: Number}}
     */
    /**
     * @overload
     * @param {{[key in INTREST_TAG]: Number}} connectedIntrests
     * @param {Number} [minValue=1]
     * @param {true} [addNonExistent=true]
     * @param {Number} [multiply=1]
     * @param {Number} [nonExistentStart=-3]
     * @returns {{[key in INTREST_TAG]: Number}}
     */
    /**
     * @template {INTREST_TAG} T
     * @param {{[key in T]: Number}} connectedIntrests
     * @param {Number} [minValue=1]
     * @param {Boolean} [addNonExistent=false]
     * @param {Number} [multiply=1]
     * @param {Number} [nonExistentStart=-3]
     * @returns {{[key in T]: Number}}
     */
    normalizeConnectedIntrests: (connectedIntrests, minValue = 1, addNonExistent = false, multiply = 1, nonExistentStart=-3) => {
        /** @type {{[key in T]: Number}} */ //@ts-ignore
        let obj = JSON.parse(JSON.stringify(connectedIntrests));

        let min = minValue + 0;
        Object.keys(obj).forEach((intrestTag) => {
            if(obj[intrestTag] < min) {
                min = obj[intrestTag] + 0;
            }
        });

        if(addNonExistent) {
            Object.keys(_list).forEach((tag) => {
                if(!Object.keys(connectedIntrests).includes(tag)) {
                    obj[tag] = min + nonExistentStart;
                }
            });
            if(min + nonExistentStart < min) {
                min = min + nonExistentStart;
            }
        }

        if(min < minValue) {
            let diff = minValue - min;

            Object.keys(obj).forEach((intrestTag) => {
                obj[intrestTag] = (obj[intrestTag] + diff) * multiply;
            });
        } else if(multiply > 1) {
            Object.keys(obj).forEach((key) => {
                obj[key] = obj[key] * multiply;
            });
        }

        return obj;
    },
    /**
     * @param {{[key in INTREST_TAG]?: Number}} connectedIntrests
     * @param {INTREST_CATEGORY_NAME} categoryName
     * @returns {{[key in INTREST_TAG]?: Number}}
     */
    filterConnectedIntrestsByCategory: (connectedIntrests, categoryName) => {
        /** @type {{[key in INTREST_TAG]?: Number}} */
        let obj = {};

        Object.keys(connectedIntrests).forEach((name) => { //@ts-ignore
            let intrest = intrests.getIntrestByTag(name);
            if(intrest.categories.includes(categoryName)) {
                obj[name] = connectedIntrests[name];
            }
        });

        return obj;
    },
    /**
     * @returns {INTREST_TAG}
     */
    getRandomIntrest: () => { //@ts-ignore
        return Utils.getRandomArrayElement(Object.keys(_list));
    }
}

delete intrests.list;
Object.defineProperty(intrests, 'list', {
    set: () => {},
    get: () => {
        return _list;
    },
    enumerable: true
});

export { intrests, intrestCategories };