import { Utils } from "./utils";
import { App } from "./app";
import { DisplayWindow } from "./window";
import { localisation } from "./localisation";
import { intrests, intrestCategories } from "../../data/intrests.js";
/** @typedef {import("../../simulation/entites").PLOT_STATUS} PLOT_STATUS */
/** @typedef {import("../../data/intrests.js").INTREST_CATEGORY_NAME} INTREST_CATEGORY_NAME */
/** @typedef {import("../../data/intrests.js").INTREST_TAG} INTREST_TAG */

class PlotStatusWindow {
    /** @type {Plot|Hospitality} */
    plot;
    /** @type {DisplayWindow} */
    windowEl;
    /** @type {HTMLElement} */
    windowContent;
    /** @type {Boolean} */
    pinPermanently = false;
    /**
     * @typedef {Object} INFO_VALUES
     * @property {HTMLElement} cont
     * @property {HTMLElement} name
     * @property {HTMLElement} value
     */
    /** @type {{adress: INFO_VALUES}} */ //@ts-ignore
    basicInfoValues = {
        adress: {
            cont: Utils.createHTMLElement('div', ['valueCont', 'age']),
            name: Utils.createHTMLElement('h2', ['name'], {}, `Adres:`),
            value: Utils.createHTMLElement('h3', ['value'])
        }
    };
    /** @type {{[id: String]: HTMLElement}} */
    #visitorsLi = {};
    intrestsCont = Utils.createHTMLElement('div');
    /** @type {{[id: String]: HTMLElement}} */
    intrestsValues = {};

    /** @param {PLOT_STATUS} data */
    updateStatus = (data) => {
        this.visitorsCountElement.innerHTML = `(${data.visitors.length})`;
        /** @type {Array<String>} */
        let keysToKeep = [];
        
        data.visitors.forEach((visitorData) => {
            if(typeof this.#visitorsLi[`${visitorData.id}`] == 'undefined') {
                this.#visitorsLi[`${visitorData.id}`] = Utils.createAndAppendHTMLElement(this.visitorsList, 'li');
                let innerA = Utils.createAndAppendHTMLElement(this.#visitorsLi[`${visitorData.id}`], 'a', [], {}, `${visitorData.name}`);
                innerA.addEventListener('click', () => {
                    if(this.plot.app.humans[visitorData.id]) {
                        this.plot.app.humans[visitorData.id].handleClick();
                    }
                });
            }
            if(!keysToKeep.includes(`${visitorData.id}`)) {
                keysToKeep.push(`${visitorData.id}`);
            }
        });

        Object.keys(this.#visitorsLi).forEach((key) => {
            if(!keysToKeep.includes(key)) {
                this.#visitorsLi[key].remove();
                delete this.#visitorsLi[key];
            }
        });
    }

    /**
     * @param {Plot|Hospitality} plot 
     */
    constructor(plot) {
        this.plot = plot;
        this.plot.pinned = true;
        this.windowContent = Utils.createHTMLElement('div', ['content']);
        this.basicInfoCont = Utils.createAndAppendHTMLElement(this.windowContent, 'div', ['basicInfo']);
        this.basicInfoName = Utils.createAndAppendHTMLElement(this.basicInfoCont, 'h1');
        this.basicInfoName.innerHTML = `${this.plot.name}`;
        this.basicInfoSubCont = Utils.createAndAppendHTMLElement(this.basicInfoCont, 'div', ['subCont']);
        this.basicInfoSubCont.appendChild(this.basicInfoValues.adress.cont);
        this.basicInfoValues.adress.cont.appendChild(this.basicInfoValues.adress.name);
        this.basicInfoValues.adress.cont.appendChild(this.basicInfoValues.adress.value);
        this.basicInfoValues.adress.value.innerHTML = `${this.plot.adress}`;
        this.extendedInfoCont = Utils.createAndAppendHTMLElement(this.windowContent, 'div', ['extendedInfo']);
        this.visitorsCont = Utils.createAndAppendHTMLElement(this.extendedInfoCont, 'div', ['visitors'], {});
        let visitorsHeader = Utils.createAndAppendHTMLElement(this.visitorsCont, 'h2');
        Utils.createAndAppendHTMLElement(visitorsHeader, 'span', ['name'], {}, 'Odwiedzający');
        this.visitorsCountElement = Utils.createAndAppendHTMLElement(visitorsHeader, 'span', ['count'], {}, `(0)`);
        this.visitorsList = Utils.createAndAppendHTMLElement(this.visitorsCont, 'ul', ['visitorsList']);

        if(this.plot.isHospitality) {
            if(this.plot.welcomeIntrestsTags.length > 0) {
                const intrestCont = Utils.createAndAppendHTMLElement(this.basicInfoSubCont, 'div', ['intrests']);
                Utils.createAndAppendHTMLElement(intrestCont, 'h2', [], {}, 'Powiązana tematyka');
                this.intrestsCont = Utils.createAndAppendHTMLElement(intrestCont, 'div', ['intrestsList']);
                for(let intrestTag of this.plot.welcomeIntrestsTags) {
                    if(typeof this.intrestsValues[intrestTag] == 'undefined') {
                        this.intrestsValues[intrestTag] = Utils.createAndAppendHTMLElement(this.intrestsCont, 'div', ['intrest', intrestTag], {}, `${this.plot.app.intrestsData.intrests[intrestTag].name}`);
                    }
                }
            }
        }

        this.windowEl = new DisplayWindow(this.windowContent, {
            className: ['plotStatus', 'open'], 
            id: `plotStatus-${this.plot.id}`,
            name: `${this.plot.name}`,
            type: `plotStatus-window`,
            behaviour: {minimize: false, fullscreen: false, close: true},
            size: {width: 400, height: 500},
            pos: {x: (window.innerWidth/2) - 200, y: (window.innerHeight/2) - 250}
        });
        this.windowEl.onClose = () => {
            return new Promise((res) => {
                this.plot.app.removeInfoWindow(this.windowEl);
                this.plot.statusWindow = null;
                this.plot.app.socket.send(`plotStatusRevoke-${this.plot.id}`);
                if(!this.pinPermanently) {
                    this.plot.pinned = false;
                }
                res(true);
            });
        }
        this.plot.app.appCont.append(this.windowEl.window);
        this.plot.app.addInfoWindow(this.windowEl);
        let waitTime = Utils.getTransitionTime(this.windowEl.window);
        setTimeout(() => {
            if(this.windowEl.window.classList.contains('open')) {
                this.windowEl.window.classList.remove('open');
            }
            this.plot.app.focusInfoWindow(this.windowEl);
            this.windowEl.window.addEventListener('pointerdown', () => {
                this.plot.app.focusInfoWindow(this.windowEl);
            });
        }, waitTime);
    }
}

class Plot {
    /** @type {Number} */
    tooltipTimeout = 1000;
    #tooltipTimerClass = null;
    #tooltipTimerDeletion = null;
    /** @type {App} */
    app;
    /** @type {Number} */
    id;
    /** @type {import("../../simulation/path").pos} */
    pos;
    /** @type {Array<import("../../simulation/path").pos>} */
    squares;
    /** @type {String} */
    name;
    /** @type {String} */
    adress;
    /** @type {false} */
    isHospitality;
    /** @type {HTMLElement} */
    #hoverToolTip;
    /** @type {HTMLElement} */
    #hoverToolTipName;
    /** @type {Boolean} */
    #hoverToolTipClosing = false;
    /** @type {String} */
    #currentTooltipUniqueId = '';
    /** @type {Boolean} */
    #hovered = false;
    /** @type {PlotStatusWindow|null} */
    statusWindow = null;
    get hovered() {
        return this.#hovered;
    }
    get renderedPos() {
        return {x: (this.pos.x * this.app.mapScalingFactor) + (this.app.mapScalingFactor / 2), y: (this.pos.y * this.app.mapScalingFactor) + (this.app.mapScalingFactor / 2)};
    }
    /** @type {Boolean} */
    #pinned = false;
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
                if(!this.app.pinnedPlotIds.includes(this.id)) {
                    this.app.pinnedPlotIds.push(this.id);
                }
            }
            this.showToolTip();
            if(this.#hoverToolTip) {
                if(!this.#hoverToolTip.classList.contains('pinned')) {
                    this.#hoverToolTip.classList.add('pinned');
                }
            }
        } else {
            if(this.#pinned) {
                this.#pinned = false;
                let indexof = this.app.pinnedPlotIds.indexOf(this.id);
                if(indexof >= 0) {
                    this.app.pinnedPlotIds = this.app.pinnedPlotIds.slice(0, indexof).concat(this.app.pinnedPlotIds.slice(indexof + 1));
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
            let top = (this.renderedPos.y * (this.app.currentMapDisplayScale/1000)) + this.app.mapCut.y;
            if(top <= this.#hoverToolTip.offsetHeight) {
                if(!this.#hoverToolTip.classList.contains('reversed')) {
                    this.#hoverToolTip.classList.add('reversed')
                }
            } else {
                if(this.#hoverToolTip.classList.contains('reversed')) {
                    this.#hoverToolTip.classList.remove('reversed');
                }
            }
            this.#hoverToolTip.style.setProperty('left', `${((this.renderedPos.x) * (this.app.currentMapDisplayScale / 1000)) + this.app.mapCut.x}px`);
            this.#hoverToolTip.style.setProperty('top', `${top}px`);
        }
    }
    /** @param {Boolean} [forceInstant=false] */
    hideToolTip = (forceInstant = false) => {
        const hideFuncRest = () => {
            /** @type {Array<HTMLElement>} */
            let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipPlot-${this.id}"]`));
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
            let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipPlot-${this.id}"]`));
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
                /** @type {HTMLElement} */
                let hoverToolTipInner = document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipPlot-${this.id}"] .content`);
                if(hoverToolTipInner == null || hoverToolTipInner == undefined) {
                    hoverToolTipInner = Utils.createAndAppendHTMLElement(this.#hoverToolTip, 'div', ['content']);
                    this.#hoverToolTipName = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['name'], {}, `${this.name}`);
                } else {
                    this.#hoverToolTipName = document.querySelector(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipPlot-${this.id}"] .content .name`);
                    if(this.#hoverToolTipName == null || this.#hoverToolTipName == undefined) {
                        this.#hoverToolTipName = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['name'], {}, `${this.name}`);
                    }
                }
            } else {
                const classArr = ['tooltip', 'plot'];
                this.#currentTooltipUniqueId = Utils.makeId(10);
                this.#hoverToolTip = Utils.createHTMLElement('div', classArr, {attibutes: {'id': `tooltipPlot-${this.id}`, 'data-id': this.#currentTooltipUniqueId}}, '<div class="face"><div class="bg"></div><div class="arrow"></div></div>');
                const hoverToolTipInner = Utils.createAndAppendHTMLElement(this.#hoverToolTip, 'div', ['content']);
                this.#hoverToolTipName = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['name'], {}, `${this.name}`);
                this.app.tooltipsCont.appendChild(this.#hoverToolTip);
            }
        } else {
            /** @type {Array<HTMLElement>} */
            let hoverToolTips = Array.from(document.querySelectorAll(`.container .contentHolder .map.content .screen.fake .tooltips [id="tooltipPlot-${this.id}"]`));
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
        }
        this.updateTooltipPos();
        // this.hideToolTip();
    }

    /** @param {PLOT_STATUS} data */
    updateStatus = (data) => {
        if(this.statusWindow) {
            this.statusWindow.updateStatus(data);
        }
    }

    handleClick = () => {
        if(this.statusWindow === null) {
            this.app.socket.send(`plotStatus-${this.id}`);
            this.statusWindow = new PlotStatusWindow(this);
        }
    }
    
    hover = () => {
        this.#hovered = true;
        this.showToolTip();
    }
    
    /** @param {Boolean} [forceInstant=false] */
    unHover = (forceInstant = false) => {
        if(!this.#pinned) {
            this.hideToolTip(forceInstant);
        }
    }

    /**
     * @param {App} app 
     * @param {{id: Number, pos: import("../../simulation/path").pos, squares: Array<import("../../simulation/path").pos>, name: String, adress: String, isHospitality: Boolean}} config 
     */
    constructor(app, config) {
        this.app = app;
        this.id = config.id;
        this.pos = config.pos;
        this.squares = config.squares;
        this.name = config.name;
        this.adress = config.adress; //@ts-ignore
        this.isHospitality = config.isHospitality;
    }
}

class Hospitality extends Plot {
    /** @type {true} */ //@ts-ignore
    isHospitality = true;
    /** @type {Array<INTREST_TAG>} */
    welcomeIntrestsTags = [];
    /** @type {Array<INTREST_TAG>} */
    unwelcomeIntrestsTags = [];
    /** @type {Array<INTREST_CATEGORY_NAME>} */
    welcomeIntrestCategories = [];
    /** @type {Array<INTREST_CATEGORY_NAME>} */
    unwelcomeIntrestCategories = [];

    /**
     * @param {App} app 
     * @param {{id: Number, pos: import("../../simulation/path").pos, squares: Array<import("../../simulation/path").pos>, name: String, adress: String, isHospitality: Boolean, welcomeIntrestsTags: Array<INTREST_TAG>, unwelcomeIntrestsTags: Array<INTREST_TAG>, welcomeIntrestCategories: Array<INTREST_CATEGORY_NAME>, unwelcomeIntrestCategories: Array<INTREST_CATEGORY_NAME>}} config 
     */
    constructor(app, config) {
        super(app, config);
        this.welcomeIntrestsTags = config.welcomeIntrestsTags.toSorted();
        this.unwelcomeIntrestsTags = config.unwelcomeIntrestsTags.toSorted();
        this.welcomeIntrestCategories = config.welcomeIntrestCategories.toSorted();
        this.unwelcomeIntrestCategories = config.unwelcomeIntrestCategories.toSorted();
    }
}

export { Plot, Hospitality };