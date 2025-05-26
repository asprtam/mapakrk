/** @typedef {import("../../simulation/simulation").TICK_HUMAN_DATA} TICK_HUMAN_DATA */
/** @typedef {import("../../simulation/simulation").TICK_DATA} TICK_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_ACTION} HUMAN_ACTION */
/** @typedef {import("../../simulation/entites").HUMAN_DATA} HUMAN_DATA */
/** @typedef {import("../../simulation/entites").HUMAN_TARGET_TYPE} HUMAN_TARGET_TYPE */
/** @typedef {import("../../index").SPRITE} SPRITE */
/** @typedef {import("./app").App} App */
import { colors } from "./colors";
import { Utils } from "./utils";

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
            let distance = Math.sqrt(Math.pow(point0.x - point1.x, 2) + Math.pow(point0.y - point1.y, 2));
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
    draw = (pos=this.pos, log=false) => {
        let startX = Math.round(pos.x*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
        let startY = Math.round(pos.y*this.parent.mapScalingFactor) + (this.parent.mapScalingFactor/2);
        this.renderedPos = {x: startX, y: startY};
        if(log) {
            console.log(pos, this.id);
            console.log(this.renderedPos, this.id);
        }
        // let shiftX = this.parent.humanDisplayWidth * this.parent.mapScalingFactor;
        this.updateTooltipPos();
        if(this.#pinned) {
            this.parent.spriteHuman.draw(this.parent.pinnedHumansCanvasCTX, {x: this.renderedPos.x - ((this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor), y: this.renderedPos.y - ((this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor)}, this.parent.mapScalingFactor, this.parent.requiredFactor, colors.color9.light['color9-light-30']);
            // this.parent.pinnedHumansCanvasCTX.beginPath();
            // this.parent.pinnedHumansCanvasCTX.arc(startX, startY, (this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor, 0, 2*Math.PI);
            // this.parent.pinnedHumansCanvasCTX.fillStyle = colors.color9.light['color9-light-30'];
            // this.parent.pinnedHumansCanvasCTX.fill();
            // this.parent.pinnedHumansCanvasCTX.closePath();
        } else {
            this.parent.spriteHuman.draw(this.parent.humansCanvasCTX, {x: this.renderedPos.x - ((this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor), y: this.renderedPos.y - ((this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor)}, this.parent.mapScalingFactor, this.parent.requiredFactor, '#fff');
            // this.parent.humansCanvasCTX.beginPath();
            // this.parent.humansCanvasCTX.arc(startX, startY, (this.parent.humanDisplayWidth/2) * this.parent.mapScalingFactor, 0, 2*Math.PI);
            // this.parent.humansCanvasCTX.fillStyle = colors.color9.light['color9-light-30'];
            // this.parent.humansCanvasCTX.fill();
            // this.parent.humansCanvasCTX.closePath();
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
                // console.log('else nofactor', crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], 0, tickId, this.id);
                this.draw(crossedPoints[closestPrevPoint]);
            } else {
                let factor = (percent * (crossedPoints.length - 1))%1;
                let beetwenPoint = this.getBetweenPoint(crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], factor);
                if(crossedPoints[closestPrevPoint].x !== crossedPoints[closestNextPoint].x && crossedPoints[closestPrevPoint].y !== crossedPoints[closestNextPoint].y) {
                    console.log('else factor', beetwenPoint, crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], this.id, factor);
                    this.draw(beetwenPoint, true);
                } else {
                    this.draw(beetwenPoint);
                }
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

export { DisplayedHuman };