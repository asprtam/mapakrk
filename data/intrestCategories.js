/**
 * @typedef {keyof typeof _list} INTREST_CATEGORY_NAME
 */

const _list = {
    "artforms": {
        name: "Formy sztuki",
        connected: ['literature'],
        disconnected: []
    },
    "rightActivism": {
        name: "prawicowy aktywizm",
        connected: [],
        disconnected: ['leftActivism', 'drugs']
    },
    "leftActivism": {
        name: "lewicowy aktywizm",
        connected: [],
        disconnected: ['rightActivism']
    },
    "literature": {
        name: "literatura",
        connected: ['artforms', 'socialTopics'],
        disconnected: []
    },
    "internetCulture": {
        name: "kultura internetowa",
        connected: ['tech'],
        disconnected: []
    },
    "tech": {
        name: "technologia",
        connected: ['internetCulture'],
        disconnected: []
    },
    "history": {
        name: "historia",
        connected: ['socialTopics', 'rightActivism', 'leftActivism'],
        disconnected: []
    },
    "streetCulture": {
        name: "kultura uliczna",
        connected: ['drugs'],
        disconnected: []
    },
    "clubCulture": {
        name: "kultura klubowa",
        connected: ['drugs'],
        disconnected: []
    },
    "drugs": {
        name: "używki",
        connected: ['clubCulture', 'streetCulture'],
        disconnected: [],
    },
    "socialTopics": {
        name: "Tematy społeczne",
        connected: ['drugs', 'internetCulture', 'leftActivism', 'rightActivism', 'clubCulture', 'streetCulture', 'history', 'literature'],
        disconnected: []
    }
}

Object.keys(_list).forEach((tag) => {
    if(typeof _list[tag].connected == 'undefined') {
        _list[tag].connected = [];
    }
    if(typeof _list[tag].disconnected == 'undefined') {
        _list[tag].disconnected = [];
    }
    // _list[tag].connected.forEach((_tag) => {
    //     if(typeof _list[_tag].connected == 'undefined') {
    //         _list[_tag].connected = [];
    //     }
    //     if(!_list[_tag].connected.includes(tag)) {
    //         _list[_tag].connected.push(tag);
    //     }
    // });
    // _list[tag].disconnected.forEach((_tag) => {
    //     if(typeof _list[_tag].disconnected == 'undefined') {
    //         _list[_tag].disconnected = [];
    //     }
    //     if(!_list[_tag].disconnected.includes(tag)) {
    //         _list[_tag].disconnected.push(tag);
    //     }
    // });
});

/**
 * @typedef {Object} INTEREST_CATEGORY
 * @property {String} name
 * @property {Array<INTREST_CATEGORY_NAME>} connected
 * @property {Array<INTREST_CATEGORY_NAME>} disconnected
 */

const intrestCategories = {
    /** @type {{[id: String]: INTEREST_CATEGORY}} */
    list: {}
};

delete intrestCategories.list;
Object.defineProperty(intrestCategories, 'list', {
    set: () => {},
    get: () => {
        return _list;
    },
    enumerable: true
});

export { intrestCategories };