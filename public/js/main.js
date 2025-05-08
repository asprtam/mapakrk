import { Utils } from "../../simulation/utils.js";
import { DisplayWindow } from "./window.js";
import { colors } from "./colors.js";
import { SimulationGlobals } from "../../simulation/simulationGlobals.js";
/** @typedef {import("../../simulation/utils").HTML_TAGS} HTML_TAGS */
/** @typedef {keyof HTML_TAGS} HTML_TAG */

class DisplayedHuman {
    /** @type {App} */
    parent;
    /** @type {Number} */
    id;
    /** @type {{x: Number, y: Number}} */
    pos = {x: 0, y: 0};
    /** @type {Array<{x: Number, y: Number}>} */
    crossedPoints = [{x: 0, y: 0}];
    /** @type {'in home'|'walking'|'meeting'|'in hospitality'} */
    action;

    /** 
     * @param {Number} part
     * @param {Number} total
     * @returns {Promise<Boolean>}
     */
    drawPos = (part, total) => {
        return new Promise(async (res) => {
            const pointId = Math.round((part/total)*(this.crossedPoints.length-1));
            let desiredPos = {x: 0, y: 0};
            if(this.crossedPoints[pointId]) {
                desiredPos = JSON.parse(JSON.stringify(this.crossedPoints[pointId]));
            } else {
                desiredPos = JSON.parse(JSON.stringify(this.pos));
            }

            let startX = (desiredPos.x*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
            let startY = (desiredPos.y*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
            this.parent.humansCanvasCTX.beginPath();
            this.parent.humansCanvasCTX.arc(startX, startY, this.parent.humanDisplayWidth * this.parent.mapScalingFactor, 0, 2*Math.PI);
            this.parent.humansCanvasCTX.fillStyle = colors.color5.light['color5-light-30'];
            this.parent.humansCanvasCTX.fill();
            this.parent.humansCanvasCTX.closePath();

            // let p = this.parent.mapScalingFactor/this.parent.requiredFactor;
            // let startX = (desiredPos.x*this.parent.mapScalingFactor) + p;
            // let startY = (desiredPos.y*this.parent.mapScalingFactor) + p;
            // this.parent.humansCanvasCTX.fillStyle = colors.color5.base;
            // this.parent.humansCanvasCTX.fillRect(startX, startY, p*6, p*6);
            res(true);
        });
    }

    /**
     * @param {{id: Number, pos: {x: Number, y: Number}, action: 'in home'|'walking'|'meeting'|'in hospitality', crossedPoints: Array<{x: Number, y: Number}>}} data
     */
    update = (data) => {
        if(this.id == data.id) {
            this.pos = data.pos;
            this.action = data.action;
            this.crossedPoints = data.crossedPoints;
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
    }
}

class App {
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
    tickTime = SimulationGlobals.tickTime;
    /** @type {Number} */
    lastFetchTime = SimulationGlobals.tickTime + 0;
    /** @type {Number} */
    humanDisplayWidth = SimulationGlobals.humanDisplayWidth + 0;
    /** @type {Array<{id: Number, pos: {x: Number, y: Number}, action: 'in home'|'walking'|'meeting'|'in hospitality', crossedPoints: Array<{x: Number, y: Number}>}>} */
    lastFetchPos = [];
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
    /** @type {Array<DisplayedHuman>} */
    humans = [];
    /** @type {Timer|null} */
    humansFetchTimer = null;
    /** @type {Number} */
    #moveParts = 50;


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
     * @param {Number} length
     * @param {Number} parts
     * @returns {Promise<Boolean>}
     */
    drawHumans = (length=this.lastFetchTime, parts=this.#moveParts) => {
        return new Promise(async (res) => {
            parts = Math.round(parts);
            if(parts <= 1) {
                parts = 2;
            }
            length = Math.round(parts);
            if(length <= 0) {
                length = 1;
            }

            /** 
             * @param {Number} part
             * @param {Number} total
             * @param {Number} waitTime
             * @returns {Promise<Boolean>}
             */
            const helperFunc = (part, total, waitTime) => {
                return new Promise((resolveHelper) => {
                    this.humansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                    const promiseArr = [new Promise((r) => { setTimeout(() => { r(true); }, 0) })];
                    this.humans.forEach((human) => {
                            promiseArr.push(human.drawPos(part, total));
                    });
                    Promise.all(promiseArr).then(() => {
                        resolveHelper(true);
                    });
                });
            }
            for(let i = 1; i<=parts; i++) {
                await helperFunc(i, parts, Math.round((length/parts)));
            }
            setTimeout(() => {
                res(true);
            });
        });
    }

    tickHumans = async () => {
        const startTime = performance.now();
        if (this.humansFetchTimer) {
            clearTimeout(this.humansFetchTimer);
            this.humansFetchTimer = null;
        }

        this.lastFetchPos.forEach((set) => {
            this.humansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
            if (this.humans[set.id]) {
                this.humans[set.id].update(set);
            }
        });
        this.drawHumans(this.lastFetchTime+0, this.#moveParts);

        const fail = () => {
            this.lastFetchTime = Math.round(performance.now() - startTime);
            if (this.lastFetchTime < this.tickTime) {
                this.lastFetchTime = this.tickTime + 0;
            }
            this.humansFetchTimer = setTimeout(() => {
                console.log('fail', this.lastFetchTime);
                this.drawHumans(1, 1).then(() => {
                    this.tickHumans();
                });
            }, this.lastFetchTime);
        }

        const response = await fetch(`/humansPos`);
        if (response.status == 200) {
            /** @type {Array<{id: Number, pos: {x: Number, y: Number}, action: 'in home'|'walking'|'meeting'|'in hospitality', crossedPoints: Array<{x: Number, y: Number}>}>} */
            const responseJson = await response.json();
            if (Array.isArray(responseJson)) {
                this.lastFetchPos = responseJson;
                this.lastFetchPos.forEach((set) => {
                    if (this.humans[set.id]) {
                        this.humans[set.id].update(set);
                    }
                });
                this.lastFetchTime = Math.round(performance.now() - startTime);
                if (this.lastFetchTime < this.tickTime) {
                    this.lastFetchTime = this.tickTime + 0;
                }
                this.humansFetchTimer = setTimeout(() => {
                    // this.drawHumans(this.lastFetchTime + 0, this.#moveParts).then(() => {
                    //     this.tickHumans();
                    // });
                    this.tickHumans();
                }, this.lastFetchTime);
            } else {
                fail();
            }
        } else {
            fail();
        }
    }

    dispose = () => {
        if(this.humansFetchTimer) {
            clearTimeout(this.humansFetchTimer);
            this.humansFetchTimer = null;
        }
    }

    createHumansLayer = () => {
        return new Promise(async (resolve, reject) => {
            let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
            this.humansCanvas = Utils.createAndAppendHTMLElement(this.humansScreen, 'canvas', ['humans-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`}});
            this.humansCanvasCTX = this.humansCanvas.getContext('2d');
            this.mapWindowCont.appendChild(this.humansScreen);
            const startTime = performance.now()
            const response = await fetch(`/humansPos`);
            if(response.status == 200) {
                /** @type {Array<{id: Number, pos: {x: Number, y: Number}, action: 'in home'|'walking'|'meeting'|'in hospitality', crossedPoints: Array<{x: Number, y: Number}>}>} */
                const responseJson = await response.json();
                if(Array.isArray(responseJson)) {
                    responseJson.forEach((set) => {
                        this.humans[set.id] = new DisplayedHuman(this, set.id, set.pos, set.action);
                    });
                    this.lastFetchPos = responseJson;
                    this.lastFetchTime = performance.now() - startTime;
                    if(this.lastFetchTime < this.tickTime) {
                        this.lastFetchTime = this.tickTime + 0;
                    }
                    setTimeout(() => {
                        this.tickHumans();
                        resolve(true);
                    }, this.lastFetchTime);
                } else {
                    reject(500);
                }
            } else {
                reject(500);
            }
        });
    }

    createMap = () => {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(`/rawMap`);
            if(response.status == 200) {
                /** @type {Array<Array<1|0>>} */
                const responseJson = await response.json();
                if(Array.isArray(responseJson)) {
                    if(responseJson.length > 0) {
                        if(Array.isArray(responseJson[0])) {
                            if(responseJson[0].length > 0) {
                                this.mapSize = {width: responseJson.length, height: responseJson[0].length};

                                let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);

                                this.mapCanvas = Utils.createAndAppendHTMLElement(this.mapScreen, 'canvas', ['screen-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`}});
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
    
    constructor() {
        this.#loader = this.createLoader();
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
            this.removeLoader();
            let factor = Utils.floorToFraction((window.innerWidth - 20) / this.mapSize.width);
            if(Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height) < factor) {
                factor = Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height);
            }
            console.log(factor, this.mapSize, this.mapSizeScaled, this.mapScalingFactor);
            this.#mapWindow = new DisplayWindow(this, this.mapWindowCont, {className: 'map-window', id: 'map-window', type: 'map-window', name: 'Mapa', behaviour: {close: false}, size: {width: this.mapSize.width * factor, height: (this.mapSize.height * factor) + 35}, pos: {x: 10, y: 10}, aspectRatioScaling: true})
        });
    }
}

export {App};