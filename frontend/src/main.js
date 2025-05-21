import { Utils } from "./utils";
import { DisplayWindow } from "./window";
import { colors } from "./colors";
import { SimulationGlobals } from "./simulationGlobals";
/** @typedef {import("../../simulation/utils").HTML_TAGS} HTML_TAGS */
/** @typedef {keyof HTML_TAGS} HTML_TAG */
/** @typedef {import("../../simulation/simulation").TICK_HUMAN_DATA} TICK_HUMAN_DATA */
/** @typedef {import("../../simulation/simulation").TICK_DATA} TICK_DATA */

class DisplayedHuman {
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
    /** @type {'in home'|'walking'|'meeting'|'in hospitality'} */
    action;

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

    }

    getData = () => {
        return new Promise((res) => {

        });
    }

    /** @type {Boolean} */
    #pinned = false;
    /** @type {Boolean} */
    get pinned() {
        return this.#pinned;
    }
    /** @type {Boolean} */
    set pinned(val) {
        if(val) {
            if(!this.#pinned) {
                this.#pinned = true;
                if(!this.parent.pinnedHumanIds.includes(this.id)) {
                    this.parent.pinnedHumanIds.push(this.id);
                }
            }
            this.stopDeleteDataTimer();
        } else {
            if(this.#pinned) {
                this.#pinned = false;
                let indexof = this.parent.pinnedHumanIds.indexOf(this.id);
                if(indexof >= 0) {
                    this.parent.pinnedHumanIds = this.parent.pinnedHumanIds.slice(0, indexof).concat(this.parent.pinnedHumanIds.slice(indexof + 1))
                }
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
        this.parent.humansCanvasCTX.beginPath();
        this.parent.humansCanvasCTX.arc(startX, startY, this.parent.humanDisplayWidth * this.parent.mapScalingFactor, 0, 2*Math.PI);
        this.parent.humansCanvasCTX.fillStyle = colors.color5.light['color5-light-30'];
        this.parent.humansCanvasCTX.fill();
        this.parent.humansCanvasCTX.closePath();
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
    /** @type {String} */
    serverUrl;
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
    mapDisplayFocusPointLimits = {x: {max: 0, min: 0}, y: {max: 0, min: 0}};

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
                           }, 1);
                        }
                    }
                    waitForOrStopHelperFunc();
                });
            }


            let frames = length/this.frameTime;
            let i = 0;
            while(i < frames && !stopped) {
                // console.log(`draw frame ${i} of ${frames} in tick ${tickData.id}`);
                await waitForOrStop(this.frameTime);
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
                if(stopped) {
                    break;
                }
                i++;
            }
            drawingInstancePromise.resolve(true);
        }
        drawingInstanceFunc();
        return { stop: () => { stopped = true; console.log(`stopped animation of tick ${tickData.id}`) }, finish: drawingInstancePromise.promise };
    }

    startDataFetch = () => {
        this.tickHumans();
    }

    stopDataFetch = () => {
        if(this.humansFetchTimer) {
            clearTimeout(this.humansFetchTimer);
            this.humansFetchTimer = null;
        }
    }

    /** 
     * @param {Number} fetchTime
     * @param {TICK_DATA} lastTick
     * @returns {Promise<Boolean>}
     */
    onNewData = (fetchTime, lastTick) => {
        this.promFirstFetch.resolve(true);
        return new Promise(async (res) => {
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

    tickHumans = () => {
        let startTime = performance.now();
        const getNextTickHelperFunc = async () => {
            const setNewTimer = () => {
                this.humansFetchTimer = setTimeout(() => {
                    getNextTickHelperFunc();
                }, 10);
            }
            if(this.humansFetchTimer) {
                clearTimeout(this.humansFetchTimer);
                this.humansFetchTimer = null;
            }

            const response = await fetch(`${this.serverUrl}/tick`);
            if(response.ok) {
                /** @type {TICK_DATA} */
                const responseJson = await response.json();
                if(responseJson.id !== this.lastTick.id) {
                    this.onNewData(this.lastFetchTime + 0, JSON.parse(JSON.stringify(this.lastTick)));
                    console.log(this.lastTick, this.lastFetchTime);
                    this.lastTick = responseJson;
                    this.lastFetchTime = performance.now() - startTime;
                    this.lastFetchTime = Math.ceil(this.lastFetchTime/this.frameTime) * this.frameTime;
                    startTime = performance.now();
                }
            }
            setNewTimer();
        }
        getNextTickHelperFunc();
    }

    dispose = () => {
        this.stopDataFetch();
    }

    createHumansLayer = () => {
        return new Promise(async (resolve, reject) => {
            let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
            this.humansCanvas = Utils.createAndAppendHTMLElement(this.humansScreen, 'canvas', ['humans-canvas'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
            this.humansCanvasCTX = this.humansCanvas.getContext('2d');
            this.mapWindowCont.appendChild(this.humansScreen);
            this.pinnedHumansCanvas = Utils.createAndAppendHTMLElement(this.pinnedHumansScreen, 'canvas', ['humans-canvas', 'pinned'], {attibutes: {"width": `${this.mapSizeScaled.width}`, "height": `${this.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.mapSize.width / gdc} / ${this.mapSize.height / gdc}`, 'width': `${this.mapSizeScaled.width}px`, 'height': `${this.mapSizeScaled.height}px`}});
            this.pinnedHumansCanvasCTX = this.humansCanvas.getContext('2d');
            this.mapWindowCont.appendChild(this.pinnedHumansScreen);
            const startTime = performance.now();
            const response = await fetch(`${this.serverUrl}/tick`);
            if(response.ok) {
                this.lastTick = await response.json();
                this.lastTick.humanPos.forEach((set) => {
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
                if(!this.noSimulation) {
                    this.startDataFetch();
                    this.promFirstFetch.promise.then(() => {
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            } else {
                reject(500);
            }
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
              resolve(true);
            //     this.createHumansLayer().then((_res) => {
            //         resolve(_res);
            //     }, (code) => {
            //         setTimeout(() => {
            //             reject(code);
            //         }, 5000);
            //     });
            // }, (code) => {
            //     setTimeout(() => {
            //         reject(code);
            //     }, 5000);
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
        if(params) {
            if(params.noSimulation) {
                this.noSimulation = true;
            }
        }
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
            let factor = Utils.floorToFraction((window.innerWidth - 20) / this.mapSize.width);
            if(Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height) < factor) {
                factor = Utils.floorToFraction((window.innerHeight - 30) / this.mapSize.height);
            }

            let gdc = Utils.gcd(this.mapSize.width, this.mapSize.height);
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
                    //console.log(`{ width: ${this.mapSizeScaled.width}, height: ${this.mapSizeScaled.height}, x: ${e.offsetX}, y: ${e.offsetY}, diffX: ${diffX}, diffY: ${diffY} }`);
                    //console.log(JSON.stringify(this.mapDisplayFocusPointLimits))
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
                }

                /** @param {MouseEvent} e */
                const handleStartDrag = (e) => {
                    dragStartPos = {x: e.offsetX, y: e.offsetY}
                    mapZoomInput.disabled = true;
                    if(!this.fakeScreen.classList.contains('dragging')) {
                        this.fakeScreen.classList.add('dragging');
                    }
                    this.fakeCanvas.removeEventListener('mousedown', handleStartDrag);
                    this.fakeCanvas.addEventListener('mousemove', handleDragMouse);
                    this.fakeCanvas.addEventListener('mouseup', handleStopDrag);
                    this.fakeCanvas.addEventListener('mouseout', handleStopDrag);
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
                }

                setTimeout(() => {
                    this.mapWindowCont.style.setProperty('--currentMapScale', `${this.currentMapDisplayScale/1000}`);
                    this.mapWindowCont.style.setProperty(`--currentMapOffsetX`, `${this.mapDisplayFocusPoint.x}%`);
                    this.mapWindowCont.style.setProperty(`--currentMapOffsetY`, `${this.mapDisplayFocusPoint.y}%`);
                    this.fakeCanvas.addEventListener('mousedown', handleStartDrag);
                    this.removeLoader();
                });
            });
        });
    }
}

try {
  const app = new App();
  app.init();
} catch(err) {
  console.error(err);
}

