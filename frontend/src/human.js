/** @typedef {import("../../simulation/simulation").TICK_HUMAN_DATA} TICK_HUMAN_DATA */
/** @typedef {import("../../simulation/simulation").TICK_DATA} TICK_DATA */
/** @typedef {import("../../simulation/simulation").HUMAN_STATUS_SOCKET_MESSAGE} HUMAN_STATUS_SOCKET_MESSAGE */
/** @typedef {import("../../simulation/entites").HUMAN_ACTION} HUMAN_ACTION */
/** @typedef {import("../../simulation/entites").HUMAN_DATA} HUMAN_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_TARGET_TYPE} HUMAN_TARGET_TYPE */
/** @typedef {import("../../simulation/entites").HUMAN_ATTRIBUTES} HUMAN_ATTRIBUTES */
/** @typedef {import("../../simulation/entites").HUMAN_STATUSES} HUMAN_STATUSES */
/** @typedef {import("../../simulation/entites").HUMAN_FRIEND_DATA} HUMAN_FRIEND_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_FRIENDS_LIST} HUMAN_FRIENDS_LIST */
/** @typedef {import("../../index").SPRITE} SPRITE */
/** @typedef {import("../../data/intrests").INTREST_CATEGORY_NAME} INTREST_CATEGORY_NAME */
/** @typedef {import("../../data/intrests").INTREST_TAG} INTREST_TAG */
/** @typedef {import("./app").App} App */
import { colors } from "./colors";
import { Utils } from "./utils";
import { DisplayWindow } from "./window";
import { localisation } from "./localisation";

/** @type {Array<keyof HUMAN_ATTRIBUTES>} */
const attriburesList = ['physical', 'social', 'intelligence'];
/** @type {Array<keyof HUMAN_STATUSES>} */
const statusList = ['boredom', 'fatigue'];

/**
 * @typedef {Object} INFO_VALUES
 * @property {HTMLElement} cont
 * @property {HTMLElement} name
 * @property {HTMLElement} value
 */

/**
 * @typedef {Object} INFO_VALUES_AGE
 * @property {HTMLElement} cont
 * @property {HTMLElement} name
 * @property {HTMLElement} value
 * @property {HTMLElement} suffix
 */

class DisplayedHumanStatusWindow {
    /** @type {DisplayedHuman} */
    human;
    /** @type {DisplayWindow} */
    windowEl;
    /** @type {HTMLElement} */
    windowContent;
    /** @type {HTMLElement} */
    basicInfoCont;
    /** @type {HTMLElement} */
    basicInfoName;
    /** @type {HTMLElement} */
    basicInfoAction;
    /** @type {HTMLElement} */
    basicInfoSubCont;
    /** @type {{age: INFO_VALUES_AGE, gender: INFO_VALUES}} */ //@ts-ignore
    basicInfoValues = {
        age: {
            cont: Utils.createHTMLElement('div', ['valueCont', 'age']),
            name: Utils.createHTMLElement('h3', ['name'], {}, `${localisation.infoNames.age}:`),
            value: Utils.createHTMLElement('span', ['value']),
            suffix: Utils.createHTMLElement('span', ['suffix'])
        },
        gender: {
            cont: Utils.createHTMLElement('div', ['valueCont', 'gender']),
            name: Utils.createHTMLElement('h3', ['name'], {}, `${localisation.infoNames.gender}:`),
            value: Utils.createHTMLElement('div', ['genderIcon'])
        }
    };
    extendedInfoCont = Utils.createHTMLElement('div');
    intrestsCont = Utils.createHTMLElement('div');
    /** @type {{[id: String]: HTMLElement}} */
    intrestsValues = {};
    /** @type {HTMLElement} */
    attributesCont = Utils.createHTMLElement('div', ['attributes'], {}, `<h2>${localisation.attributes}</h2>`);
    /** @type {{[key in keyof HUMAN_ATTRIBUTES]: INFO_VALUES}} */ //@ts-ignore
    attributesValues = {};
    /** @type {HTMLElement} */
    statusesCont = Utils.createHTMLElement('div', ['statuses'], {}, `<h2>${localisation.statuses}</h2>`);
    /** @type {{[key in keyof HUMAN_STATUSES]: INFO_VALUES}} */ //@ts-ignore
    statusesValues = {};
    /** @type {Boolean} */
    pinPermanently = false;
    targetHasClickEvent = false;
    onClickAction = () => {
        if(this.human.action == 'walking' || this.human.action == 'in hospitality') {
            if(typeof this.human.target == 'number' && this.human.parent.plots[this.human.target]) {
                this.human.parent.plots[this.human.target].handleClick();
            }
        }
    }

    updateAction = () => {
        switch(this.human.action) {
            case "in home": {
                if(!this.basicInfoAction.classList.contains('inHome')) {
                    this.basicInfoAction.classList.add('inHome');
                }
                ['walking', 'meeting', 'inHospitality'].forEach((className) => {
                    if(this.basicInfoAction.classList.contains(className)) {
                        this.basicInfoAction.classList.remove(className);
                    }
                });
                if(typeof this.human.target == 'number' && this.human.parent.plots[this.human.target]) {
                    if(this.basicInfoAction.innerHTML !== `w <span class="location">domu <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`) {
                        this.basicInfoAction.innerHTML = `w <span class="location">domu <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`
                    }
                } else {
                    if(this.basicInfoAction.innerHTML !== `w <span class="location">domu</span>`) {
                        this.basicInfoAction.innerHTML = `w <span class="location">domu</span>`;
                    }
                }
                if(this.basicInfoAction.classList.contains('clickable')) {
                    this.basicInfoAction.classList.remove('clickable');
                }
                if(this.targetHasClickEvent) {
                    this.targetHasClickEvent = false;
                    this.basicInfoAction.removeEventListener('click', this.onClickAction);
                }
                break;
            }
            case "walking": {
                if(!this.basicInfoAction.classList.contains('walking')) {
                    this.basicInfoAction.classList.add('walking');
                }
                ['inHome', 'meeting', 'inHospitality'].forEach((className) => {
                    if(this.basicInfoAction.classList.contains(className)) {
                        this.basicInfoAction.classList.remove(className);
                    }
                });
                if(this.human.targetType == 'home') {
                    if(typeof this.human.target == 'number' && this.human.parent.plots[this.human.target]) {
                        if(this.basicInfoAction.innerHTML !== `idzie do <span class="location">domu <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`) {
                            this.basicInfoAction.innerHTML = `idzie do <span class="location">domu <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`;
                        }
                    } else {
                        if(this.basicInfoAction.innerHTML !== `idzie do <span class="location">domu</span>`) {
                            this.basicInfoAction.innerHTML = `idzie do <span class="location">domu</span>`;
                        }
                    }
                    if(this.basicInfoAction.classList.contains('clickable')) {
                        this.basicInfoAction.classList.remove('clickable');
                    }
                    if(this.targetHasClickEvent) {
                        this.targetHasClickEvent = false;
                        this.basicInfoAction.removeEventListener('click', this.onClickAction);
                    }
                } else {
                    if(typeof this.human.target == 'number' && this.human.parent.plots[this.human.target]) {
                        if(this.basicInfoAction.innerHTML !== `idzie do <span class="location">${this.human.parent.plots[this.human.target].name} <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`) {
                            this.basicInfoAction.innerHTML = `idzie do <span class="location">${this.human.parent.plots[this.human.target].name} <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`;
                        }
                    } else {
                        if(this.basicInfoAction.innerHTML !== `idzie do <span class="location">${this.human.target}</span>`) {
                            this.basicInfoAction.innerHTML = `idzie do <span class="location">${this.human.target}</span>`;
                        }
                    }
                    if(!this.basicInfoAction.classList.contains('clickable')) {
                        this.basicInfoAction.classList.add('clickable');
                    }
                    if(!this.targetHasClickEvent) {
                        this.targetHasClickEvent = true;
                        this.basicInfoAction.addEventListener('click', this.onClickAction);
                    }
                }
                break;
            }
            case "meeting": {
                if(!this.basicInfoAction.classList.contains('meeting')) {
                    this.basicInfoAction.classList.add('meeting');
                }
                ['walking', 'inHome', 'inHospitality'].forEach((className) => {
                    if(this.basicInfoAction.classList.contains(className)) {
                        this.basicInfoAction.classList.remove(className);
                    }
                });
                if(this.basicInfoAction.innerHTML !== 'spotyka się') {
                    this.basicInfoAction.innerHTML = 'spotyka się';
                }
                if(this.basicInfoAction.classList.contains('clickable')) {
                    this.basicInfoAction.classList.remove('clickable');
                }
                if(this.targetHasClickEvent) {
                    this.targetHasClickEvent = false;
                    this.basicInfoAction.removeEventListener('click', this.onClickAction);
                }
                break;
            }
            case "in hospitality": {
                if(!this.basicInfoAction.classList.contains('inHospitality')) {
                    this.basicInfoAction.classList.add('inHospitality');
                }
                ['walking', 'inHome', 'meeting'].forEach((className) => {
                    if(this.basicInfoAction.classList.contains(className)) {
                        this.basicInfoAction.classList.remove(className);
                    }
                });
                if(typeof this.human.target == 'number' && this.human.parent.plots[this.human.target]) {
                    if(this.basicInfoAction.innerHTML !== `w <span class="location">${this.human.parent.plots[this.human.target].name} <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`) {
                        this.basicInfoAction.innerHTML = `w <span class="location">${this.human.parent.plots[this.human.target].name} <span class="location-adress">(${this.human.parent.plots[this.human.target].adress})</span></span>`;
                    }
                } else {
                    if(this.basicInfoAction.innerHTML !== `w <span class="location">${this.human.target}</span>`) {
                        this.basicInfoAction.innerHTML = `w <span class="location">${this.human.target}</span>`;
                    }
                }
                if(!this.basicInfoAction.classList.contains('clickable')) {
                    this.basicInfoAction.classList.add('clickable');
                }
                if(!this.targetHasClickEvent) {
                    this.targetHasClickEvent = true;
                    this.basicInfoAction.addEventListener('click', this.onClickAction);
                }
                break;
            }
        }
    }

    /**
     * @param {HUMAN_STATUS_SOCKET_MESSAGE} data 
     */
    updateStatuses = (data) => {
        Object.keys(data.status).forEach((statusName) => {
            if(this.statusesValues[statusName]) {
                this.statusesValues[statusName].value.style.setProperty('--percent', `${Math.floor(data.status[statusName]/10)}%`);
                this.statusesValues[statusName].value.innerHTML = `${Math.floor(data.status[statusName]/10)}`;
            }
        });
        if(data.intrests) {
            for(let key of Object.keys(this.intrestsValues)) { //@ts-ignore
                if(!data.intrests.includes(key)) {
                    this.intrestsValues[key].remove();
                    delete this.intrestsValues[key];
                }
            }
            for(let intrestTag of data.intrests) {
                if(typeof this.intrestsValues[intrestTag] == 'undefined') {
                    this.intrestsValues[intrestTag] = Utils.createAndAppendHTMLElement(this.intrestsCont, 'div', ['intrest', intrestTag], {}, `${this.human.parent.intrestsData.intrests[intrestTag].name}`);
                }
            }
        }
    }

    /**
     * @param {DisplayedHuman} human 
     */
    constructor(human) {
        this.human = human;
        this.human.pinned = true;
        this.windowContent = Utils.createHTMLElement('div', ['content']);
        this.basicInfoCont = Utils.createAndAppendHTMLElement(this.windowContent, 'div', ['basicInfo']);
        this.basicInfoName = Utils.createAndAppendHTMLElement(this.basicInfoCont, 'h1');
        this.basicInfoName.innerHTML = `${this.human.name} ${this.human.lastName}`;
        this.basicInfoAction = Utils.createAndAppendHTMLElement(this.basicInfoCont, 'div', ['action']);
        this.basicInfoSubCont = Utils.createAndAppendHTMLElement(this.basicInfoCont, 'div', ['subCont']);

        this.basicInfoValues.age.value.innerHTML = `${this.human.age}`;
        if(this.human.age <= 21 || this.human.age%2 == 1 || this.human.age%10 == 0 || this.human.age%10 >= 8) {
            this.basicInfoValues.age.suffix.innerHTML = 'lat';
        } else {
            this.basicInfoValues.age.suffix.innerHTML = 'lata';
        }
        this.basicInfoSubCont.appendChild(this.basicInfoValues.age.cont);
        this.basicInfoValues.age.cont.appendChild(this.basicInfoValues.age.name);
        this.basicInfoSubCont.appendChild(this.basicInfoValues.gender.cont);
        this.basicInfoValues.gender.cont.append(this.basicInfoValues.gender.name);
        this.basicInfoValues.gender.value.classList.add(`${this.human.gender}`);
        switch(this.human.gender) {
            case "male": {
                this.basicInfoValues.gender.value.innerHTML = '♂';
                break;
            }
            case "female": {
                this.basicInfoValues.gender.value.innerHTML = '♀';
                break;
            }
            case "other": {
                this.basicInfoValues.gender.value.innerHTML = '⚧';
                break;
            }
        }
        this.basicInfoValues.gender.cont.append(this.basicInfoValues.gender.value);
        const ageH3 = Utils.createAndAppendHTMLElement(this.basicInfoValues.age.cont, 'h3');
        ageH3.appendChild(this.basicInfoValues.age.value);
        ageH3.appendChild(this.basicInfoValues.age.suffix);

        attriburesList.forEach((attributeName) => {
            let obj = {};
            obj.cont = Utils.createAndAppendHTMLElement(this.attributesCont, 'div', ['valueCont', `${attributeName}`]);
            obj.name = Utils.createAndAppendHTMLElement(obj.cont, 'h3', ['name'], {}, `${localisation.attributeNames[attributeName]}:`);
            obj.value = Utils.createAndAppendHTMLElement(obj.cont, 'h4', ['attribute'], {css: {'--percent': `${this.human.attributes[attributeName]}%`}}, `${this.human.attributes[attributeName]}`);
            this.attributesValues[attributeName] = obj;
        });

        statusList.forEach((statusName) => {
            let obj = {};
            obj.cont = Utils.createAndAppendHTMLElement(this.statusesCont, 'div', ['valueCont', `${statusName}`]);
            obj.name = Utils.createAndAppendHTMLElement(obj.cont, 'h3', ['name'], {}, `${localisation.statusNames[statusName]}:`);
            obj.value = Utils.createAndAppendHTMLElement(obj.cont, 'h4', ['status']);
            this.statusesValues[statusName] = obj;
        });

        this.extendedInfoCont = Utils.createAndAppendHTMLElement(this.windowContent, 'div', ['extendedInfo']);
        this.extendedInfoCont.appendChild(this.attributesCont);
        this.extendedInfoCont.appendChild(this.statusesCont);
        const intrestCont = Utils.createAndAppendHTMLElement(this.extendedInfoCont, 'div', ['intrests']);
        Utils.createAndAppendHTMLElement(intrestCont, 'h2', [], {}, localisation.intrests);
        this.intrestsCont = Utils.createAndAppendHTMLElement(intrestCont, 'div', ['intrestsList']);

        this.windowEl = new DisplayWindow(this.windowContent, {
            className: ['humanStatus', 'open'], 
            id: `humanStatus-${this.human.id}`,
            name: `${this.human.name} ${this.human.lastName}`,
            type: `humanStatus-window`,
            behaviour: {minimize: false, fullscreen: false, close: true},
            size: {width: 400, height: 500},
            pos: {x: (window.innerWidth/2) - 200, y: (window.innerHeight/2) - 250}
        });
        this.windowEl.onClose = () => {
            return new Promise((res) => {
                this.human.parent.removeInfoWindow(this.windowEl);
                this.human.statusWindow = null;
                this.human.parent.socket.send(`humanStatusRevoke-${this.human.id}`);
                if(!this.pinPermanently) {
                    this.human.pinned = false;
                }
                res(true);
            });
        }
        this.human.parent.appCont.append(this.windowEl.window);
        this.human.parent.addInfoWindow(this.windowEl);
        this.updateAction();
        let waitTime = Utils.getTransitionTime(this.windowEl.window);
        setTimeout(() => {
            if(this.windowEl.window.classList.contains('open')) {
                this.windowEl.window.classList.remove('open');
            }
            this.human.parent.focusInfoWindow(this.windowEl);
            this.windowEl.window.addEventListener('pointerdown', () => {
                this.human.parent.focusInfoWindow(this.windowEl);
            });
        }, waitTime);
    }
}

class DisplayedHuman {
    /** @type {Number} */
    tooltipTimeout = 1000;
    #tooltipTimerClass = null;
    #tooltipTimerDeletion = null;
    /** @type {App} */
    parent;
    /** @type {Number} */
    id;
    /** @type {{x: Number, y: Number}} */
    pos = {x: 0, y: 0};
    /** @type {{x: Number, y: Number}} */
    lastPos = {x: 0, y: 0};
    /** @type {{x: Number, y: Number}} */
    renderedPos = {x: 0, y: 0};
    /** @type {{x: Number, y: Number}} */

    /** @type {HUMAN_ACTION} */
    action;
    /** @type {HUMAN_TARGET_TYPE} */
    #targetType = 'home';
    get targetType() {
        return this.#targetType;
    }
    /** @type {Number|Null} */
    #target = null;
    get target() {
        return this.#target;
    }
    /** @type {String} */
    #name;
    get name() {
        return this.#name;
    }
    /** @type {Number} */
    #age;
    get age() {
        return this.#age;
    }
    /** @type {('male'|'female'|'other')} */
    #gender;
    get gender() {
        return this.#gender;
    }
    /** @type {String} */
    #lastName;
    get lastName() {
        return this.#lastName;
    }
    /** @type {HUMAN_ATTRIBUTES} */
    #attributes;
    get attributes() {
        return this.#attributes;
    }
    /** @type {{data: HUMAN_DATA}} */ //@ts-ignore
    #temp = {};
    /** @type {DisplayedHumanStatusWindow|null} */
    statusWindow = null;

    handleClick = () => {
        this.getData().then(() => {
            if(this.statusWindow === null) {
                this.parent.socket.send(`humanStatus-${this.id}`);
                this.statusWindow = new DisplayedHumanStatusWindow(this);
            }
        });
    }

    /**
     * @param {HUMAN_STATUS_SOCKET_MESSAGE} data 
     */
    updateStatuses = (data) => {
        if(this.statusWindow) {
            this.statusWindow.updateStatuses(data);
        }
    }

    /** @type {*|Null|Number} */
    deleteDataTimer = null;

    stopDeleteDataTimer = () => {
        if(this.deleteDataTimer) {
            clearTimeout(this.deleteDataTimer);
            this.deleteDataTimer = null;
        }
    }

    startDeleteDataTimer = () => {
        this.stopDeleteDataTimer();
        this.deleteDataTimer = setTimeout(() => {
            this.deleteData();
        }, 60000);
    }

    deleteData = () => {
        if(this.#temp.data) {
            delete this.#temp.data;
        }
        if(this.deleteDataTimer) {
            clearTimeout(this.deleteDataTimer);
            this.deleteDataTimer = null;
        }
    }

    /** @type {Boolean} */
    #hovered = false;
    get hovered() {
        return this.#hovered;
    }

    /** @type {HTMLElement} */
    #hoverToolTip;
    /** @type {HTMLElement} */
    #hoverToolTipName;
    /** @type {HTMLElement} */
    #hoverToolTipAction;
    /** @type {Boolean} */
    #hoverToolTipClosing = false;
    /** @type {String} */
    #currentTooltipUniqueId = '';

    /** @type {Boolean} */
    #pinned = false;
    /** @type {Boolean} */
    get pinned() {
        return this.#pinned;
    }
    /** @type {Boolean} */
    set pinned(val) {
        if(this.#tooltipTimerClass) {
            clearTimeout(this.#tooltipTimerClass);
            this.#tooltipTimerClass = null;
        }
        if(this.#tooltipTimerDeletion) {
            clearTimeout(this.#tooltipTimerDeletion);
            this.#tooltipTimerDeletion = null;
        }
        if(val) {
            if(!this.#pinned) {
                this.#pinned = true;
                if(!this.parent.pinnedHumanIds.includes(this.id)) {
                    this.parent.pinnedHumanIds.push(this.id);
                }
            }
            this.showToolTip();
            this.stopDeleteDataTimer();
        } else {
            if(this.#pinned) {
                this.#pinned = false;
                let indexof = this.parent.pinnedHumanIds.indexOf(this.id);
                if(indexof >= 0) {
                    this.parent.pinnedHumanIds = this.parent.pinnedHumanIds.slice(0, indexof).concat(this.parent.pinnedHumanIds.slice(indexof + 1))
                }
            }
            if(this.#hoverToolTip) {
                if(this.#hoverToolTip.classList.contains('pinned')) {
                    this.#hoverToolTip.classList.remove('pinned');
                }
            }
            this.hideToolTip(true);
        }
    }

    updateTooltipPos = () => {
        if(this.#hoverToolTip) {
            let left = (this.renderedPos.x * (this.parent.currentMapDisplayScale / 1000)) + this.parent.mapCut.x;
            if(left + this.#hoverToolTip.offsetWidth >= this.parent.tooltipsCont.offsetWidth) {
                if(!this.#hoverToolTip.classList.contains('reversed')) {
                    this.#hoverToolTip.classList.add('reversed');
                }
            } else {
                if(this.#hoverToolTip.classList.contains('reversed')) {
                    this.#hoverToolTip.classList.remove('reversed');
                }
            }
            this.#hoverToolTip.style.setProperty('left', `${left}px`);
            this.#hoverToolTip.style.setProperty('top', `${(this.renderedPos.y * (this.parent.currentMapDisplayScale / 1000)) + this.parent.mapCut.y}px`);
        }
    }

    updateTooltipAction = () => {
        if(this.#hoverToolTipAction) {
            switch(this.action) {
                case "in home": {
                    if(!this.#hoverToolTipAction.classList.contains('inHome')) {
                        this.#hoverToolTipAction.classList.add('inHome');
                    }
                    ['walking', 'meeting', 'inHospitality'].forEach((className) => {
                        if(this.#hoverToolTipAction.classList.contains(className)) {
                            this.#hoverToolTipAction.classList.remove(className);
                        }
                    });
                    // if(typeof this.#target == 'number' && this.parent.plots[this.#target]) {
                    //     this.#hoverToolTipAction.innerHTML = `w <span class="location">domu <span="location-adress">(${this.parent.plots[this.#target].adress})</span></span>`;
                    // } else {
                    //     this.#hoverToolTipAction.innerHTML = `w <span class="location">domu</span>`;
                    // }
                    this.#hoverToolTipAction.innerHTML = `w <span class="location">domu</span>`;
                    break;
                }
                case "walking": {
                    if(!this.#hoverToolTipAction.classList.contains('walking')) {
                        this.#hoverToolTipAction.classList.add('walking');
                    }
                    ['inHome', 'meeting', 'inHospitality'].forEach((className) => {
                        if(this.#hoverToolTipAction.classList.contains(className)) {
                            this.#hoverToolTipAction.classList.remove(className);
                        }
                    });
                    if(this.#targetType == 'home') {
                        // if(typeof this.#target == 'number' && this.parent.plots[this.#target]) {
                        //     this.#hoverToolTipAction.innerHTML = `idzie do <span class="location">domu <span="location-adress">(${this.parent.plots[this.#target].adress})</span></span>`;
                        // } else {
                        //     this.#hoverToolTipAction.innerHTML = `idzie do <span class="location">domu</span>`;
                        // }
                        this.#hoverToolTipAction.innerHTML = `idzie do <span class="location">domu</span>`;
                    } else {
                        if(typeof this.#target == 'number' && this.parent.plots[this.#target]) {
                            this.#hoverToolTipAction.innerHTML = `idzie do <span class="location">${this.parent.plots[this.#target].name}</span>`;
                        } else {
                            this.#hoverToolTipAction.innerHTML = `idzie do <span class="location">${this.#target}</span>`;
                        }
                    }
                    break;
                }
                case "meeting": {
                    if(!this.#hoverToolTipAction.classList.contains('meeting')) {
                        this.#hoverToolTipAction.classList.add('meeting');
                    }
                    ['walking', 'inHome', 'inHospitality'].forEach((className) => {
                        if(this.#hoverToolTipAction.classList.contains(className)) {
                            this.#hoverToolTipAction.classList.remove(className);
                        }
                    });
                    this.#hoverToolTipAction.innerHTML = 'spotyka się';
                    break;
                }
                case "in hospitality": {
                    if(!this.#hoverToolTipAction.classList.contains('inHospitality')) {
                        this.#hoverToolTipAction.classList.add('inHospitality');
                    }
                    ['walking', 'inHome', 'meeting'].forEach((className) => {
                        if(this.#hoverToolTipAction.classList.contains(className)) {
                            this.#hoverToolTipAction.classList.remove(className);
                        }
                    });
                    if(typeof this.target == 'number' && this.parent.plots[this.#target]) {
                        this.#hoverToolTipAction.innerHTML = `w <span class="location">${this.parent.plots[this.#target].name}</span>`;
                    } else {
                        this.#hoverToolTipAction.innerHTML = `w <span class="location">${this.#target}</span>`;
                    }
                    break;
                }
            }
        }
        if(this.statusWindow) {
            this.statusWindow.updateAction();
        }
    }

    /** @param {Boolean} [forceInstant=false] */
    hideToolTip = (forceInstant=false) => {
        const hideFuncRest = () => {
            /** @type {Array<HTMLElement>} */
            let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"]`));
            hoverToolTips.forEach((el) => {
                let unqId = el.getAttribute('data-id');
                if(unqId) {
                    if(unqId !== this.#currentTooltipUniqueId) {
                        el.remove();
                    } else {
                        if(this.#hoverToolTip == undefined || this.#hoverToolTip == null) {
                            this.#hoverToolTip = el;
                        }
                    }
                } else {
                    el.remove();
                }
            });
        };
        hideFuncRest();

        if(!this.#tooltipTimerDeletion) {
            let waitTime = 0;
            if(this.#hoverToolTip) {
                if(!this.#hoverToolTip.classList.contains('close')) {
                    this.#hoverToolTip.classList.add('close');
                }
                waitTime = Utils.getTransitionTime(this.#hoverToolTip);
            }
            this.#tooltipTimerDeletion = setTimeout(() => {
                if(this.#hoverToolTipName) {
                    this.#hoverToolTipName.remove();
                    this.#hoverToolTipName = undefined;
                }
                if(this.#hoverToolTip) {
                    this.#hoverToolTip.remove();
                    this.#hoverToolTip = undefined;
                }
                this.#tooltipTimerDeletion = undefined;
                this.#hoverToolTipClosing = false;
                this.#currentTooltipUniqueId = '';
                hideFuncRest();
            }, waitTime);
        }
    }

    getData = () => {
        return new Promise(async (res) => {
            if(typeof this.#name == 'undefined' || typeof this.#lastName == 'undefined') {
                if(typeof this.#temp.data == 'undefined') {
                    this.#temp.data = await this.parent.getHumanData(this.id);
                }
                this.#name = `${this.#temp.data.info.name}`;
                this.#lastName = `${this.#temp.data.info.lastname}`;
                this.#attributes = JSON.parse(JSON.stringify(this.#temp.data.attributes));
                this.#age = this.#temp.data.info.age + 0;
                this.#gender = `${this.#temp.data.info.gender}`;
            }
            res(true);
        });
    }

    showToolTip = async () => {
        if(this.#tooltipTimerClass) {
            clearTimeout(this.#tooltipTimerClass);
            this.#tooltipTimerClass = null;
        }
        if(this.#tooltipTimerDeletion) {
            clearTimeout(this.#tooltipTimerDeletion);
            this.#tooltipTimerDeletion = null;
        }
        if(this.#hoverToolTip == undefined || this.#hoverToolTip == null) {
            /** @type {Array<HTMLElement>} */
            let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"]`));
            if(hoverToolTips.length > 0) {
                this.#hoverToolTip = hoverToolTips[hoverToolTips.length - 1];
                if(this.#hoverToolTip.classList.contains('close')) {
                    this.#hoverToolTip.classList.remove('close');
                }
                this.#currentTooltipUniqueId = this.#hoverToolTip.getAttribute('data-id');
                if(!this.#currentTooltipUniqueId) {
                    this.#currentTooltipUniqueId = Utils.makeId(10);
                    this.#hoverToolTip.setAttribute('data-id', this.#currentTooltipUniqueId);
                } else if(this.#currentTooltipUniqueId.trim() == '') {
                    this.#currentTooltipUniqueId = Utils.makeId(10);
                    this.#hoverToolTip.setAttribute('data-id', this.#currentTooltipUniqueId);
                }
                hoverToolTips = hoverToolTips.slice(0, -1);
                hoverToolTips.forEach((el) => {
                    el.remove();
                });
                await this.getData();
                if(this.#pinned) {
                    if(!this.#hoverToolTip.classList.contains('pinned')) {
                        this.#hoverToolTip.classList.add('pinned');
                    }
                } else {
                    if(!this.#hoverToolTip.classList.contains('pinned')) {
                        this.#hoverToolTip.classList.remove('pinned');
                    }
                }
                /** @type {HTMLElement} */
                let hoverToolTipInner = document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"] .content`);
                if(hoverToolTipInner == null || hoverToolTipInner == undefined) {
                    hoverToolTipInner = Utils.createAndAppendHTMLElement(this.#hoverToolTip, 'div', ['content']);
                    this.#hoverToolTipName = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['name'], {}, `<span class="firstname">${this.#name}</span> <span class="lastname">${this.#lastName}</span>`);
                    this.#hoverToolTipAction = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['action']);
                    this.updateTooltipAction();
                } else {
                    this.#hoverToolTipName = document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"] .content .name`);
                    if(this.#hoverToolTipName == null || this.#hoverToolTipName == undefined) {
                        this.#hoverToolTipName = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['name'], {}, `<span class="firstname">${this.#name}</span> <span class="lastname">${this.#lastName}</span>`);
                    }
                    this.#hoverToolTipAction = document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"] .content .name`);
                    if(this.#hoverToolTipAction == null || this.#hoverToolTipAction == undefined) {
                        this.#hoverToolTipAction = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['action']);
                    }
                    this.updateTooltipAction();
                }
            } else {
                await this.getData();
                const classArr = ['tooltip'];
                if(this.#pinned) {
                    classArr.push('pinned');
                }
                this.#currentTooltipUniqueId = Utils.makeId(10);
                this.#hoverToolTip = Utils.createHTMLElement('div', classArr, {attibutes: {'id': `tooltipHuman-${this.id}`, 'data-id': this.#currentTooltipUniqueId}}, '<div class="face"><div class="bg"></div><div class="arrow"></div></div>');
                const hoverToolTipInner = Utils.createAndAppendHTMLElement(this.#hoverToolTip, 'div', ['content']);
                this.#hoverToolTipName = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['name'], {}, `<span class="firstname">${this.#name}</span> <span class="lastname">${this.#lastName}</span>`);
                this.#hoverToolTipAction = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['action']);
                this.updateTooltipAction();
                this.parent.tooltipsCont.appendChild(this.#hoverToolTip);
            }
        } else {
            /** @type {Array<HTMLElement>} */
            let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipHuman-${this.id}"]`));
            hoverToolTips.forEach((el) => {
                let unqId = el.getAttribute('data-id');
                if(unqId) {
                    if(unqId !== this.#currentTooltipUniqueId) {
                        el.remove();
                    }
                } else {
                    el.remove();
                }
            });
            if(this.#hoverToolTip.classList.contains('close')) {
                this.#hoverToolTip.classList.remove('close');
            }
            if(this.#pinned) {
                if(!this.#hoverToolTip.classList.contains('pinned')) {
                    this.#hoverToolTip.classList.add('pinned');
                }
            } else {
                if(this.#hoverToolTip.classList.contains('pinned')) {
                    this.#hoverToolTip.classList.remove('pinned');
                }
            }
            this.updateTooltipAction();
        }
        this.updateTooltipPos();
        // if(!this.#pinned) {
        //     this.hideToolTip();
        // }
    }

    hover = () => {
        this.#hovered = true;
        this.showToolTip();
    }

    /** @param {Boolean} [forceInstant=false] */
    unHover = (forceInstant=false) => {
        if(this.#pinned) {
            this.#hovered = false;
        } else {
            this.hideToolTip(forceInstant);
        }
    }

    /**
     * @param {{x: Number, y: Number}} point0
     * @param {{x: Number, y: Number}} point1
     * @param {Number} factor
     * @returns {{x: Number, y: Number}}
     */
    getBetweenPoint = (point0, point1, factor) => {
        switch(factor) {
            case 0: {
                return point0;
                break;
            }
            case 1: {
                return point1;
                break;
            }
            default: {
                if(point0.x == point1.x) {
                    let desiredDistance = (Math.max(point0.y, point1.y) - Math.min(point0.y, point1.y)) * factor;
                    if(point0.y < point1.y) {
                        return {x: point0.x, y: point0.y + desiredDistance};
                    } else {
                        return {x: point0.x, y: point0.y - desiredDistance};
                    }
                } else if(point0.y == point1.y) {
                    let desiredDistance = (Math.max(point0.x, point1.x) - Math.min(point0.x, point1.x)) * factor;
                    if(point0.x < point1.x) {
                        return {x: point0.x + desiredDistance, y: point0.y};
                    } else {
                        return {x: point0.x - desiredDistance, y: point0.y};
                    }
                } else {
                    let returnPoint = {x: point0.x, y: point1.y};
                    let distance = Math.sqrt(Math.pow(point0.x - point1.x, 2) + Math.pow(point0.y - point1.y, 2));
                    let desiredDistance = distance * factor;

                    if(point0.x < point1.x) {
                        returnPoint.x = point0.x + desiredDistance;
                    } else {
                        returnPoint.x = point0.x - desiredDistance;
                    }

                    if(point0.y < point1.y) {
                        returnPoint.y = point0.y + desiredDistance;
                    } else {
                        returnPoint.y = point0.y - desiredDistance;
                    }
                    return returnPoint;
                }
                break;
            }
        }
    }

    /** @param {{x: Number, y: Number}} pos */
    drawPos = (pos=this.pos, log=false) => {
        let startX = Math.round(pos.x*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
        let startY = Math.round(pos.y*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
        this.renderedPos = {x: startX, y: startY};
        if(log) {
            // console.log(pos, this.id);
            // console.log(this.renderedPos, this.id);
        }
        // let shiftX = this.parent.humanDisplayWidth * this.parent.mapScalingFactor;
        this.updateTooltipPos();
        if((this.action !== 'in home' && this.action !== 'in hospitality') || this.parent.viewOptions.humansInPlots) {
            if(this.#pinned) {
                this.parent.spriteHuman.draw(this.parent.pinnedHumansCanvasCTX, {x: this.renderedPos.x - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor), y: this.renderedPos.y - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor)}, this.parent.mapScalingFactor, this.parent.requiredFactor, colors.color9.light['color9-light-30']);
                if(this.parent.magnifyingGlass) {
                    if(this.parent.magnifyingGlass.enabled) {
                        this.parent.spriteHuman.draw(this.parent.magnifyingGlass.pinnedHumansCanvasCtx, {x: this.renderedPos.x - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor), y: this.renderedPos.y - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor)}, this.parent.mapScalingFactor, this.parent.requiredFactor, colors.color9.light['color9-light-30']);
                    }
                }
            } else {
                this.parent.spriteHuman.draw(this.parent.humansCanvasCTX, {x: this.renderedPos.x - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor), y: this.renderedPos.y - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor)}, this.parent.mapScalingFactor, this.parent.requiredFactor, '#fff');
                if(this.parent.magnifyingGlass) {
                    if(this.parent.magnifyingGlass.enabled) {
                        this.parent.spriteHuman.draw(this.parent.magnifyingGlass.humansCanvasCtx, {x: this.renderedPos.x - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor), y: this.renderedPos.y - ((this.parent.humanDisplayWidth / 2) * this.parent.mapScalingFactor)}, this.parent.mapScalingFactor, this.parent.requiredFactor, '#fff');
                    }
                }
            }
        }
    }

    /** @param {Number} factor */
    draw = (factor) => {
        this.drawPos(this.getBetweenPoint(this.lastPos, this.pos, factor));
    }

    /**
     * @param {TICK_HUMAN_DATA} data
     */
    update = (data) => {
        if(this.id == data.id) {
            this.lastPos = {x: this.pos.x+0, y: this.pos.y+0};
            this.pos = data.pos;
            this.action = data.action;
            this.#target = data.target;
            this.#targetType = data.targetType;
            this.updateTooltipAction();
        }
    }
    /**
     * @param {App} parent 
     * @param {Number} id 
     * @param {{x: Number, y: Number}} pos
     * @param {'in home'|'walking'|'meeting'|'in hospitality'|'working'} action
     */
    constructor(parent, id, pos, action) {
        this.parent = parent;
        this.id = id;
        this.pos = pos;
        this.lastPos = {x: pos.x + 0, y: pos.y + 0};
        this.action = action;
        this.drawPos();
    }
}

export { DisplayedHuman };