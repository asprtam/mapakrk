import { CustomScroll, Utils } from "./utils";
import { DisplayWindow } from "./window";
import { colors } from "./colors";
import { SimulationGlobals } from "./simulationGlobals";
import { Sprite } from "./sprite";
import { DisplayedHuman } from "./human";
import { Plot, Hospitality } from "./plot.js";
import { MagnifyingGlass } from "./magnifyingGlass";
import { ClickElewhereEvent } from "./clickElsewhere";
/** @typedef {import("../../simulation/utils").HTML_TAGS} HTML_TAGS */
/** @typedef {keyof HTML_TAGS} HTML_TAG */
/** @typedef {import("../../simulation/simulation").TICK_HUMAN_DATA} TICK_HUMAN_DATA */
/** @typedef {import("../../simulation/simulation").TICK_DATA} TICK_DATA */
/** @typedef {import("../../simulation/simulation").HUMAN_STATUS_SOCKET_MESSAGE} HUMAN_STATUS_SOCKET_MESSAGE */
/** @typedef {import("../../simulation/entites").HUMAN_ACTION} HUMAN_ACTION */
/** @typedef {import("../../simulation/entites").HUMAN_DATA} HUMAN_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_TARGET_TYPE} HUMAN_TARGET_TYPE */
/** @typedef {import("../../simulation/entites").HUMAN_STATUSES} HUMAN_STATUSES */
/** @typedef {import("../../simulation/entites").HUMAN_FRIEND_DATA} HUMAN_FRIEND_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_FRIENDS_LIST} HUMAN_FRIENDS_LIST */
/** @typedef {import("../../index").SPRITE} SPRITE */
/** @typedef {import("../../index").RAW_MAP} RAW_MAP */
/** @typedef {import("../../index").RAW_MAP_PIXEL} RAW_MAP_PIXEL */
/** @typedef {import("../../simulation/grid").PLOT_SLOT} PLOT_SLOT */
/** @typedef {import("../../simulation/entites").PLOT_STATUS} PLOT_STATUS */

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
    requiredFactor = SimulationGlobals.requiredFactor + 0;
    /** @type {Number} */
    mapScalingFactor = SimulationGlobals.mapScalingFactor + 0;
    /** @type {Number} */
    tickTime = SimulationGlobals.tickTime + 0;
    /** @type {Number} */
    lastFetchTime = SimulationGlobals.tickTime + 0;
    /** @type {Number} */
    humanDisplayWidth = 1;
    /** @type {Number} */
    humanDisplayHeight = 1;
    /** @type {Number} */
    plotDisplayWidth = 1;
    /** @type {Number} */
    plotDisplayHeight = 1;
    /** @type {Number} */
    humanPixelWidth = 0;
    /** @type {Number} */
    humanPixelHeight = 0;
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
    /** @type {Array<Plot|Hospitality>} */
    plots = [];
    /** @type {Boolean} */
    plotsScreenVisible = true;
    /** @type {HTMLElement} */
    plotsScreen = Utils.createHTMLElement('div', ['screen', 'plots']);
    /** @type {HTMLCanvasElement} */
    plotsCanvas;
    /** @type {CanvasRenderingContext2D} */
    plotsCanvasCTX;
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
    /** @type {Array<Number>} */
    pinnedPlotIds = [];
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
    lastTick = {id: 0, humanPos: [], plotsChanged: false};
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
    /** @type {Sprite} */
    spriteHuman;
    /** @type {SPRITE} */
    spriteTile;
    /** @type {Sprite} */
    spritePlot;
    /** @type {Array<DisplayWindow>} */
    #infoWindows = [];
    /** @type {MagnifyingGlass} */
    magnifyingGlass;
    /** @type {HTMLElement} */
    controlsCont;
    /** @type {{magnifyingGlass: {el: HTMLElement, tooltip: HTMLElement}}} */
    controlBtns;
    /** @type {Number} */
    startWidth = window.outerWidth;
    /** @type {{intrests: {[key in import("../../data/intrests").INTREST_TAG]: import("../../data/intrests").INTREST}, categories: {[key in import("../../data/intrests").INTREST_CATEGORY_NAME]: {name: String, connected: Array<import("../../data/intrests").INTREST_CATEGORY_NAME>, disconnected: Array<import("../../data/intrests").INTREST_CATEGORY_NAME>}}}} */ //@ts-ignore
    intrestsData = {intrests: {}, categories: {}};
    viewOptions = { glassOpened: false, plotsVisible: true, humansInPlots: false };

    /**
     * @param {DisplayWindow} displayWindow
     * @returns {Number|null}
     */
    #infoWindowsIndexOf = (displayWindow) => {
        let foundId = null;
        for(let i = 0; i<this.#infoWindows.length; i++) {
            if(this.#infoWindows[i].id == displayWindow.id) {
                foundId = i+0;
                break;
            }
        }
        return foundId;
    }

    /**
     * @param {DisplayWindow} displayWindow
     * @returns {Boolean}
     */
    #infoWindowsIncludes = (displayWindow) => {
        let includes = false;
        for(let _displayWindow of this.#infoWindows) {
            if(_displayWindow.id == displayWindow.id) {
                includes = true;
                break;
            }
        }
        return includes;
    }

    /** 
     * @param {DisplayWindow} displayWindow
     */
    addInfoWindow = (displayWindow) => {
        if(!this.#infoWindowsIncludes(displayWindow)) {
            this.#infoWindows.push(displayWindow);
        }
    }

    /**
     * @param {DisplayWindow} displayWindow
     */
    flickerDisplayWindow = (displayWindow) => {
        if(!displayWindow.window.classList.contains('flicker')) {
            displayWindow.window.classList.add('flicker');
            let waitTime = Utils.getTransitionTime([displayWindow.window]);
            setTimeout(() => {
                if(displayWindow.window.classList.contains('flicker')) {
                    displayWindow.window.classList.remove('flicker');
                }
            }, waitTime);
        }
    }

    /**
     * @param {DisplayWindow} displayWindow
     */
    focusInfoWindow = (displayWindow) => {
        this.addInfoWindow(displayWindow);
        this.#infoWindows.forEach((_displayWindow) => {
            if(_displayWindow.id !== displayWindow.id) {
                _displayWindow.focused = false;
            } else {
                _displayWindow.focused = true;
            }
        });
    }

    /** 
     * @param {DisplayWindow} displayWindow
     */
    removeInfoWindow = (displayWindow) => {
        let indexOf = this.#infoWindowsIndexOf(displayWindow);
        while(indexOf !== null) {
            this.#infoWindows = this.#infoWindows.slice(0, indexOf).concat(this.#infoWindows.slice(indexOf+1));
            indexOf = this.#infoWindowsIndexOf(displayWindow);
        }
    }

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
        const drawingInstancePromise = Promise.withResolvers();
        this.pinnedHumansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
        this.fakeCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
        this.humansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
        if(this.magnifyingGlass) {
            this.magnifyingGlass.pinnedHumansCanvasCtx.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
            this.magnifyingGlass.humansCanvasCtx.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
        }
        for(let human of this.humans) {
            human.drawPos();
        }
        drawingInstancePromise.resolve(true);
        return { stop: () => {
            // console.log(`stopped on frame ${currentFrame} of ${frames}`);
            // clearTimeout(timeout);
            // drawingInstancePromise.resolve(true);
        }, finish: drawingInstancePromise.promise };
    }

    startDataFetch = () => {
    }

    stopDataFetch = () => {
    }

    /** 
     * @param {TICK_DATA} lastTick
     * @returns {Promise<Boolean>}
     */
    onNewData = (lastTick) => {
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
            this.lastFetchTime = performance.now() - this.startTime;
            this.lastFetchTime = (Math.round(this.lastFetchTime / this.frameTime)) * this.frameTime;
            this.startTime = performance.now();
            this.drawingInstance = this.drawHumans(this.lastFetchTime + 0, lastTick);
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
                    this.onNewData(JSON.parse(JSON.stringify(this.lastTick)));
                    this.lastTick = JSON.parse(rest);
                    break;
                }
                case 'humanStatus': {
                    /** @type {HUMAN_STATUS_SOCKET_MESSAGE} */
                    let data = JSON.parse(rest);
                    if(this.humans[data.id]) {
                        this.humans[data.id].updateStatuses(data);
                    }
                    break;
                }
                case 'humanData': {
                    /** @type {HUMAN_DATA} */
                    let humanData = JSON.parse(rest);
                    this.#humanDataQueue.resolve(humanData.id, humanData);
                    break;
                }
                case 'plotStatus': {
                    /** @type {PLOT_STATUS} */
                    let plotStatus = JSON.parse(rest);
                    if(this.plots[plotStatus.id]) {
                        this.plots[plotStatus.id].updateStatus(plotStatus);
                    }
                    break;
                }
                case 'log': {
                    try {
                        console.log('serverLog -', JSON.parse(rest));
                    } catch(err) {

                    }
                    break;
                }
            }
        }
    }

    createHumansLayer = () => {
        return new Promise(async (resolve, reject) => {
            this.spriteHuman = new Sprite(this);
            await this.spriteHuman.get('human');
            this.humanDisplayWidth = this.spriteHuman.width/this.requiredFactor;
            this.humanDisplayHeight = this.spriteHuman.height/this.requiredFactor;
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
                            this.humans[set.id] = new DisplayedHuman(this, set.id, set.pos, set.action);
                        });
                        this.lastFetchTime = performance.now() - startTime;
                        if(this.lastFetchTime < this.tickTime) {
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
            this.socket.addEventListener("close", () => {
                this.bluescreen(503);
                reject(503);
            });
            this.socket.addEventListener("error", (event) => {
                this.socket.close(); //@ts-ignore
                this.bluescreen(event);
                reject(event);
            });
        });
    }

    createMap = () => {
        return new Promise(async (resolve, reject) => {
            this.spritePlot = new Sprite(this);
            Promise.all([fetch(`${this.serverUrl}/sprite/tile`), fetch(`${this.serverUrl}/rawMap`), fetch(`${this.serverUrl}/plots`), fetch(`${this.serverUrl}/sprite/nature`), fetch(`${this.serverUrl}/sprite/water`), this.spritePlot.get('plot')]).then(async ([responseSpriteTile, response, responsePlots, responseSpriteNature, responseSpriteWater]) => {
                if(response.status == 200 && responseSpriteTile.status == 200 && responseSpriteNature.status == 200 && responseSpriteWater.status == 200) {
                    /** @type {RAW_MAP} */
                    const responseJson = await response.json();
                    /** @type {Array<{id: Number, pos: import("../../simulation/path").pos, squares: Array<import("../../simulation/path").pos>, name: String, adress: String, isHospitality: Boolean}>} */
                    const responseJsonPlots = await responsePlots.json();
                    /** @type {SPRITE} */
                    const jsonSpriteTile = await responseSpriteTile.json();
                    /** @type {SPRITE} */
                    const jsonSpriteNature = await responseSpriteNature.json();
                    /** @type {SPRITE} */
                    const jsonSpriteWater = await responseSpriteWater.json();
                    if(Array.isArray(responseJson) && Array.isArray(jsonSpriteTile?.data) && Array.isArray(jsonSpriteNature?.data) && Array.isArray(jsonSpriteWater?.data)) {
                        if(responseJson.length > 0 && jsonSpriteTile.data.length > 0 && jsonSpriteNature.data.length > 0 && jsonSpriteWater.data.length > 0) {
                            if(Array.isArray(responseJson[0]) && Array.isArray(jsonSpriteTile.data[0]) && Array.isArray(jsonSpriteNature.data[0]) && Array.isArray(jsonSpriteWater.data[0])) {
                                if(responseJson[0].length > 0 && jsonSpriteTile.data[0].length > 0 && jsonSpriteNature.data[0].length > 0 && jsonSpriteWater.data[0].length > 0) {
                                    this.plotDisplayWidth = this.spritePlot.width / this.requiredFactor;
                                    this.plotDisplayHeight = this.spritePlot.height / this.requiredFactor;
                                    this.mapSize = {width: responseJson.length, height: responseJson[0].length};

                                    let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);

                                    this.mapCanvas = Utils.createAndAppendHTMLElement(this.mapScreen, 'canvas', ['screen-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
                                    this.plotsCanvas = Utils.createAndAppendHTMLElement(this.plotsScreen, 'canvas', ['screen-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
                                    this.plotsCanvasCTX = this.plotsCanvas.getContext('2d');
                                    this.plotsCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                                    this.mapCanvasCTX = this.mapCanvas.getContext('2d');
                                    this.mapCanvasCTX.fillStyle = colors.color3.dark["color3-dark-90"];
                                    this.mapCanvasCTX.fillRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                                    responseJson.forEach((column, column_id) => {
                                        column.forEach((point, row_id) => {
                                            switch(point.t) {
                                                case "W": {
                                                    Sprite.draw(this.mapCanvasCTX, {x: column_id * this.mapScalingFactor, y: row_id * this.mapScalingFactor}, this.mapScalingFactor, this.requiredFactor, jsonSpriteWater, colors.color10.base);
                                                    break;
                                                }
                                                case "N": {
                                                    Sprite.draw(this.mapCanvasCTX, {x: column_id * this.mapScalingFactor, y: row_id * this.mapScalingFactor}, this.mapScalingFactor, this.requiredFactor, jsonSpriteNature, colors.color3.base);
                                                    break;
                                                }
                                                case "B": {
                                                    Sprite.draw(this.mapCanvasCTX, {x: column_id * this.mapScalingFactor, y: row_id * this.mapScalingFactor}, this.mapScalingFactor, this.requiredFactor, jsonSpriteTile, colors.color3.base);
                                                    break;
                                                }
                                                case "S": {
                                                    break;
                                                }
                                            }
                                        });
                                    });

                                    this.plotsCanvasCTX.fillStyle = colors.color3.dark["color11-dark-90"];
                                    responseJsonPlots.forEach((plotData) => {
                                        /** @type {Plot|Hospitality} */
                                        let newPlot;
                                        if(plotData.isHospitality) { //@ts-ignore
                                            newPlot = new Hospitality(this, plotData);
                                        } else {
                                            newPlot = new Plot(this, plotData);
                                        }
                                        this.plots.push(newPlot);
                                        if(plotData.isHospitality) {
                                            if(Array.isArray(plotData.squares)) {
                                                plotData.squares.forEach((pos) => {
                                                    Sprite.draw(this.mapCanvasCTX, {x: pos.x * this.mapScalingFactor, y: pos.y * this.mapScalingFactor}, this.mapScalingFactor, this.requiredFactor, jsonSpriteTile, colors.color3.dark["color3-dark-90"]);
                                                });
                                            } else { //@ts-ignore
                                                Sprite.draw(this.mapCanvasCTX, {x: plotData.squares.x * this.mapScalingFactor, y: plotData.squares.y * this.mapScalingFactor}, this.mapScalingFactor, this.requiredFactor, jsonSpriteTile, colors.color3.dark["color3-dark-90"]); //@ts-ignore
                                            } 
                                            this.spritePlot.draw(this.plotsCanvasCTX, {x: newPlot.renderedPos.x - ((this.plotDisplayWidth / 2) * this.mapScalingFactor), y: newPlot.renderedPos.y - ((this.plotDisplayHeight / 2) * this.mapScalingFactor)}, this.mapScalingFactor, this.requiredFactor, colors.color6.base);

                                        }
                                    });
                                    this.spriteTile = jsonSpriteTile;

                                    this.mapWindowCont.appendChild(this.mapScreen);
                                    this.mapWindowCont.appendChild(this.plotsScreen);
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
            }, (e) => {
                console.log(e);
                reject(503);
            });
        });
    }

    getIntrestsData = () => {
        return new Promise(async (res) => {
            const response = await fetch(`${this.serverUrl}/intrests`);
            const responseJson = await response.json();
            this.intrestsData.intrests = responseJson.intrests;
            this.intrestsData.categories = responseJson.categories;
            res(true);
        });
    }

    init = () => {
        return new Promise((resolve, reject) => {
            Promise.all([this.createMap(), this.getIntrestsData()]).then((res) => {
                console.log(this.intrestsData);
            //   resolve(true);
                this.createHumansLayer().then((_res) => {
                    // this.magnifyingGlass = new MagnifyingGlass(this);
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

    /** @param {Number} code */
    bluescreen = async (code) => {
        this.removeLoader().then(() => {
            this.appCont.classList.add('bluescreen');
            this.appCont.innerHTML = `<div class="bluescreen-msg"><p class="main-msg">Cannot connect to server, error code <span class="code">${JSON.stringify(code)}</span></p><p class="reslove">Please try again later...</p></div>`;
        });
        const trySocket = () => {
            const socket = new WebSocket(this.wsUrl);
            socket.addEventListener('open', () => {
                window.location.reload();
            });
            socket.addEventListener('error', (event) => {
                try {
                    socket.close();
                    this.appCont.innerHTML = `<div class="bluescreen-msg"><p class="main-msg">Cannot connect to server, error code <span class="code">${JSON.stringify(event)}</span></p><p class="reslove">Please try again later...</p></div>`;
                    setTimeout(() => {
                        trySocket();
                    }, 2000);
                } catch(err) {
                    this.bluescreen(err);
                }
            });
        }
        setTimeout(() => {
            trySocket();
        });
    }

    globalResizeHandler = () => {
        if(this.startWidth < 600) {
            if(window.outerWidth >= 600) {
                window.location.reload();
            }
        } else {
            if(window.outerWidth < 600) {
                window.location.reload();
            }
        }
    }

    /**
     * @typedef {Object} OptionEntryConfig
     * @property {String} name
     * @property {String} displayName
     * @property {{enabled: String, disabled: String}} [toolTips]
     * @property {() => boolean} statusGetter
     * @property {(val: Boolean) => void} statusSetter
     * @property {Boolean} [startStatus]
     */

    /**
     * @typedef {Object} OptionEntry
     * @property {HTMLElement} element
     * @property {HTMLElement} nameElement
     * @property {HTMLElement} tooltipElement
     * @property {Boolean} enabled
     * @property {Boolean} eventsEnabled
     * @property {String} name
     * @property {String} displayName
     * @property {{enabled: String, disabled: String}} toolTips
     * @property {() => void} silentDisable
     * @property {() => void} silentEnable
     * @property {{statusGetter: () => boolean, statusSetter: (val: Boolean) => void}} config
     */

    /**
     * @typedef {Object} OptionsMenu_base
     * @property {{hover: Boolean, hoverOut: Boolean, click: Boolean, clickElsewhere: Boolean}} hasEvent
     * @property {() => void} enableEvents
     * @property {() => void} disableEvents
     * @property {() => void} onHover
     * @property {() => void} onHoverOut
     * @property {() => void} onClick
     * @property {() => void} onClickElsehwere
     * @property {() => void} toggle
     * @property {HTMLElement} cont
     * @property {HTMLButtonElement} button
     * @property {HTMLElement} listElement
     * @property {Boolean} oppened
     */

    /**
     * @template {String} T
     * @typedef {OptionsMenu_base & {options: {[key in T]: OptionEntry}}} OptionsMenu
     */

    /**
     * @template {*} T
     * @param {HTMLElement} parent 
     * @param {{[key in keyof T]: OptionEntryConfig}} list 
     * @returns {Promise<OptionsMenu<keyof T>>}
     */
    #optionsMenu = (parent, list) => {
        return new Promise(async (res) => {
            const contId = Utils.makeId(10, "optionsCont-")
            const cont = Utils.createAndAppendHTMLElement(parent, 'div', ['optionsCont'], {attibutes: {id: contId}});
            const button = Utils.createAndAppendHTMLElement(Utils.createAndAppendHTMLElement(cont, 'div', ['btn-cont']), 'button', ['closed']);
            const listParentCont = Utils.createAndAppendHTMLElement(cont, 'div', ['optionsList', 'closed']);
            const listCont = Utils.createAndAppendHTMLElement(listParentCont, 'div', ['optionsList-cont']);
            const listInner = Utils.createAndAppendHTMLElement(listCont, 'div', ['optionsList-inner']);
            const listElement = Utils.createAndAppendHTMLElement(listInner, 'menu', ['optionsList-menu']) 
            /**
             * @type {{hover: Boolean, hoverOut: Boolean, click: Boolean, clickElsewhere: Boolean}}
             */
            let hasEvent = {hover: false, hoverOut: false, click: false, clickElsewhere: false};
            let oppened = false;

            // const scrollList = new CustomScroll(listInner);

            /** @type {{[key in keyof T]: OptionEntry}} */ //@ts-ignore
            const _list = {}

            /**
             * 
             * @param {OptionEntryConfig} config 
             * @returns {OptionEntry}
             */
            const createOptionElement = (config) => {

                let hasClickEvent = false;
                let hasMouseOverEvent = false;
                let hasMouseOutEvent = false;

                const classes = ['option', `${config.name}`];
                if(config.statusGetter() || config.startStatus) {
                    classes.push("enabled");
                } else {
                    classes.push("disabled");
                }

                const optionElement = Utils.createAndAppendHTMLElement(listElement, 'li', classes);
                let tooltipElementClasses = ["toolTip", "empty"];
                let tooltipContentEnabled = '';
                let tooltipContentDisabled = '';
                if(config.toolTips) {
                    if(config.toolTips.enabled.trim() !== '') {
                        tooltipContentEnabled = `${config.toolTips.enabled}`;
                        if(config.startStatus || config.statusGetter()) {
                            tooltipElementClasses = tooltipElementClasses.slice(0, -1);
                        }
                    } else {
                        config.toolTips.enabled = '';
                    }
                    if(config.toolTips.disabled.trim() !== '') {
                        tooltipContentDisabled = `${config.toolTips.disabled}`;
                        if(!config.startStatus && !config.statusGetter()) {
                            tooltipElementClasses = tooltipElementClasses.slice(0, -1);
                        }
                    } else {
                        config.toolTips.disabled = '';
                    }
                } else {
                    config.toolTips = { enabled: '', disabled: '' };
                }

                /** @type {{statusGetter: () => boolean, statusSetter: (val: Boolean) => void}} */
                const __config = {statusGetter: config.statusGetter, statusSetter: config.statusSetter};
                
                const nameElementClasses = ["name"];
                const nameElement = Utils.createAndAppendHTMLElement(optionElement, 'p', nameElementClasses, {}, config.displayName);
                let tooltipContent = tooltipContentDisabled;
                if(config.startStatus) {
                    tooltipContent = tooltipContentEnabled;
                }
                const tooltipElement = Utils.createAndAppendHTMLElement(optionElement, 'div', tooltipElementClasses, {}, tooltipContent);

                const handleClick = () => {
                    if(__config.statusGetter()) {
                        disable();
                    } else {
                        enable();
                    }
                };

                const handleMouseOut = () => {
                    if(optionElement.classList.contains('mouseOver')) {
                        optionElement.classList.remove('mouseOver');
                    }
                    if(hasMouseOutEvent) {
                        hasMouseOutEvent = false;
                        optionElement.removeEventListener('click', handleMouseOut);
                    }
                    if(!hasMouseOverEvent) {
                        hasMouseOverEvent = true;
                        optionElement.addEventListener('click', handleMouseOver);
                    }
                };

                const handleMouseOver = () => {
                    if(!optionElement.classList.contains('mouseOver')) {
                        optionElement.classList.add('mouseOver');
                    }
                    if(!hasMouseOutEvent) {
                        hasMouseOutEvent = true;
                        optionElement.addEventListener('click', handleMouseOut);
                    }
                    if(hasMouseOverEvent) {
                        hasMouseOverEvent = false;
                        optionElement.removeEventListener('click', handleMouseOver);
                    }
                };

                const silentEnable = () => {
                    if(tooltipContentEnabled.trim() !== '') {
                        tooltipElement.innerHTML = `${tooltipContentEnabled}`;
                        if(tooltipElement.classList.contains('empty')) {
                            tooltipElement.classList.remove('empty');
                        }
                    } else {
                        tooltipElement.innerHTML = '';
                        if(!tooltipElement.classList.contains('empty')) {
                            tooltipElement.classList.add('empty');
                        }
                    }
                    if(!optionElement.classList.contains("enabled")) {
                        optionElement.classList.add("enabled");
                    }
                    if(optionElement.classList.contains("disabled")) {
                        optionElement.classList.remove("disabled");
                    }
                }

                const silentDisable = () => {
                    if(tooltipContentDisabled.trim() !== '') {
                        tooltipElement.innerHTML = `${tooltipContentDisabled}`;
                        if(tooltipElement.classList.contains('empty')) {
                            tooltipElement.classList.remove('empty');
                        }
                    } else {
                        tooltipElement.innerHTML = '';
                        if(!tooltipElement.classList.contains('empty')) {
                            tooltipElement.classList.add('empty');
                        }
                    }
                    if(!optionElement.classList.contains("disabled")) {
                        optionElement.classList.add("disabled");
                    }
                    if(optionElement.classList.contains("enabled")) {
                        optionElement.classList.remove("enabled");
                    }
                }


                const enable = () => {
                    __config.statusSetter(true);
                    silentEnable();
                };

                const disable = () => {
                    __config.statusSetter(false);
                    silentDisable();
                };

                const enableEvents = () => {
                    if(optionElement.classList.contains('mouseOver')) {
                        optionElement.classList.remove('mouseOver');
                    }
                    if(!hasClickEvent) {
                        hasClickEvent = true;
                        optionElement.addEventListener('click', handleClick);
                    }
                    if(hasMouseOutEvent) {
                        hasMouseOutEvent = false;
                        optionElement.removeEventListener('click', handleMouseOut);
                    }
                    if(!hasMouseOverEvent) {
                        hasMouseOverEvent = true;
                        optionElement.addEventListener('click', handleMouseOver);
                    }
                };

                const disableEvents = () => {
                    if(optionElement.classList.contains('mouseOver')) {
                        optionElement.classList.remove('mouseOver');
                    }
                    if(hasClickEvent) {
                        hasClickEvent = false;
                        optionElement.removeEventListener('click', handleClick);
                    }
                    if(hasMouseOutEvent) {
                        hasMouseOutEvent = false;
                        optionElement.removeEventListener('click', handleMouseOut);
                    }
                    if(hasMouseOverEvent) {
                        hasMouseOverEvent = false;
                        optionElement.removeEventListener('click', handleMouseOver);
                    }
                };

                /** @type {OptionEntry} */ //@ts-ignore
                let optionEntry = {
                    element: optionElement,
                    nameElement: nameElement,
                    tooltipElement: tooltipElement
                };
                Object.defineProperty(optionEntry, "enabled", {
                    set: (val) => {
                        if(val) {
                            enable();
                        } else {
                            disable();
                        }
                    },
                    get: () => {
                        return config.statusGetter();
                    },
                    enumerable: true
                });
                Object.defineProperty(optionEntry, "eventsEnabled", {
                    set: (val) => {
                        if(val) {
                            enableEvents();
                        } else {
                            disableEvents();
                        }
                    },
                    get: () => {
                        return hasClickEvent || hasMouseOverEvent || hasMouseOutEvent;
                    },
                    enumerable: true
                });
                Object.defineProperty(optionEntry, "displayName", {
                    set: (val) => {
                        config.displayName = val;
                        nameElement.innerHTML = `${val}`;
                    },
                    get: () => {
                        return config.displayName;
                    },
                    enumerable: true
                });
                let __toolTips = {};
                Object.defineProperty(__toolTips, 'enabled', {
                    set: (val) => {
                        tooltipContentEnabled = `${val}`;
                        if(__config.statusGetter()) {
                            tooltipElement.innerHTML = `${tooltipContentEnabled}`;
                            if(tooltipContentEnabled.trim() !== '') {
                                if(tooltipElement.classList.contains('empty')) {
                                    tooltipElement.classList.remove('empty');
                                }
                            } else {
                                if(!tooltipElement.classList.contains('empty')) {
                                    tooltipElement.classList.add('empty');
                                }
                            }
                        }
                    },
                    get: () => {
                        return tooltipContentEnabled;
                    },
                    enumerable: true
                });
                Object.defineProperty(__toolTips, 'disabled', {
                    set: (val) => {
                        tooltipContentDisabled = `${val}`;
                        if(!__config.statusGetter()) {
                            tooltipElement.innerHTML = `${tooltipContentDisabled}`;
                            if(tooltipContentDisabled.trim() !== '') {
                                if(tooltipElement.classList.contains('empty')) {
                                    tooltipElement.classList.remove('empty');
                                }
                            } else {
                                if(!tooltipElement.classList.contains('empty')) {
                                    tooltipElement.classList.add('empty');
                                }
                            }
                        }
                    },
                    get: () => {
                        return tooltipContentDisabled;
                    },
                    enumerable: true
                });
                optionEntry.toolTips = __toolTips;
                Object.defineProperty(optionEntry, "name", {
                    set: (val) => {
                        if(val.trim() !== '' && val.trim().toLowerCase() !== config.name.trim().toLowerCase()) {
                            if(optionElement.classList.contains(config.name)) {
                                optionElement.classList.replace(config.name, val.trim());
                            }
                            config.name = val.trim();
                        }
                    },
                    get: () => {
                        return config.name;
                    },
                    enumerable: true
                });

                Object.defineProperty(optionEntry, "config", {
                    set: (val) => {
                        __config.statusGetter = val.statusGetter;
                        __config.statusSetter = val.statusSetter;
                        config.statusGetter = val.statusGetter;
                        config.statusSetter = val.statusSetter;
                    },
                    get: () => {
                        const ___config = {};
                        Object.defineProperty(___config, "statusGetter", {
                            set: (val) => {
                                __config.statusGetter = val;
                                config.statusGetter = val;
                            },
                            get: () => {
                                return __config.statusGetter;
                            },
                            enumerable: true
                        });
                        Object.defineProperty(___config, "statusSetter", {
                            set: (val) => {
                                __config.statusSetter = val;
                                config.statusSetter = val;
                            },
                            get: () => {
                                return __config.statusSetter;
                            },
                            enumerable: true
                        });
                        return ___config;
                    },
                    enumerable: true
                });
                
                Object.defineProperty(optionEntry, 'silentDisable', {
                    set: () => {},
                    get: () => {
                        return silentDisable;
                    },
                    enumerable: true
                });

                Object.defineProperty(optionEntry, 'silentEnable', {
                    set: () => {},
                    get: () => {
                        return silentEnable;
                    },
                    enumerable: true
                });

                return optionEntry;
            }

            Object.keys(list).forEach((key) => {
                _list[`${key}`] = createOptionElement(list[`${key}`])
            });

            /** @type {PromiseWithResolvers<Boolean>} */
            let closingPromsise = Promise.withResolvers();
            /** @type {PromiseWithResolvers<Boolean>} */
            let openingPromise = Promise.withResolvers();

            const onHover = () => {
                if(!cont.classList.contains("mouseOver")) {
                    cont.classList.add("mouseOver");
                }
                if(!button.classList.contains("mouseOver")) {
                    button.classList.add("mouseOver");
                }
                if(hasEvent.hover) {
                    hasEvent.hover = false;
                    cont.removeEventListener("pointerover", onHover);
                }
                if(!hasEvent.hoverOut) {
                    hasEvent.hoverOut = true;
                    cont.addEventListener("pointerout", onHoverOut);
                }
            }

            const onHoverOut = () => {
                if(cont.classList.contains("mouseOver")) {
                    cont.classList.remove("mouseOver");
                }
                if(button.classList.contains("mouseOver")) {
                    button.classList.remove("mouseOver");
                }
                if(!hasEvent.hover) {
                    hasEvent.hover = true;
                    cont.addEventListener("pointerover", onHover);
                }
                if(hasEvent.hoverOut) {
                    hasEvent.hoverOut = false;
                    cont.removeEventListener("pointerout", onHoverOut);
                }
            }

            let clickElsewhere = new ClickElewhereEvent(cont, () => {
                close();
            }, contId);

            const close = () => {
                Promise.all([closingPromsise.promise, openingPromise.promise]).then(() => {
                    if(listParentCont.classList.contains("opened") || listParentCont.classList.contains("opening")) {
                        Object.keys(_list).forEach((key) => {
                            _list[key].eventsEnabled = false;
                        });
                        closingPromsise = Promise.withResolvers();
                        let waitTime = 0;
                        if(listParentCont.classList.contains("opened")) {
                            listParentCont.classList.remove("opened");
                        }
                        if(listParentCont.classList.contains("opening")) {
                            listParentCont.classList.remove("opening");
                        }
                        if(!listParentCont.classList.contains("closing")) {
                            listParentCont.classList.add("closing");
                        }
                        if(!button.classList.contains('closing')) {
                            button.classList.add("closing");
                        }
                        clickElsewhere.enabled = false;
                        waitTime = Utils.getTransitionTime(listParentCont);
                        setTimeout(() => {
                            // scrollList.dettachObserver();
                            if(!listParentCont.classList.contains("closed")) {
                                listParentCont.classList.add("closed");
                            }
                            if(listParentCont.classList.contains("opened")) {
                                listParentCont.classList.remove("opened");
                            }
                            if(listParentCont.classList.contains("opening")) {
                                listParentCont.classList.remove("opening");
                            }
                            if(listParentCont.classList.contains("closing")) {
                                listParentCont.classList.remove("closing");
                            }
                            if(!button.classList.contains("closed")) {
                                button.classList.add("closed");
                            }
                            if(button.classList.contains("opened")) {
                                button.classList.remove("opened");
                            }
                            if(button.classList.contains("opening")) {
                                button.classList.remove("opening");
                            }
                            if(button.classList.contains("closing")) {
                                button.classList.remove("closing");
                            }
                            oppened = false;
                            closingPromsise.resolve(false);
                        }, waitTime);
                    }
                });
            }

            /**
             * @returns {Promise<Number>}
             */
            const getTargetHeight = () => {
                return new Promise((__res) => {
                    if(!listParentCont.classList.contains('init')) {
                        listParentCont.classList.add('init');
                    }
                    if(!listParentCont.classList.contains('noTransition')) {
                        listParentCont.classList.add('noTransition');
                    }
                    setTimeout(() => {
                        let hTest = listInner.offsetHeight;
                        let bTest = listInner.getBoundingClientRect().height;
                        let sTest = listInner.scrollHeight;
                        let borderTop = Utils.getCssValueAsNumber(listCont, 'border-top-width');
                        let borderBottom = Utils.getCssValueAsNumber(listCont, 'border-bottom-width');
                        let paddingTop = Utils.getCssValueAsNumber(listCont, 'padding-top');
                        let paddingBottom = Utils.getCssValueAsNumber(listCont, 'padding-bottom');
                        setTimeout(() => {
                            if(listParentCont.classList.contains('init')) {
                                listParentCont.classList.remove('init');
                            }
                            listParentCont.offsetHeight;
                            listCont.offsetHeight;
                            setTimeout(() => {
                                if(listParentCont.classList.contains('noTransition')) {
                                    listParentCont.classList.remove('noTransition');
                                }
                                setTimeout(() => {
                                    listParentCont.offsetHeight;
                                    listCont.offsetHeight;
                                    if(hTest <= 0) {
                                        hTest = sTest;
                                        if(bTest <= 0) {
                                            __res(hTest + (borderBottom + borderTop + paddingTop + paddingBottom));
                                        } else if(hTest <= 0) {
                                            __res(bTest + (borderBottom + borderTop + paddingTop + paddingBottom));
                                        } else {
                                            __res(Math.min(hTest, bTest) + (borderBottom + borderTop + paddingTop + paddingBottom));
                                        }
                                    } else {
                                        __res(Math.max(hTest, bTest) + (borderBottom + borderTop + paddingTop + paddingBottom));
                                    }
                                });
                            });
                        });
                    });
                });
            }


            const open = async () => {
                Promise.all([closingPromsise.promise, openingPromise.promise]).then(async () => {
                    if(listParentCont.classList.contains("closed") || listParentCont.classList.contains("closing")) {
                        openingPromise = Promise.withResolvers();
                        Object.keys(_list).forEach((key) => {
                            _list[key].eventsEnabled = true;
                        });
                        let waitTime = 0;
                        if(listParentCont.classList.contains("closing")) {
                            listParentCont.classList.remove("closing");
                        }
                        if(listParentCont.classList.contains("closed")) {
                            listParentCont.classList.remove("closed");
                        }
                        let targetHeight = await getTargetHeight();
                        listParentCont.style.setProperty('--targetHeight', `${targetHeight}px`);
                        if(!listParentCont.classList.contains("opening")) {
                            listParentCont.classList.add("opening");
                        }
                        if(!button.classList.contains("opening")) {
                            button.classList.add("opening");
                        }
                        waitTime = Utils.getTransitionTime(listParentCont);
                        // scrollList.attachObserver();
                        clickElsewhere.enabled = true;
                        Object.keys(_list).forEach((key) => {
                            _list[key].enableEvents = true;
                        });
                        setTimeout(() => {
                            if(!listParentCont.classList.contains("opened")) {
                                listParentCont.classList.add("opened");
                            }
                            if(listParentCont.classList.contains("opening")) {
                                listParentCont.classList.remove("opening");
                            }
                            if(listParentCont.classList.contains("closing")) {
                                listParentCont.classList.remove("closing");
                            }
                            if(listParentCont.classList.contains("closed")) {
                                listParentCont.classList.remove("closed");
                            }
                            if(!button.classList.contains("opened")) {
                                button.classList.add("opened");
                            }
                            if(button.classList.contains("opening")) {
                                button.classList.remove("opening");
                            }
                            if(button.classList.contains("closing")) {
                                button.classList.remove("closing");
                            }
                            if(button.classList.contains("closed")) {
                                button.classList.remove("closed");
                            }
                            oppened = true;
                            openingPromise.resolve(false);
                        }, waitTime);
                    }
                });
            }

            const toggle = () => {
                if(oppened) {
                    oppened = false;
                    close();
                } else {
                    oppened = true;
                    open();
                }
            }

            const onClickElsehwere = () => {
                close();
            }

            const onClick = () => {
                if(oppened) {
                    close();
                } else {
                    open();
                }
            }

            const disableEvents = () => {
                if(cont.classList.contains("mouseOver")) {
                    cont.classList.remove("mouseOver");
                }
                if(!cont.classList.contains("disabled")) {
                    cont.classList.add("disabled");
                }
                if(!button.classList.contains("disabled")) {
                    button.classList.add("disabled");
                }
                if(button.classList.contains("mouseOver")) {
                    button.classList.remove("mouseOver");
                }
                if(hasEvent.click) {
                    hasEvent.click = false;
                    button.removeEventListener("click", onClick);
                }
                if(hasEvent.hover) {
                    hasEvent.hover = false;
                    cont.removeEventListener("pointerover", onHover);
                }
                if(hasEvent.hoverOut) {
                    hasEvent.hoverOut = false;
                    cont.removeEventListener("pointerout", onHoverOut);
                }
            }

            const enableEvents = () => {
                if(cont.classList.contains("mouseOver")) {
                    cont.classList.remove("mouseOver");
                }
                if(button.classList.contains("mouseOver")) {
                    button.classList.remove("mouseOver");
                }
                if(cont.classList.contains("disabled")) {
                    cont.classList.remove("disabled");
                }
                if(button.classList.contains("disabled")) {
                    button.classList.remove("disabled");
                }
                if(!hasEvent.click) {
                    hasEvent.click = true
                    button.addEventListener("click", onClick);
                }
                if(!hasEvent.hover) {
                    hasEvent.hover = true;
                    cont.addEventListener("pointerover", onHover);
                }
                if(hasEvent.hoverOut) {
                    hasEvent.hoverOut = false;
                    cont.removeEventListener("pointerout", onHoverOut);
                }
            }

            closingPromsise.resolve(false);
            openingPromise.resolve(false);
            //@ts-ignore
            /** @type {OptionsMenu<keyof T>} */ //@ts-ignore
            let menuCont = {
                cont: cont,
                options: _list,
                toggle: toggle,
                onClickElsehwere: onClickElsehwere,
                onClick: onClick,
                hasEvent: hasEvent,
                disableEvents: disableEvents,
                enableEvents: enableEvents,
                onHover: onHover,
                onHoverOut: onHoverOut,
                button: button
            };

            res(menuCont);
        });
    }
    
    constructor(params) {
        window.addEventListener('resize', this.globalResizeHandler);
        if(window.location.protocol == 'https:') {
            this.wsUrl = `wss://${window.location.hostname}:3001`;
            this.serverUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
        } else {
            this.wsUrl = `ws://${window.location.hostname}:3000`;
            this.serverUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
        }
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
        if(this.plotDisplayWidth <= 0) {
            this.plotDisplayWidth = 1;
        }
        if(this.plotDisplayHeight <= 0) {
            this.plotDisplayHeight = 1;
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
            let mapCanBeFullscreen = true;
            if(this.startWidth < 600) {
                mapCanBeFullscreen = false;
            }
            this.#mapWindow = new DisplayWindow(this.mapWindowCont, {className: 'map-window', id: 'map-window', type: 'map-window', name: 'Mapa', behaviour: {close: false, fullscreen: mapCanBeFullscreen}, startFullscreen: !mapCanBeFullscreen, size: {width: this.mapSize.width * factor, height: (this.mapSize.height * factor) + 35}, pos: {x: 10, y: 10}, aspectRatioScaling: true});
            this.appCont.appendChild(this.#mapWindow.window);
            setTimeout(async () => {
                const mapZoomControlCont = Utils.createAndAppendHTMLElement(this.mapWindowCont, 'div', ['zoom-controls'], {css: {'--percent': `0%`, '--percentText': `'0 %'`} }, '<div class="bar"><div class="bar-inner"></div></div><div class="thumb"><div class="thumb-inner"></div></div>');

                
                this.optionsMenu = await this.#optionsMenu(this.mapWindowCont, {
                    magnifyingGlass: {
                        displayName: "Lupa",
                        // toolTips: { enabled: 'Ukryj Lupę', disabled: "Pokaż lupę" },
                        statusGetter: () => {
                            return this.viewOptions.glassOpened;
                        },
                        name: "magnifyingGlass",
                        statusSetter: (val) => {}
                    },
                    plotsVisible: {
                        displayName: "Lokale",
                        statusGetter: () => {
                            return this.viewOptions.plotsVisible;
                        },
                        name: "plotsVisible",
                        statusSetter: (val) => {
                            if(val) {
                                this.viewOptions.plotsVisible = true;
                                if(this.plotsScreen.classList.contains('hidden')) {
                                    this.plotsScreen.classList.remove('hidden');   
                                }
                                this.plots.forEach((plot) => {
                                    if(plot.isHospitality) {
                                        plot.squares.forEach((pos) => {
                                            Sprite.draw(this.mapCanvasCTX, {x: pos.x * this.mapScalingFactor, y: pos.y * this.mapScalingFactor}, this.mapScalingFactor, this.requiredFactor, this.spriteTile, colors.color3.dark["color3-dark-90"]);
                                        });
                                        this.spritePlot.draw(this.plotsCanvasCTX, {x: plot.renderedPos.x - ((this.plotDisplayWidth / 2) * this.mapScalingFactor), y: plot.renderedPos.y - ((this.plotDisplayHeight / 2) * this.mapScalingFactor)}, this.mapScalingFactor, this.requiredFactor, colors.color6.base);
                                    }
                                });
                            } else {
                                this.plotsCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                                this.plots.forEach((plot) => {
                                    plot.unHover(true);
                                    if(plot.isHospitality) {
                                        plot.squares.forEach((pos) => {
                                            Sprite.draw(this.mapCanvasCTX, {x: pos.x * this.mapScalingFactor, y: pos.y * this.mapScalingFactor}, this.mapScalingFactor, this.requiredFactor, this.spriteTile, colors.color3.base);
                                        });
                                    }
                                });
                                this.viewOptions.plotsVisible = false;
                                if(!this.plotsScreen.classList.contains('hidden')) {
                                    this.plotsScreen.classList.add('hidden');
                                }
                                if(this.fakeScreen.classList.contains('hoverPlot')) {
                                    this.fakeScreen.classList.remove('hoverPlot');
                                }
                            }
                            if(this.magnifyingGlass) {
                                this.magnifyingGlass.mapCanvasCtx.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                                this.magnifyingGlass.plotsCanvasCtx.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                                this.magnifyingGlass.mapCanvasCtx.drawImage(this.mapCanvas, 0, 0);
                                this.magnifyingGlass.plotsCanvasCtx.drawImage(this.plotsCanvas, 0, 0);
                            }
                        }
                    },
                    humansInPlots: {
                        displayName: "Osoby w lokalach",
                        statusGetter: () => {
                            return this.viewOptions.humansInPlots
                        },
                        name: "humansInPlots",
                        statusSetter: (val) => {
                            this.viewOptions.humansInPlots = val;
                        }
                    }
                });

                const magnifyingGlassSetter = (val) => {
                    if(val) {
                        if(!this.viewOptions.glassOpened) {
                            this.viewOptions.glassOpened = true;
                        }
                        if(this.magnifyingGlass) {
                            this.focusInfoWindow(this.magnifyingGlass.windowEl);
                            this.flickerDisplayWindow(this.magnifyingGlass.windowEl);
                        } else {
                            this.magnifyingGlass = new MagnifyingGlass(this, () => {});
                        }
                    } else {
                        if(this.viewOptions.glassOpened) {
                            this.viewOptions.glassOpened = false;
                        }
                        if(this.magnifyingGlass) {
                            this.magnifyingGlass.close();
                        }
                    }
                }

                this.optionsMenu.enableEvents();

                this.optionsMenu.options.magnifyingGlass.config.statusSetter = magnifyingGlassSetter

                if(!mapCanBeFullscreen) {
                    this.mapMinDisplayScale = Math.ceil((this.mapWindowCont.offsetHeight/this.mapSizeScaled.height)*1000);
                } else {
                    this.mapMinDisplayScale = Math.ceil((this.mapWindowCont.offsetWidth/this.mapSizeScaled.width)*1000);
                }

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
                    this.humanPixelHeight = (this.mapScalingFactor * this.humanDisplayHeight)*(this.currentMapDisplayScale/1000);
                    this.plotPixelWidth = (this.mapScalingFactor * this.plotDisplayWidth) * (this.currentMapDisplayScale / 1000);
                    this.plotPixelHeight = (this.mapScalingFactor * this.plotDisplayHeight) * (this.currentMapDisplayScale / 1000);
                    this.mapWindowCont.style.setProperty('--humanPixelWidth', `${Utils.roundToFraction(this.humanPixelWidth, 2)}px`);
                    this.mapWindowCont.style.setProperty('--humanPixelHeight', `${Utils.roundToFraction(this.humanPixelHeight, 2)}px`);
                    this.mapWindowCont.style.setProperty('--plotPixelWidth', `${Utils.roundToFraction(this.plotPixelWidth, 2)}px`);
                    this.mapWindowCont.style.setProperty('--plotPixelHeight', `${Utils.roundToFraction(this.plotPixelHeight, 2)}px`);
                }

                const setFocusPointLimits = () => {
                    let boundsMap = this.fakeCanvas.getBoundingClientRect();
                    let boundsMain = this.mapWindowCont.getBoundingClientRect();
                    let sizePercent = ((this.currentMapDisplayScale - this.mapMinDisplayScale) / (this.mapMaxDisplayScale - this.mapMinDisplayScale));
                    this.mapDisplayFocusPointLimits.x.min = -50 - (90 * sizePercent);
                    this.mapDisplayFocusPointLimits.x.max = -50 + (90 * sizePercent);
                    this.mapDisplayFocusPointLimits.y.min = -50 - (80 * sizePercent);
                    this.mapDisplayFocusPointLimits.y.max = -50 + (80 * sizePercent);
                }

                const resizeInner = () => {
                    setFocusPointLimits();
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
                    this.mapWindowCont.style.setProperty('--currentMapScale', `${this.currentMapDisplayScale / 1000}`);
                    setMapCut();
                    setHumanPixelWidth();
                    this.humans.forEach((human) => {
                        human.updateTooltipPos();
                    });
                }

                const handleResize = () => {
                    if(!mapCanBeFullscreen) {
                        this.mapMinDisplayScale = Math.ceil((this.mapWindowCont.offsetHeight/this.mapSizeScaled.height)*1000);
                    } else {
                        this.mapMinDisplayScale = Math.ceil((this.mapWindowCont.offsetWidth/this.mapSizeScaled.width)*1000);
                    }
                    mapZoomInput.setAttribute('min', `${this.mapMinDisplayScale}`);
                    if(this.currentMapDisplayScale <= this.mapMinDisplayScale) {
                        this.currentMapDisplayScale = this.mapMinDisplayScale + 0;
                        resizeInner();
                    }
                }

                let hasZoomInputEvent = true;
                let hasScroolToZoomEvent = true;

                let wheelTimeout = null;

                /**
                 * @param {Number} scale
                 * @param {Boolean} [setValueOnInput=false]
                 */
                const setDisplayScale = (scale, setValueOnInput=false) => {
                    this.currentMapDisplayScale = scale;
                    if(this.currentMapDisplayScale >= this.mapMaxDisplayScale) {
                        this.currentMapDisplayScale = this.mapMaxDisplayScale + 0;
                    } else if(this.currentMapDisplayScale <= this.mapMinDisplayScale) {
                        this.currentMapDisplayScale = this.mapMinDisplayScale + 0;
                    }
                    if(setValueOnInput) {
                        mapZoomInput.value = `${this.currentMapDisplayScale}`;
                    }
                    let currentPercent = ((this.currentMapDisplayScale - this.mapMinDisplayScale) / (this.mapMaxDisplayScale - this.mapMinDisplayScale)) * 100;
                    mapZoomControlCont.style.setProperty('--percent', `${currentPercent}%`);
                    mapZoomControlCont.style.setProperty('--percentText', `'${Math.floor(currentPercent)} %'`);
                    this.mapWindowCont.style.setProperty('--currentMapScale', `${this.currentMapDisplayScale/1000}`);
                    setFocusPointLimits();
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
                    setMapCut();
                    setHumanPixelWidth();
                    this.humans.forEach((human) => {
                        human.updateTooltipPos();
                    });
                    this.plots.forEach((plot) => {
                        plot.updateTooltipPos();
                    });
                }
                
                /**
                 * @param {WheelEvent} e 
                 */
                const handleScrollToZoom = (e) => {
                    e.preventDefault();
                    if(e.deltaY !== 0) {
                        if(!this.fakeScreen.classList.contains('zooming')) {
                            this.fakeScreen.classList.add('zooming')
                        }
                        if(!mapZoomControlCont.classList.contains('zooming')) {
                            mapZoomControlCont.classList.add('zooming')
                        }
                        if(this.fakeScreen.classList.contains('dragging')) {
                            this.fakeScreen.classList.remove('dragging')
                        }
                        if(this.fakeScreen.classList.contains('hoverHuman')) {
                            this.fakeScreen.classList.remove('hoverHuman')
                        }
                        if(hasZoomInputEvent) {
                            hasZoomInputEvent = false;
                            mapZoomInput.removeEventListener('input', handleZoomInput);
                        }
                        if(zoomTimeout) {
                            clearTimeout(zoomTimeout);
                            zoomTimeout = null;
                        }
                        if(wheelTimeout) {
                            clearTimeout(wheelTimeout);
                        }
                        if(e.deltaY < 0) {
                            // let nthOfRest = Math.max(1, Math.round((this.mapMaxDisplayScale - this.currentMapDisplayScale)/100));
                            // console.log(nthOfRest);
                            setDisplayScale(this.currentMapDisplayScale + 10, true);
                        } else {
                            setDisplayScale(this.currentMapDisplayScale - 10, true);
                        }

                        wheelTimeout = setTimeout(() => {
                            if(this.fakeScreen.classList.contains('zooming')) {
                                this.fakeScreen.classList.remove('zooming')
                            }
                            if(mapZoomControlCont.classList.contains('zooming')) {
                                mapZoomControlCont.classList.remove('zooming')
                            }
                            if(zoomTimeout) {
                                clearTimeout(zoomTimeout);
                                zoomTimeout = null;
                            }
                            if(wheelTimeout) {
                                clearTimeout(wheelTimeout);
                            }
                            wheelTimeout = null;
                            if(!hasZoomInputEvent) {
                                hasZoomInputEvent = true;
                                mapZoomInput.addEventListener('input', handleZoomInput);
                            }
                        }, 100);
                    }
                }

                let zoomTimeout = null;

                const handleZoomInput = () => {
                    if(!isNaN(Number(mapZoomInput.value))) {
                        if(Number(mapZoomInput.value) >= this.mapMinDisplayScale && Number(mapZoomInput.value) <= this.mapMaxDisplayScale) {
                            if(hasScroolToZoomEvent) {
                                hasScroolToZoomEvent = false;
                                this.fakeScreen.removeEventListener('wheel', handleScrollToZoom);
                            }
                            if(!this.fakeScreen.classList.contains('zooming')) {
                                this.fakeScreen.classList.add('zooming')
                            }
                            if(!mapZoomControlCont.classList.contains('zooming')) {
                                mapZoomControlCont.classList.add('zooming')
                            }
                            if(this.fakeScreen.classList.contains('dragging')) {
                                this.fakeScreen.classList.remove('dragging')
                            }
                            if(this.fakeScreen.classList.contains('hoverHuman')) {
                                this.fakeScreen.classList.remove('hoverHuman')
                            }
                            setDisplayScale(Number(mapZoomInput.value));
                            if(zoomTimeout) {
                                clearTimeout(zoomTimeout);
                            }
                            if(wheelTimeout) {
                                clearTimeout(wheelTimeout);
                                wheelTimeout = null;
                            }
                            zoomTimeout = setTimeout(() => {
                                if(this.fakeScreen.classList.contains('zooming')) {
                                    this.fakeScreen.classList.remove('zooming')
                                }
                                if(mapZoomControlCont.classList.contains('zooming')) {
                                    mapZoomControlCont.classList.remove('zooming')
                                }
                                if(zoomTimeout) {
                                    clearTimeout(zoomTimeout);
                                }
                                if(wheelTimeout) {
                                    clearTimeout(wheelTimeout);
                                    wheelTimeout = null;
                                }
                                if(!hasScroolToZoomEvent) {
                                    hasScroolToZoomEvent = true;
                                    this.fakeScreen.addEventListener('wheel', handleScrollToZoom);
                                }
                                zoomTimeout = null;
                            }, 100);
                        }
                    }
                }

                mapZoomInput.addEventListener('input', handleZoomInput);
                this.fakeScreen.addEventListener('wheel', handleScrollToZoom);

                const resizeObserver = new ResizeObserver(handleResize);
                resizeObserver.observe(this.mapWindowCont);

                this.mapDisplayFocusPoint = {x: -50, y: -50};

                let dragStartPos = {x: 0, y: 0};

                /** 
                 * @param {TouchEvent} e
                 * @returns {MouseEvent}
                 */
                const translateTouchToMouse = (e) => {
                    let translated = Utils.translateTouchToMouse(e);
                    const fakeCanvasRect = this.fakeCanvas.getBoundingClientRect(); //@ts-ignore
                    translated.offsetX = (translated.clientX - fakeCanvasRect.left)/(this.currentMapDisplayScale/1000); //@ts-ignore
                    translated.offsetY = (translated.clientY - fakeCanvasRect.top)/(this.currentMapDisplayScale/1000);
                    return translated;
                }

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
                    this.plots.forEach((plot) => {
                        plot.updateTooltipPos();
                    });
                }

                /** @param {TouchEvent} e */
                const handleTouchDrag = (e) => {
                    handleDragMouse(translateTouchToMouse(e));
                }

                this.#mapWindow.onFullscreen = () => {
                    return new Promise((res) => {
                        for(let i = 1; i<=500; i++) {
                            setTimeout(() => {
                                this.mapMinDisplayScale = Math.ceil((this.mapWindowCont.offsetWidth / this.mapSizeScaled.width) * 1000);
                                mapZoomInput.setAttribute('min', `${this.mapMinDisplayScale}`);
                                resizeInner();
                            }, i);
                        }
                        res(true); 
                    });
                }

                /** @param {MouseEvent} e */
                const handleMouseMoveNormal = (e) => {
                    let pos = {x: e.offsetX, y: e.offsetY};
                    let half = this.mapScalingFactor*3;
                    // let half = (this.humanDisplayWidth * this.mapScalingFactor);
                    /** @type {Number|null} */
                    let hoverPlotId = null;
                    /** @type {Array<DisplayedHuman>} */
                    const humansToHover = [];
                    /** @type {Array<DisplayedHuman>} */
                    const humansToUnhover = [];

                    if(this.viewOptions.plotsVisible) {
                        for(let i = 0; i<this.plots.length; i++) {
                            if(this.plots[i].isHospitality) {
                                if((pos.x >= (this.plots[i].renderedPos.x - half) && pos.x <= (this.plots[i].renderedPos.x + half)) && (pos.y >= (this.plots[i].renderedPos.y - half) && pos.y <= (this.plots[i].renderedPos.y + half))) {
                                    hoverPlotId = i + 0;
                                    break;
                                }
                            }
                        }
                    }

                    if(hoverPlotId !== null) {
                        this.plots[hoverPlotId].hover();
                        this.plots.forEach((plot, index) => {
                            if(index != hoverPlotId) {
                                plot.unHover(true);
                            }
                        });

                        this.humans.forEach((human) => {
                            human.unHover(true);
                        });

                        if(!this.fakeScreen.classList.contains('hoverPlot')) {
                            this.fakeScreen.classList.add('hoverPlot');
                        }
                        if(this.fakeScreen.classList.contains('hoverHuman')) {
                            this.fakeScreen.classList.remove('hoverHuman');
                        }
                    } else {
                        this.humans.forEach((human) => {
                            if((pos.x >= (human.renderedPos.x - half) && pos.x <= (human.renderedPos.x + half)) && (pos.y >= (human.renderedPos.y - half) && pos.y <= (human.renderedPos.y + half)) && ((this.displayConfig.showPinnedOnly && human.pinned) || !this.displayConfig.showPinnedOnly)) {
                                humansToHover.push(human);
                            } else {
                                humansToUnhover.push(human);
                            }
                        });

                        let instant = humansToHover.length > 0;
                        humansToUnhover.forEach((human) => {
                            human.unHover(true);
                        });
                        this.plots.forEach((plot) => {
                            plot.unHover(true);
                        });
                        if(instant) {
                            if(!this.fakeScreen.classList.contains('hoverHuman')) {
                                this.fakeScreen.classList.add('hoverHuman');
                            }
                            humansToHover.forEach((human) => {
                                human.hover();
                            });
                        } else {
                            if(this.fakeScreen.classList.contains('hoverHuman')) {
                                this.fakeScreen.classList.remove('hoverHuman');
                            }
                        }
                        if(this.fakeScreen.classList.contains('hoverPlot')) {
                            this.fakeScreen.classList.remove('hoverPlot');
                        }
                    }

                    if(this.magnifyingGlass) {
                        this.magnifyingGlass.sendCords(pos);
                    }


                    if(zoomTimeout) {
                        clearTimeout(zoomTimeout);
                        zoomTimeout = null;
                    }
                    if(this.fakeScreen.classList.contains('dragging')) {
                        this.fakeScreen.classList.remove('dragging')
                    }
                    if(this.fakeScreen.classList.contains('zooming')) {
                        this.fakeScreen.classList.remove('zooming')
                    }
                }

                /** @param {MouseEvent} e */
                const handleMouseDown = (e) => {
                    let pos = {x: e.offsetX, y: e.offsetY};
                    let half = this.mapScalingFactor*2;
                    dragStartPos = {x: pos.x+0, y: pos.y+0};

                    let hasClickedOnPlot = false;
                    if(this.viewOptions.plotsVisible) {
                        for(let i = 0;i < this.plots.length;i++) {
                            if(this.plots[i].isHospitality) {
                                if((pos.x >= (this.plots[i].renderedPos.x - half) && pos.x <= (this.plots[i].renderedPos.x + half)) && (pos.y >= (this.plots[i].renderedPos.y - half) && pos.y <= (this.plots[i].renderedPos.y + half))) {
                                    this.plots[i].handleClick();
                                    hasClickedOnPlot = true;
                                    break;
                                }
                            }
                        }
                    }
                    let hasClickedOnHuman = false;
                    if(!hasClickedOnPlot) {
                        this.humans.forEach((human) => {
                            if((pos.x >= (human.renderedPos.x - half) && pos.x <= (human.renderedPos.x + half)) && (pos.y >= (human.renderedPos.y - half) && pos.y <= (human.renderedPos.y + half)) && ((this.displayConfig.showPinnedOnly && human.pinned) || !this.displayConfig.showPinnedOnly)) {
                                hasClickedOnHuman = true;
                                human.handleClick();
                            }
                        });
                    }
                    if(this.fakeScreen.classList.contains('hoverHuman')) {
                        this.fakeScreen.classList.remove('hoverHuman')
                    }
                    if(this.fakeScreen.classList.contains('hoverPlot')) {
                        this.fakeScreen.classList.remove('hoverPlot');
                    }
                    if((!hasClickedOnHuman && !hasClickedOnPlot) && (!mapCanBeFullscreen || this.currentMapDisplayScale > this.mapMinDisplayScale)) {
                        mapZoomInput.disabled = true;
                        if(!mapZoomControlCont.classList.contains('disabled')) {
                            mapZoomControlCont.classList.add('disabled');
                        }
                        if(hasZoomInputEvent) {
                            hasZoomInputEvent = false;
                            mapZoomInput.removeEventListener('input', handleZoomInput);
                        }
                        if(hasScroolToZoomEvent) {
                            hasScroolToZoomEvent = false;
                            this.fakeScreen.removeEventListener('wheel', handleScrollToZoom);
                        }
                        if(zoomTimeout) {
                            clearTimeout(zoomTimeout);
                            zoomTimeout = null;
                        }
                        if(wheelTimeout) {
                            clearTimeout(wheelTimeout);
                            wheelTimeout = null;
                        }
                        if(!this.fakeScreen.classList.contains('dragging')) {
                            this.fakeScreen.classList.add('dragging');
                        }
                        this.fakeCanvas.removeEventListener('mousedown', handleMouseDown);
                        this.fakeCanvas.removeEventListener('touchstart', handleTouchStart);
                        this.fakeCanvas.removeEventListener('mousemove', handleMouseMoveNormal);
                        this.fakeCanvas.addEventListener('mousemove', handleDragMouse);
                        this.fakeCanvas.addEventListener('touchmove', handleTouchDrag);
                        this.fakeCanvas.addEventListener('mouseup', handleStopDrag);
                        this.fakeCanvas.addEventListener('touchend', handleTouchStop);
                        this.fakeCanvas.addEventListener('mouseout', handleStopDrag);
                        this.humans.forEach((human) => {
                            human.unHover(true);
                        });
                    }
                }

                /** @param {TouchEvent} e */
                const handleTouchStart = (e) => {
                    handleMouseDown(translateTouchToMouse(e));
                }

                const handleStopDrag = () => {
                    mapZoomInput.disabled = false;
                    if(mapZoomControlCont.classList.contains('disabled')) {
                        mapZoomControlCont.classList.remove('disabled');
                    }
                    if(this.fakeScreen.classList.contains('dragging')) {
                        this.fakeScreen.classList.remove('dragging');
                    }
                    if(this.fakeScreen.classList.contains('hoverHuman')) {
                        this.fakeScreen.classList.remove('hoverHuman')
                    }
                    if(this.fakeScreen.classList.contains('zooming')) {
                        this.fakeScreen.classList.remove('zooming')
                    }
                    if(zoomTimeout) {
                        clearTimeout(zoomTimeout);
                        zoomTimeout = null;
                    }
                    if(wheelTimeout) {
                        clearTimeout(wheelTimeout);
                        wheelTimeout = null;
                    }
                    this.fakeCanvas.removeEventListener('mousemove', handleDragMouse);
                    this.fakeCanvas.removeEventListener('touchmove', handleTouchDrag);
                    this.fakeCanvas.removeEventListener('mouseup', handleStopDrag);
                    this.fakeCanvas.removeEventListener('touchend', handleTouchStop);
                    this.fakeCanvas.removeEventListener('mouseout', handleStopDrag);
                    this.fakeCanvas.addEventListener('mousedown', handleMouseDown);
                    this.fakeCanvas.addEventListener('touchstart', handleTouchStart);
                    this.fakeCanvas.addEventListener('mousemove', handleMouseMoveNormal);
                    if(!hasZoomInputEvent) {
                            hasZoomInputEvent = true;
                            mapZoomInput.addEventListener('input', handleZoomInput);
                    }
                    if(!hasScroolToZoomEvent) {
                        hasScroolToZoomEvent = true;
                        this.fakeScreen.addEventListener('wheel', handleScrollToZoom);
                    }
                }

                const handleTouchStop = () => {
                    handleStopDrag();
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
                    this.humanPixelHeight = (this.mapScalingFactor * this.humanDisplayHeight)*(this.currentMapDisplayScale/1000);
                    this.mapWindowCont.style.setProperty('--humanPixelWidth', `${Utils.roundToFraction(this.humanPixelWidth, 2)}px`);
                    this.mapWindowCont.style.setProperty('--humanPixelHeight', `${Utils.roundToFraction(this.humanPixelHeight, 2)}px`);
                    this.fakeCanvas.addEventListener('mousedown', handleMouseDown);
                    this.fakeCanvas.addEventListener('touchstart', handleTouchStart);
                    this.fakeCanvas.addEventListener('mousemove', handleMouseMoveNormal);
                    this.removeLoader();
                });
            });
        }, (e) => {
            console.error(e);
            this.bluescreen(e);
        });
    }
}

export {App};