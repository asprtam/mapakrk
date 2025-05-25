import { Utils } from "./utils";
import { DisplayWindow } from "./window";
import { colors } from "./colors";
import { SimulationGlobals } from "./simulationGlobals";
/** @typedef {import("../../simulation/utils").HTML_TAGS} HTML_TAGS */
/** @typedef {keyof HTML_TAGS} HTML_TAG */
/** @typedef {import("../../simulation/simulation").TICK_HUMAN_DATA} TICK_HUMAN_DATA */
/** @typedef {import("../../simulation/simulation").TICK_DATA} TICK_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_ACTION} HUMAN_ACTION */
/** @typedef {import("../../simulation/entites").HUMAN_DATA} HUMAN_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_TARGET_TYPE} HUMAN_TARGET_TYPE */

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
    renderedPos = {x: 0, y: 0};
    /** @type {Array<{x: Number, y: Number}>} */
    crossedPoints = [{x: 0, y: 0}];
    /** @type {HUMAN_ACTION} */
    action;
    /** @type {HUMAN_TARGET_TYPE} */
    #targetType = 'home';
    /** @type {Number|Null} */
    #target = null;
    /** @type {String} */
    #name;
    /** @type {String} */
    #lastName;
    /** @type {{data: HUMAN_DATA}} */ //@ts-ignore
    #temp = {};

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
            this.hideToolTip();
        }
    }

    updateTooltipPos = () => {
        if(this.#hoverToolTip) {
            // this.#hoverToolTip.style.setProperty('left', `${this.renderedPos.x}px`);
            // this.#hoverToolTip.style.setProperty('top', `${this.renderedPos.y}px`);
            this.#hoverToolTip.style.setProperty('left', `${(this.renderedPos.x * (this.parent.currentMapDisplayScale / 1000)) + this.parent.mapCut.x}px`);
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
                        this.#hoverToolTipAction.innerHTML = `idzie do <span class="location">domu</span>`;
                    } else {
                        this.#hoverToolTipAction.innerHTML = `idzie do <span class="location">${this.#target}</span>`;
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
                    this.#hoverToolTipAction.innerHTML = `w <span class="location">${this.#target}</span>`;
                    break;
                }
            }
        }
    }

    /** @param {Boolean} [forceInstant=false] */
    hideToolTip = (forceInstant=false) => {
        if(this.#tooltipTimerClass) {
            clearTimeout(this.#tooltipTimerClass);
            this.#tooltipTimerClass = null;
        }
        if(!this.#hoverToolTipClosing) {
            if(this.#tooltipTimerDeletion) {
                clearTimeout(this.#tooltipTimerDeletion);
                this.#tooltipTimerDeletion = null;
            }
        }
        const hideFunc = () => {
            this.#hovered = false;
            this.#hoverToolTipClosing = true;
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
                if(this.#hoverToolTipAction) {
                    this.#hoverToolTipAction.remove();
                    this.#hoverToolTipAction = undefined;
                }
                if(this.#hoverToolTip) {
                    this.#hoverToolTip.remove();
                    this.#hoverToolTip = undefined;
                }
                this.#hoverToolTipClosing = false;
                this.startDeleteDataTimer();
            }, waitTime);
        }
        if(forceInstant) {
            if(!this.#hoverToolTipClosing) {
                hideFunc();
            }
        } else {
            this.#tooltipTimerClass = setTimeout(() => {
                hideFunc();
            }, this.tooltipTimeout);
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
            if(typeof this.#name == 'undefined' || typeof this.#lastName == 'undefined') {
                if(typeof this.#temp.data == 'undefined') {
                    this.#temp.data = await this.parent.getHumanData(this.id);
                }
                this.#name = `${this.#temp.data.info.name}`;
                this.#lastName = `${this.#temp.data.info.lastname}`;
            }
            const classArr = ['tooltip'];
            if(this.#pinned) {
                classArr.push('pinned');
            }
            this.#hoverToolTip = Utils.createHTMLElement('div', classArr, {attibutes: {'id': `tooltipHuman-${this.id}`}}, '<div class="face"><div class="bg"></div><div class="arrow"></div></div>');
            const hoverToolTipInner = Utils.createAndAppendHTMLElement(this.#hoverToolTip, 'div', ['content']);
            this.#hoverToolTipName = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['name'], {}, `<span class="firstname">${this.#name}</span> <span class="lastname">${this.#lastName}</span>`);
            this.#hoverToolTipAction = Utils.createAndAppendHTMLElement(hoverToolTipInner, 'p', ['action']);
            this.updateTooltipAction();
            this.parent.tooltipsCont.appendChild(this.#hoverToolTip);
        } else {
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
        if(!this.#pinned) {
            this.hideToolTip();
        }
    }

    hover = () => {
        this.#hovered = true;
        this.showToolTip();
    }

    /** @param {Boolean} [forceInstant=false] */
    unHover = (forceInstant=false) => {
        if(this.#hovered) {
            if(this.#pinned) {
                this.#hovered = false;
            } else {
                this.hideToolTip(forceInstant);
            }
        }
    }

    /**
     * @param {{x: Number, y: Number}} point0
     * @param {{x: Number, y: Number}} point1
     * @param {Number} factor
     * @returns {{x: Number, y: Number}}
     */
    getBetweenPoint = (point0, point1, factor) => {
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
            let distance = Math.sqrt(Math.pow(point0.x - point1.x, 2) + (point0.y - point1.y));
            let desiredDistance = distance*factor;

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
    }

    /** @param {{x: Number, y: Number}} pos */
    draw = (pos=this.pos) => {
        let startX = Math.round(pos.x*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
        let startY = Math.round(pos.y*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
        this.renderedPos = {x: startX, y: startY};
        this.updateTooltipPos();
        if(this.#pinned) {
            this.parent.pinnedHumansCanvasCTX.beginPath();
            this.parent.pinnedHumansCanvasCTX.arc(startX, startY, (this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor, 0, 2*Math.PI);
            this.parent.pinnedHumansCanvasCTX.fillStyle = colors.color9.light['color9-light-30'];
            this.parent.pinnedHumansCanvasCTX.fill();
            this.parent.pinnedHumansCanvasCTX.closePath();
        } else {
            this.parent.humansCanvasCTX.beginPath();
            this.parent.humansCanvasCTX.arc(startX, startY, (this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor, 0, 2*Math.PI);
            this.parent.humansCanvasCTX.fillStyle = colors.color9.light['color9-light-30'];
            this.parent.humansCanvasCTX.fill();
            this.parent.humansCanvasCTX.closePath();
        }
    }

    /** 
     * @param {Number} part
     * @param {Number} total
     * @param {Array<{x: Number, y: Number}>} [crossedPoints]
     * @param {Number} [tickId]
     */
    drawPos = (part, total, crossedPoints=this.crossedPoints, tickId=0) => {
        // console.log(`part ${part}, total ${total},`, crossedPoints, `tickId: ${tickId}, humanId: ${this.id}`);
        if(crossedPoints.length == 1) {
            // console.log('crossedPoints.length == 1', crossedPoints[0], 0, tickId, this.id);
            this.draw(crossedPoints[0]);
        } else if(crossedPoints.length == total) {
            // console.log('crossedPoints.length == total', crossedPoints[part], 0, tickId, this.id);
            this.draw(crossedPoints[part]);
        } else {
            let percent = part/(total-1);
            let closestPrevPoint = Math.floor(percent * (crossedPoints.length - 1));
            let closestNextPoint = Math.ceil(percent * (crossedPoints.length - 1));
            if(closestNextPoint == closestPrevPoint) {
                // console.log('else', crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], 0, tickId, this.id);
                this.draw(crossedPoints[closestPrevPoint]);
            } else {
                let factor = (percent * (crossedPoints.length - 1))%1;
                // console.log('else', crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], factor, tickId, this.id);
                this.draw(this.getBetweenPoint(crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], factor));
            }
        }
    }

    /**
     * @param {TICK_HUMAN_DATA} data
     */
    update = (data) => {
        if(this.id == data.id) {
            this.pos = data.pos;
            this.action = data.action;
            this.crossedPoints = data.crossedPoints;
            this.#target = data.target;
            this.#targetType = data.targetType;
            this.updateTooltipAction();
            if(this.crossedPoints.length == 0) {
                this.crossedPoints = [this.pos];
            } else if(this.crossedPoints[this.crossedPoints.length - 1].x !== this.pos.x && this.crossedPoints[this.crossedPoints.length - 1].y !== this.pos.y) {
                this.crossedPoints.push(this.pos);
            }
        }
    }
    /**
     * @param {App} parent 
     * @param {Number} id 
     * @param {{x: Number, y: Number}} pos
     * @param {'in home'|'walking'|'meeting'|'in hospitality'} action
     */
    constructor(parent, id, pos, action) {
        this.parent = parent;
        this.id = id;
        this.pos = pos;
        this.action = action;
        this.draw();
    }
}

class App {
    /** @type {{showPinnedOnly: Boolean}} */
    displayConfig = {showPinnedOnly: false};
    /** @type {String} */
    serverUrl;
    /** @type {String} */
    wsUrl;
    /** @type {Boolean} */
    noSimulation = false;
    /** @type {Array<DisplayWindow>} */
    windows = [];
    /** @type {{[id:String]: Array<DisplayWindow>}} */
    windowsByType = {};
    /** @type {HTMLElement} */
    appCont;
    /** @type {{width: Number, height:Number}} */
    mapSize = {width: 1, height: 1};
    /** @type {Number} */
    requiredFactor = 8;
    /** @type {Number} */
    mapScalingFactor = SimulationGlobals.mapScalingFactor + 0;
    /** @type {Number} */
    tickTime = SimulationGlobals.tickTime + 0;
    /** @type {Number} */
    lastFetchTime = SimulationGlobals.tickTime + 0;
    /** @type {Number} */
    humanDisplayWidth = SimulationGlobals.humanDisplayWidth + 0;
    /** @type {Number} */
    humanPixelWidth = 0;
    /** @type {{width: Number, height: Number}} */ //@ts-ignore
    mapSizeScaled = {};
    /** @type {HTMLInputElement} */
    #fakeInput;
    /** @type {HTMLElement|undefined} */
    #loader;
    /** @type {DisplayWindow|undefined} */
    #mapWindow;
    /** @type {HTMLElement} */
    mapWindowCont = Utils.createHTMLElement('div', ['map']);  
    /** @type {HTMLElement} */
    mapScreen = Utils.createHTMLElement('div', ['screen', 'outlines']);  
    /** @type {HTMLCanvasElement} */
    mapCanvas;
    /** @type {CanvasRenderingContext2D} */
    mapCanvasCTX;
    /** @type {HTMLElement} */
    humansScreen = Utils.createHTMLElement('div', ['screen', 'humans']);
    /** @type {HTMLCanvasElement} */
    humansCanvas;
    /** @type {CanvasRenderingContext2D} */
    humansCanvasCTX;
    /** @type {HTMLElement} */
    pinnedHumansScreen = Utils.createHTMLElement('div', ['screen', 'humans', 'pinned']);
    /** @type {HTMLCanvasElement} */
    pinnedHumansCanvas;
    /** @type {CanvasRenderingContext2D} */
    pinnedHumansCanvasCTX;
    /** @type {HTMLElement} */
    fakeScreen = Utils.createHTMLElement('div', ['screen', 'fake']);  
    /** @type {HTMLElement} */
    tooltipsCont = Utils.createHTMLElement('div', ['tooltips']);
    /** @type {HTMLCanvasElement} */
    fakeCanvas;
    /** @type {CanvasRenderingContext2D} */
    fakeCanvasCTX;
    /** @type {Array<DisplayedHuman>} */
    humans = [];
    /** @type {Array<Number>} */
    pinnedHumanIds = [];
    /** @type {Array<DisplayedHuman>} */
    get pinnedHummans() {
        /** @type {Array<DisplayedHuman>} */
        let arr = [];
        this.pinnedHumanIds.forEach((id) => {
            arr[arr.length] = this.humans[id];
        });
        return arr;
    }
    /** @type {*|null} */
    humansFetchTimer = null;
    /** @type {TICK_DATA} */
    lastTick = {id: 0, humanPos: []};
    /** @type {Number} */
    frameTime = 1000/SimulationGlobals.fps;
    /** @type {null|DRAWING_INSTANCE} */
    drawingInstance = null;
    promFirstFetch = Promise.withResolvers();

    /** @type {Number} */
    currentMapDisplayScale = 1000;
    /** @type {Number} */
    mapMinDisplayScale = 1000;
    /** @type {Number} */
    mapMaxDisplayScale = 2000;
    /** @type {{x: Number, y: Number}} */
    mapDisplayFocusPoint = {x: 0, y: 0};
    /** @type {{x: Number, y: Number}} */
    mapCut = {x: 0, y: 0};
    mapDisplayFocusPointLimits = {x: {max: 0, min: 0}, y: {max: 0, min: 0}};
    /** @type {Number} */
    startTime;
    /** @type {Number} */
    lastTime;
    /** @type {WebSocket} */
    socket;

    /**
     * @typedef {Object} HUMAN_DATA_QUEUE
     * @property {Array<Number>} requestedIds
     * @property {(id:Number) => Promise<HUMAN_DATA>} request
     * @property {(id:Number, data: HUMAN_DATA) => void} resolve
     */
    /** @type {HUMAN_DATA_QUEUE} */
    #humanDataQueue;
    
    /** @returns {HUMAN_DATA_QUEUE} */
    #createHumanDataQueue = () => {
        /** @type {{[id:String]: PromiseWithResolvers<HUMAN_DATA>}} */
        let _requests = {};
        /** @type {{[id:String]: HUMAN_DATA}} */
        let _preResolved = {};
        /** @type {HUMAN_DATA_QUEUE} */ //@ts-ignore
        let humanDataQueue = {};
        Object.defineProperty(humanDataQueue, 'requestedIds', {
            set: () => {},
            get: () => {
                let _requestsIds = Object.keys(_requests).map((key) => { return Number(key) });
                Object.keys(_preResolved).forEach((key) => {
                    if(!_requestsIds.includes(Number(key))) {
                        _requestsIds.push(Number(key));
                    }
                });
                return _requestsIds;
            },
            enumerable: true
        });
        humanDataQueue.request = (id) => {
            if(Object.keys(_preResolved).includes(`${id}`)) {
                return new Promise((res) => {
                    let _preResolvedData = JSON.parse(JSON.stringify(_preResolved[`${id}`]));
                    /** @type {{[id:String]: HUMAN_DATA}} */
                    let _newPreResolved = {};
                    Object.keys(_newPreResolved).forEach((key) => {
                        if(key !== `${id}`) {
                            _newPreResolved[key] = _preResolved[key];
                        }
                    });
                    _preResolved = _newPreResolved;
                    res(_preResolvedData);
                });
            } else if(Object.keys(_requests).includes(`${id}`)) {
                return _requests[`${id}`].promise;
            } else {
                _requests[`${id}`] = Promise.withResolvers();
                this.promFirstFetch.promise.then(() => {
                    this.socket.send(`humanData-${id}`);
                });
                return _requests[`${id}`].promise;
            }
        }
        humanDataQueue.resolve = (id, data) => {
            if(Object.keys(_requests).includes(`${id}`)) {
                /** @type {{[id:String]: PromiseWithResolvers<HUMAN_DATA>}} */
                let _newRequests = {};
                Object.keys(_requests).forEach((key) => {
                    if(key !== `${id}`) {
                        _newRequests[key] = _requests[key];
                    } else {
                        _requests[key].resolve(data);
                    }
                });
                _requests = _newRequests;
            } else if(!Object.keys(_preResolved).includes(`${id}`)) {
                _preResolved[`${id}`] = data;
            }
        }
        return humanDataQueue;
    }


    /** @returns {HTMLElement} */
    createLoader = () => {
        /** @type {HTMLElement} */
        let loader = document.querySelector('body .loader');
        if(loader == undefined || loader == null) {
            loader = Utils.createHTMLElement('div', ['loader']);
            let cont = Utils.createAndAppendHTMLElement(loader, 'div', ['cont']);
            let belt = Utils.createAndAppendHTMLElement(cont, 'div', ['belt']);
            Utils.createAndAppendHTMLElement(belt, 'div', ['border', 'cutCornersBefore', 'cutCornersAfter']);
            let symbolsBag = Utils.createAndAppendHTMLElement(Utils.createAndAppendHTMLElement(belt, 'div', ['symbols', 'cutCorners']), 'div', ['symbolsBag']);
            const elementCount = 17;
            const timeFactor = 8;
            for(let i = 0; i<elementCount; i++) {
                Utils.createAndAppendHTMLElement(symbolsBag, 'div', [`symbol`, `symbol-${i+1}`], {css: {'animation-delay': `${i/timeFactor}s`, 'animation-duration': `${(elementCount-1)/timeFactor}s`}});
            }   
            document.body.prepend(loader);
        }
        if(!document.body.classList.contains('loading')) {
            document.body.classList.add('loading');
        }
        return loader;
    }

    /** @returns {Promise<Boolean>} */
    removeLoader = () => {
        return new Promise((res) => {
            if(!document.body.classList.contains('loading-close')) {
                document.body.classList.add('loading-close');
            }
            let elements = [document.body];
            if(this.#loader) {
                elements.push(this.#loader);
            }
            let waitTime = Utils.getTransitionTime(elements);
            setTimeout(() => {
                if(document.body.classList.contains('loading')) {
                    document.body.classList.remove('loading');
                }
                if(document.body.classList.contains('loading-close')) {
                    document.body.classList.remove('loading-close');
                }
                if(this.#loader) {
                    this.#loader.remove();
                    this.#loader = undefined;
                }
                res(true);
            }, waitTime);
        });
    }

    removeWindow = (id) => {

    }

    /**
     * @param {Number} id 
     * @returns {Promise<HUMAN_DATA>}
     */
    getHumanData = (id) => {
        return this.#humanDataQueue.request(id);
    }

    /**
     * @typedef {Object} DRAWING_INSTANCE
     * @property {() => void} stop
     * @property {Promise} finish
     */

    /** 
     * @param {Number} length
     * @param {TICK_DATA} tickData
     * @returns {DRAWING_INSTANCE}
     */
    drawHumans = (length=this.lastFetchTime, tickData) => {
        let stopped = false;
        const drawingInstancePromise = Promise.withResolvers();
        const drawingInstanceFunc = async () => {

            const waitForOrStop = (time=1000) => {
                return new Promise((res) => {
                    let timeoutHelper = null;
                    let timeoutFunc = setTimeout(() => {
                        if(timeoutHelper) {
                            clearTimeout(timeoutHelper);
                            timeoutHelper = null;
                        }
                        res(true);
                    }, time);

                    const waitForOrStopHelperFunc = () => {
                        if(timeoutHelper) {
                            clearTimeout(timeoutHelper);
                            timeoutHelper = null;
                        }
                        if(stopped) {
                            if(timeoutFunc) {
                                clearTimeout(timeoutFunc);
                                timeoutFunc = null;
                            }
                            res(true);
                        } else {
                           timeoutHelper = setTimeout(() => {
                            waitForOrStopHelperFunc();
                           });
                        }
                    }
                    waitForOrStopHelperFunc();
                });
            }


            let frames = length/this.frameTime;
            let i = 0;
            while(i < frames && !stopped) {
                // console.log(`draw frame ${i} of ${frames} in tick ${tickData.id}`);
                this.pinnedHumansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                this.fakeCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                this.humansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                for(let human of this.humans) {
                    if(tickData.humanPos[human.id]) {
                        human.drawPos(i+0, frames+0, tickData.humanPos[human.id].crossedPoints, tickData.id);
                    } else {
                        human.drawPos(i+0, frames+0, [], tickData.id);   
                    }
                }
                await waitForOrStop(this.frameTime);
                if(stopped) {
                    break;
                }
                i++;
            }
            drawingInstancePromise.resolve(true);
        }
        drawingInstanceFunc();
        return { stop: () => { stopped = true; /* console.log(`stopped animation of tick ${tickData.id}`) */ }, finish: drawingInstancePromise.promise };
    }

    startDataFetch = () => {
    }

    stopDataFetch = () => {
    }

    /** 
     * @param {Number} fetchTime
     * @param {TICK_DATA} lastTick
     * @returns {Promise<Boolean>}
     */
    onNewData = (fetchTime, lastTick) => {
        return new Promise(async (res) => {
            // console.log(fetchTime, lastTick);
            lastTick.humanPos.forEach(/** @param {TICK_HUMAN_DATA} set */ (set) => {
                if(this.humans[set.id]) {
                    this.humans[set.id].update(set);
                }
            });
            if(this.drawingInstance) {
                this.drawingInstance.stop();
                await this.drawingInstance.finish;
                this.drawingInstance = null;
            }
            this.drawingInstance = this.drawHumans(fetchTime, lastTick);
            this.drawingInstance.finish.then(() => {
                res(true);
            });
        });
    }

    dispose = () => {
        this.stopDataFetch();
    }

    /**
     * 
     * @param {MessageEvent} event 
     */
    handleSocketMessage = (event) => {
        let indexOfDash = event.data.indexOf('-');
        if(indexOfDash >= 0) {
            let tag = event.data.slice(0, indexOfDash);
            let rest = event.data.slice(indexOfDash + 1);
            switch(tag) {
                case 'tickData': {
                    this.lastFetchTime = performance.now() - this.startTime;
                    if(this.lastFetchTime <= this.tickTime) {
                        this.lastFetchTime = this.tickTime + 0;
                    }
                    this.lastFetchTime = (Math.ceil(this.lastFetchTime/this.frameTime)) * this.frameTime;
                    this.startTime = performance.now();
                    this.onNewData(this.lastFetchTime + 0, JSON.parse(JSON.stringify(this.lastTick)));
                    this.lastTick = JSON.parse(rest);
                    break;
                }
                case 'humanData': {
                    /** @type {HUMAN_DATA} */
                    let humanData = JSON.parse(rest);
                    this.#humanDataQueue.resolve(humanData.id, humanData);
                    break;
                }
            }
        }
    }

    createHumansLayer = () => {
        return new Promise(async (resolve, reject) => {
            let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
            this.humansCanvas = Utils.createAndAppendHTMLElement(this.humansScreen, 'canvas', ['humans-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
            this.humansCanvasCTX = this.humansCanvas.getContext('2d');
            this.mapWindowCont.appendChild(this.humansScreen);
            this.pinnedHumansCanvas = Utils.createAndAppendHTMLElement(this.pinnedHumansScreen, 'canvas', ['humans-canvas', 'pinned'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
            this.pinnedHumansCanvasCTX = this.humansCanvas.getContext('2d');
            this.socket = new WebSocket(this.wsUrl);
            const startTime = performance.now();
            let unpassed = true;
            this.socket.addEventListener('open', () => {
            });
            let handleFirstMessage = (event) => {
                if(unpassed) {
                    if(event.data.slice(0, 'tickData-'.length) == 'tickData-') {
                        this.lastTick = JSON.parse(event.data.slice('tickData-'.length));
                        this.lastTick.humanPos.forEach((set) => {
                            console.log(set);
                            if(set.crossedPoints.length > 0) {
                                this.humans[set.id] = new DisplayedHuman(this, set.id, set.crossedPoints[0], set.action);
                            } else {
                                this.humans[set.id] = new DisplayedHuman(this, set.id, set.pos, set.action);
                            }
                        });
                        this.lastFetchTime = performance.now() - startTime;
                        if(this.lastFetchTime <= this.tickTime) {
                            this.lastFetchTime = this.tickTime + 0;
                        }
                        this.lastFetchTime = Math.ceil(this.lastFetchTime/this.frameTime) * this.frameTime;
                        this.startTime = performance.now();
                        this.lastTime = performance.now();
                        this.socket.removeEventListener("message", handleFirstMessage);
                        this.socket.addEventListener('message', this.handleSocketMessage);
                        this.promFirstFetch.resolve(true);
                        unpassed = false;
                        resolve(true);
                    }
                }
            }
            this.socket.addEventListener("message", handleFirstMessage);
        });
    }

    createMap = () => {
        return new Promise(async (resolve, reject) => {
          console.log(window.location.href);
            const response = await fetch(`${this.serverUrl}/rawMap`);
            if(response.status == 200) {
                /** @type {Array<Array<1|0>>} */
                const responseJson = await response.json();
                console.log(responseJson);
                if(Array.isArray(responseJson)) {
                    if(responseJson.length > 0) {
                        if(Array.isArray(responseJson[0])) {
                            if(responseJson[0].length > 0) {
                                this.mapSize = {width: responseJson.length, height: responseJson[0].length};

                                let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);

                                this.mapCanvas = Utils.createAndAppendHTMLElement(this.mapScreen, 'canvas', ['screen-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
                                this.mapCanvasCTX = this.mapCanvas.getContext('2d');
                                this.mapCanvasCTX.fillStyle = colors.color3.dark["color3-dark-90"];
                                this.mapCanvasCTX.fillRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                                responseJson.forEach((column, column_id) => {
                                    column.forEach((point, row_id) => {
                                        if(point == 1) {
                                            this.mapCanvasCTX.fillStyle = colors.color3.base;
                                            let p = this.mapScalingFactor/this.requiredFactor;
                                            let startX = (column_id*this.mapScalingFactor) + p;
                                            let startY = (row_id*this.mapScalingFactor) + p;
                                            this.mapCanvasCTX.fillRect(startX, startY, p*2, p*2);
                                            this.mapCanvasCTX.fillRect(startX + p*4, startY, p*2, p*2);
                                            this.mapCanvasCTX.fillRect(startX + p*2, startY + p*2, p*2, p*2);
                                            this.mapCanvasCTX.fillRect(startX, startY + p*4, p*2, p*2);
                                            this.mapCanvasCTX.fillRect(startX + p*4, startY + p*4, p*2, p*2);
                                        }
                                    });
                                });
                                
                                this.mapWindowCont.appendChild(this.mapScreen);
                                resolve(true);
                            } else {
                                reject(500);
                            }
                        } else {
                            reject(500);
                        }
                    } else {
                        reject(500);
                    }
                } else {
                    reject(500);
                }
            } else {
                reject(503);
            }
        });
    }

    init = () => {
        return new Promise((resolve, reject) => {
            this.createMap().then((res) => {
            //   resolve(true);
                this.createHumansLayer().then((_res) => {
                    resolve(_res);
                }, (code) => {
                    setTimeout(() => {
                        reject(code);
                    }, 5000);
                });
            }, (code) => {
                setTimeout(() => {
                    reject(code);
                }, 5000);
            })
        });
    }

    /**
     * @param {KeyboardEvent} e 
     */
    handleKey = (e) => {
        e.preventDefault();
        // console.log(e);
    }
    
    constructor(params) {
        this.serverUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
        this.wsUrl = `ws://${window.location.hostname}:3000`;
        if(params) {
            if(params.noSimulation) {
                this.noSimulation = true;
            }
        }
        this.#loader = this.createLoader();
        this.#humanDataQueue = this.#createHumanDataQueue();
        this.appCont = Utils.createAndAppendHTMLElement(document.body, 'div', ['app'], {attibutes: {id: 'app'}});
        Object.defineProperty(this.mapSizeScaled, 'width', {
            set: () => {},
            get: () => {
                return this.mapSize.width * this.mapScalingFactor;
            },
            enumerable: true
        });
        Object.defineProperty(this.mapSizeScaled, 'height', {
            set: () => {},
            get: () => {
                return this.mapSize.height * this.mapScalingFactor;
            },
            enumerable: true
        });
        document.body.addEventListener('keydown', this.handleKey);
        if(this.mapScalingFactor%this.requiredFactor != 0) {
            this.mapScalingFactor = this.mapScalingFactor + (this.requiredFactor - this.mapScalingFactor%this.requiredFactor)
        }
        if(this.humanDisplayWidth <= 0) {
            this.humanDisplayWidth = 1;
        }
        this.init().then(() => {
            let factor = Utils.floorToFraction((window.innerWidth - 20) / this.mapSize.width);
            if(Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height) < factor) {
                factor = Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height);
            }

            let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
            this.fakeScreen.appendChild(this.tooltipsCont);
            this.fakeCanvas = Utils.createAndAppendHTMLElement(this.fakeScreen, 'canvas', ['fake-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
            this.mapWindowCont.appendChild(this.fakeScreen);
            this.fakeCanvasCTX = this.fakeCanvas.getContext('2d');
            this.fakeCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);

            this.#mapWindow = new DisplayWindow(this.mapWindowCont, {className: 'map-window', id: 'map-window', type: 'map-window', name: 'Mapa', behaviour: {close: false}, size: {width: this.mapSize.width * factor, height: (this.mapSize.height * factor) + 35}, pos: {x: 10, y: 10}, aspectRatioScaling: true});
            this.appCont.appendChild(this.#mapWindow.window);
            setTimeout(() => {
                const mapZoomControlCont = Utils.createAndAppendHTMLElement(this.mapWindowCont, 'div', ['zoom-controls']);


                this.mapMinDisplayScale = Math.ceil((this.mapWindowCont.offsetWidth/this.mapSizeScaled.width)*1000);
                this.currentMapDisplayScale = this.mapMinDisplayScale + 0;
                const mapZoomInput = Utils.createAndAppendHTMLElement(mapZoomControlCont, 'input', ['zoom-input'], {attibutes: {type: 'range', min: `${this.mapMinDisplayScale}`, max: `${this.mapMaxDisplayScale}`, step: '1' }});
                mapZoomInput.value = `${this.currentMapDisplayScale}`;

                this.mapDisplayFocusPointLimits = {x: {min: -50, max: -50}, y: {min: -50, max: -50}};

                let baseX = 0;
                let baseY = 0;
                
                const setMapCut = () => {
                    let bounds = this.mapCanvas.getBoundingClientRect();
                    let bounds_parent = this.humansScreen.getBoundingClientRect();
                    this.mapCut = {x: (bounds.left - bounds_parent.left) - baseX, y: (bounds.top - bounds_parent.top) - baseY};
                }

                const setHumanPixelWidth = () => {
                    this.humanPixelWidth = (this.mapScalingFactor * this.humanDisplayWidth)*(this.currentMapDisplayScale/1000);
                    this.mapWindowCont.style.setProperty('--humanPixelWidth', `${Utils.roundToFraction(this.humanPixelWidth, 2)}px`);
                }

                const handleResize = () => {
                    this.mapMinDisplayScale = Math.ceil((this.mapWindowCont.offsetWidth/this.mapSizeScaled.width)*1000);
                    mapZoomInput.setAttribute('min', `${this.mapMinDisplayScale}`);
                    if(this.currentMapDisplayScale <= this.mapMinDisplayScale) {
                        this.currentMapDisplayScale = this.mapMinDisplayScale + 0;
                        let sizePercent = ((this.currentMapDisplayScale - this.mapMinDisplayScale) / (this.mapMaxDisplayScale - this.mapMinDisplayScale));
                        this.mapDisplayFocusPointLimits.x.min = -50 - (90*sizePercent);
                        this.mapDisplayFocusPointLimits.x.max = -50 + (90*sizePercent);
                        this.mapDisplayFocusPointLimits.y.min = -50 - (80*sizePercent);
                        this.mapDisplayFocusPointLimits.y.max = -50 + (80*sizePercent);
                        if(this.mapDisplayFocusPoint.x <= this.mapDisplayFocusPointLimits.x.min) {
                            this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.min + 0;
                        }
                        if(this.mapDisplayFocusPoint.x >= this.mapDisplayFocusPointLimits.x.max) {
                                this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.max + 0;
                        }
                        if(this.mapDisplayFocusPoint.y <= this.mapDisplayFocusPointLimits.y.min) {
                            this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.min + 0;
                        }
                        if(this.mapDisplayFocusPoint.y >= this.mapDisplayFocusPointLimits.y.max) {
                            this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.max + 0;
                        }
                        this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
                        this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
                        this.mapWindowCont.style.setProperty('--currentMapScale', `${this.currentMapDisplayScale/1000}`);
                        setMapCut();
                        setHumanPixelWidth();
                        this.humans.forEach((human) => {
                            human.updateTooltipPos();
                        });
                    }
                }

                mapZoomInput.addEventListener('input', () => {
                    if(!isNaN(Number(mapZoomInput.value))) {
                        if(Number(mapZoomInput.value) >= this.mapMinDisplayScale && Number(mapZoomInput.value) <= this.mapMaxDisplayScale) {
                            this.currentMapDisplayScale = Number(mapZoomInput.value);
                            let sizePercent = ((this.currentMapDisplayScale - this.mapMinDisplayScale) / (this.mapMaxDisplayScale - this.mapMinDisplayScale));
                            this.mapDisplayFocusPointLimits.x.min = -50 - (80*sizePercent);
                            this.mapDisplayFocusPointLimits.x.max = -50 + (80*sizePercent);
                            this.mapDisplayFocusPointLimits.y.min = -50 - (80*sizePercent);
                            this.mapDisplayFocusPointLimits.y.max = -50 + (80*sizePercent);
                            if(this.mapDisplayFocusPoint.x <= this.mapDisplayFocusPointLimits.x.min) {
                                this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.min + 0;
                            }
                            if(this.mapDisplayFocusPoint.x >= this.mapDisplayFocusPointLimits.x.max) {
                                this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.max + 0;
                            }
                            if(this.mapDisplayFocusPoint.y <= this.mapDisplayFocusPointLimits.y.min) {
                                this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.min + 0;
                            }
                            if(this.mapDisplayFocusPoint.y >= this.mapDisplayFocusPointLimits.y.max) {
                                this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.max + 0;
                            }
                            this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
                            this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
                            this.mapWindowCont.style.setProperty('--currentMapScale', `${this.currentMapDisplayScale/1000}`);
                            setMapCut();
                            setHumanPixelWidth();
                            this.humans.forEach((human) => {
                                human.updateTooltipPos();
                            });
                        }
                    }
                });

                const resizeObserver = new ResizeObserver(handleResize);
                resizeObserver.observe(this.mapWindowCont);

                this.mapDisplayFocusPoint = {x: -50, y: -50};

                let dragStartPos = {x: 0, y: 0};

                /** @param {MouseEvent} e */
                const handleDragMouse = (e) => {
                    const diffX = ((e.offsetX - dragStartPos.x)/this.mapSizeScaled.width)*100;
                    const diffY = ((e.offsetY - dragStartPos.y)/this.mapSizeScaled.height)*100;
                    this.mapDisplayFocusPoint.x = this.mapDisplayFocusPoint.x + diffX;
                    if(this.mapDisplayFocusPoint.x <= this.mapDisplayFocusPointLimits.x.min) {
                        this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.min + 0;
                    }
                    if(this.mapDisplayFocusPoint.x >= this.mapDisplayFocusPointLimits.x.max) {
                        this.mapDisplayFocusPoint.x = this.mapDisplayFocusPointLimits.x.max + 0;
                    }
                    this.mapDisplayFocusPoint.y = this.mapDisplayFocusPoint.y + diffY;
                    if(this.mapDisplayFocusPoint.y <= this.mapDisplayFocusPointLimits.y.min) {
                        this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.min + 0;
                    }
                    if(this.mapDisplayFocusPoint.y >= this.mapDisplayFocusPointLimits.y.max) {
                        this.mapDisplayFocusPoint.y = this.mapDisplayFocusPointLimits.y.max + 0;
                    }
                    this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
                    this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
                    setMapCut();
                    this.humans.forEach((human) => {
                        human.updateTooltipPos();
                    });
                }

                /** @param {MouseEvent} e */
                const handleMouseMoveNormal = (e) => {
                    let pos = {x: e.offsetX, y: e.offsetY};
                    let half = this.mapScalingFactor;
                    // let half = (this.humanDisplayWidth * this.mapScalingFactor);
                    /** @type {Array<DisplayedHuman>} */
                    const humansToHover = [];
                    /** @type {Array<DisplayedHuman>} */
                    const humansToUnhover = [];
                    this.humans.forEach((human) => {
                        if((pos.x >= (human.renderedPos.x - half) && pos.x <= (human.renderedPos.x + half)) && (pos.y >= (human.renderedPos.y - half) && pos.y <= (human.renderedPos.y + half)) && ((this.displayConfig.showPinnedOnly && human.pinned) || !this.displayConfig.showPinnedOnly)) {
                            humansToHover.push(human);
                        } else {
                            humansToUnhover.push(human);
                        }
                    });
                    let instant = humansToHover.length > 0;
                    humansToUnhover.forEach((human) => {
                        human.unHover(instant);
                    });
                    if(instant) {
                        humansToHover.forEach((human) => {
                            human.hover();
                        });
                    }
                }

                /** @param {MouseEvent} e */
                const handleStartDrag = (e) => {
                    dragStartPos = {x: e.offsetX, y: e.offsetY}
                    mapZoomInput.disabled = true;
                    if(!this.fakeScreen.classList.contains('dragging')) {
                        this.fakeScreen.classList.add('dragging');
                    }
                    this.fakeCanvas.removeEventListener('mousedown', handleStartDrag);
                    this.fakeCanvas.removeEventListener('mousemove', handleMouseMoveNormal);
                    this.fakeCanvas.addEventListener('mousemove', handleDragMouse);
                    this.fakeCanvas.addEventListener('mouseup', handleStopDrag);
                    this.fakeCanvas.addEventListener('mouseout', handleStopDrag);
                    this.humans.forEach((human) => {
                        human.unHover(true);
                    });
                }

                /** @param {MouseEvent} e */
                const handleStopDrag = (e) => {
                    mapZoomInput.disabled = false;
                    if(this.fakeScreen.classList.contains('dragging')) {
                        this.fakeScreen.classList.remove('dragging');
                    }
                    this.fakeCanvas.removeEventListener('mousemove', handleDragMouse);
                    this.fakeCanvas.removeEventListener('mouseup', handleStopDrag);
                    this.fakeCanvas.removeEventListener('mouseout', handleStopDrag);
                    this.fakeCanvas.addEventListener('mousedown', handleStartDrag);
                    this.fakeCanvas.addEventListener('mousemove', handleMouseMoveNormal);
                }

                setTimeout(() => {
                    this.mapWindowCont.style.setProperty('--currentMapScale', `${this.currentMapDisplayScale/1000}`);
                    this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
                    this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
                    let bounds = this.mapCanvas.getBoundingClientRect();
                    let bounds_parent = this.humansScreen.getBoundingClientRect();
                    baseX = bounds.left - bounds_parent.left;
                    baseY = bounds.top - bounds_parent.top;
                    this.humanPixelWidth = (this.mapScalingFactor * this.humanDisplayWidth)*(this.currentMapDisplayScale/1000);
                    this.mapWindowCont.style.setProperty('--humanPixelWidth', `${Utils.roundToFraction(this.humanPixelWidth, 2)}px`);
                    this.fakeCanvas.addEventListener('mousedown', handleStartDrag);
                    this.fakeCanvas.addEventListener('mousemove', handleMouseMoveNormal);
                    this.removeLoader();
                });
            });
        });
    }
}

try {
  const app = new App();
} catch(err) {
  console.error(err);
}   

