import { Utils } from "./utils.js";
/** @typedef {import("./utils").HTML_TAGS} HTML_TAGS */
/** @typedef {import("./utils").CONTENT} CONTENT */
/** @typedef {keyof HTML_TAGS} HTML_TAG */
/** 
 * @typedef {Object} DisplayWindow_behaviourConfigOptional
 * @property {Boolean} [close] default false
 * @property {Boolean} [fullscreen] default true
 * @property {Boolean} [minimize] default true
 * @property {Boolean} [resize] default true
 * @property {Boolean} [move] default true
 */
/** 
 * @typedef {Object} DisplayWindow_behaviourConfig
 * @property {Boolean} close
 * @property {Boolean} fullscreen
 * @property {Boolean} minimize
 * @property {Boolean} resize
 * @property {Boolean} move
 */
/** 
 * @typedef {Object} DisplayWindow_creationConfig
 * @property {String|Array<String>} [className]
 * @property {String} [id]
 * @property {String} [name]
 * @property {String} [type]
 * @property {String} [desc]
 * @property {String} [icon]
 * @property {Boolean} [startFullscreen]
 * @property {DisplayWindow_behaviourConfigOptional} [behaviour]
 * @property {{width?: Number, height?: Number}} [size]
 * @property {{x?: Number, y?: Number}} [pos]
 * @property {{onClose?: () => Promise<*>, onFullscreen?: () => Promise<*>}} [funcs]
 * @property {Boolean} [aspectRatioScaling]
 */
class DisplayWindow {
    /** @type {DisplayWindow_behaviourConfig} */
    #behaviourConfig = {close: false, fullscreen: true, minimize: true, resize: true, move: true};
    /** @type {{x: Number, y: Number}} */
    #pos = {x: 0, y: 0};
    /** @type {{width: Number, height:Number}} */
    #size = {width: 100, height: 100};
    /** @type {{x: Number, y: Number}} */
    get pos() {
        return this.#pos;
    }
    /** @type {{x: Number, y: Number}} */
    set pos(_pos) {
        this.#pos = _pos;
        this.#window.style.setProperty('top', `${this.#pos.y}px`);
        this.#window.style.setProperty('left', `${this.#pos.x}px`);
    }
    /** @type {{width: Number, height:Number}} */
    get size() {
        return this.#size;
    }
    /** @type {{width: Number, height: Number}} */
    set size(_size) {
        this.#size = _size;
        if(this.#size.width < 0) {
            this.#size.width = 0;
        }
        if (this.#size.height < 0) {
            this.#size.height = 0;
        }
        this.#window.style.setProperty('width', `${this.#size.width}px`);
        this.#window.style.setProperty('height', `${this.#size.height}px`);
    }
    /** @type {HTMLElement} */
    #window;
    /** @type {HTMLElement} */
    get window () {
        return this.#window;
    }
    #focused = false;
    get focused() {
        return this.#focused;
    }
    set focused(val) {
        if(val) {
            if(!this.#window.classList.contains('focused')) {
                this.#window.classList.add('focused');
            }
        } else {
            if(this.#window.classList.contains('focused')) {
                this.#window.classList.remove('focused');
            }
        }
        this.#focused = val;
    }
    /** @type {HTMLElement} */
    #container;
    /** @type {HTMLElement} */
    #resizeContainer;
    /** @type {HTMLElement} */
    #footer;
    /** @type {HTMLElement} */
    #header;
    /** @type {HTMLElement} */
    #headerInfo;
    /** @type {HTMLElement} */
    #buttons;
    /** @type {HTMLElement} */
    #iconElement;
    /** @type {HTMLElement} */
    #nameElement;
    /** @type {HTMLElement} */
    #descElement;
    /** @type {HTMLElement} */
    #contentHolder;
    /** @type {{x: Number, y: Number}} */
    #mouseEventPos = {x: 0, y: 0};
    /** @type {HTMLElement} */
    #deco;
    /** 
     * @typedef {Object} resizeFuncs
     * @property {(e:MouseEvent) => void} down
     * @property {(e:MouseEvent) => void} move
     * @property {(e:MouseEvent) => void} up
     * @property {() => void} enable
     * @property {() => void} disable
     * @property {{up:Boolean, down: Boolean, move: Boolean}} hasEvent
     */
    /** @type {{top: resizeFuncs, topLeft: resizeFuncs, topRight: resizeFuncs, left: resizeFuncs, right: resizeFuncs, bottom: resizeFuncs, bottomRight: resizeFuncs, bottomLeft: resizeFuncs}} */
    #resizeEvents = {
        top: {
            hasEvent: {up: false, down: false, move: false},
            down: (e) => {
                this.#mouseEventPos = {x: e.clientX, y: e.clientY};
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("top");
                if (this.#resizeEvents.top.hasEvent.down) {
                    this.#resizeEvents.top.hasEvent.down = false;
                    this.#resizePoints.top.removeEventListener('mousedown', this.#resizeEvents.top.down);
                }
                if(!document.body.classList.contains('resizing-top')) {
                    document.body.classList.add('resizing-top')
                }
                if (!this.#resizeEvents.top.hasEvent.up) {
                    this.#resizeEvents.top.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.top.up);
                }
                if (!this.#resizeEvents.top.hasEvent.move) {
                    this.#resizeEvents.top.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.top.move);
                }
            },
            move: (e) => {
                let diffY = this.#mouseEventPos.y - e.clientY;
                if(this.#aspectRatioScaling) {
                    this.size = {width: (this.#size.height + diffY) * this.#aspectRatio_hw, height: (this.#size.height + diffY)};
                } else {
                    this.size = {width: this.#size.width, height: this.#size.height + diffY};
                }
                this.pos = {x: this.#pos.x, y: this.#pos.y - diffY};
                this.#mouseEventPos.y = e.clientY;
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.top.classList.contains('disabled')) {
                    this.#resizePoints.top.classList.remove('disabled');
                }
                if (this.#resizeEvents.top.hasEvent.up) {
                    this.#resizeEvents.top.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.top.up);
                }
                if (this.#resizeEvents.top.hasEvent.move) {
                    this.#resizeEvents.top.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.top.move);
                }
                if (!this.#resizeEvents.top.hasEvent.down) {
                    this.#resizeEvents.top.hasEvent.down = true;
                    this.#resizePoints.top.addEventListener('mousedown', this.#resizeEvents.top.down);
                }
                if (document.body.classList.contains('resizing-top')) {
                    document.body.classList.remove('resizing-top')
                }
            },
            disable: () => {
                if (!this.#resizePoints.top.classList.contains('disabled')) {
                    this.#resizePoints.top.classList.add('disabled');
                }
                if (this.#resizeEvents.top.hasEvent.up) {
                    this.#resizeEvents.top.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.top.up);
                }
                if (this.#resizeEvents.top.hasEvent.move) {
                    this.#resizeEvents.top.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.top.move);
                }
                if (this.#resizeEvents.top.hasEvent.down) {
                    this.#resizeEvents.top.hasEvent.down = false;
                    this.#resizePoints.top.removeEventListener('mousedown', this.#resizeEvents.top.down);
                }
                if (document.body.classList.contains('resizing-top')) {
                    document.body.classList.remove('resizing-top')
                }
            }
        },
        topLeft: {
            hasEvent: { up: false, down: false, move: false },
            down: (e) => {
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("topLeft");
                if (this.#resizeEvents.topLeft.hasEvent.down) {
                    this.#resizeEvents.topLeft.hasEvent.down = false;
                    this.#resizePoints.topLeft.removeEventListener('mousedown', this.#resizeEvents.topLeft.down);
                }
                if (!document.body.classList.contains('resizing-topLeft')) {
                    document.body.classList.add('resizing-topLeft')
                }
                if (!this.#resizeEvents.topLeft.hasEvent.up) {
                    this.#resizeEvents.topLeft.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.topLeft.up);
                }
                if (!this.#resizeEvents.topLeft.hasEvent.move) {
                    this.#resizeEvents.topLeft.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.topLeft.move);
                }
            },
            move: (e) => {
                let diffY = this.#mouseEventPos.y - e.clientY;
                let diffX = this.#mouseEventPos.x - e.clientX;
                if(this.#aspectRatioScaling) {
                    if(diffX > diffY) {
                        let prevHeight = this.#size.height + 0;
                        this.size = { width: (this.#size.width + diffX), height: (this.#size.width + diffX) * this.#aspectRatio_wh };
                        diffY = this.size.height - prevHeight;
                    } else {
                        let prevWidth = this.#size.width + 0;
                        this.size = { width: (this.#size.height + diffY) * this.#aspectRatio_hw, height: (this.#size.height + diffY) };
                        diffX = this.size.width - prevWidth;
                    }
                } else {
                    this.size = { width: this.#size.width + diffX, height: this.#size.height + diffY };
                }
                this.pos = { x: this.#pos.x - diffX, y: this.#pos.y - diffY };
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.topLeft.classList.contains('disabled')) {
                    this.#resizePoints.topLeft.classList.remove('disabled');
                }
                if (this.#resizeEvents.topLeft.hasEvent.up) {
                    this.#resizeEvents.topLeft.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.topLeft.up);
                }
                if (this.#resizeEvents.topLeft.hasEvent.move) {
                    this.#resizeEvents.topLeft.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.topLeft.move);
                }
                if (!this.#resizeEvents.topLeft.hasEvent.down) {
                    this.#resizeEvents.topLeft.hasEvent.down = true;
                    this.#resizePoints.topLeft.addEventListener('mousedown', this.#resizeEvents.topLeft.down);
                }
                if (document.body.classList.contains('resizing-topLeft')) {
                    document.body.classList.remove('resizing-topLeft')
                }
            },
            disable: () => {
                if (!this.#resizePoints.topLeft.classList.contains('disabled')) {
                    this.#resizePoints.topLeft.classList.add('disabled');
                }
                if (this.#resizeEvents.topLeft.hasEvent.up) {
                    this.#resizeEvents.topLeft.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.topLeft.up);
                }
                if (this.#resizeEvents.topLeft.hasEvent.move) {
                    this.#resizeEvents.topLeft.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.topLeft.move);
                }
                if (this.#resizeEvents.topLeft.hasEvent.down) {
                    this.#resizeEvents.topLeft.hasEvent.down = false;
                    this.#resizePoints.topLeft.removeEventListener('mousedown', this.#resizeEvents.topLeft.down);
                }
                if (document.body.classList.contains('resizing-topLeft')) {
                    document.body.classList.remove('resizing-topLeft')
                }
            }
        },
        topRight: {
            hasEvent: { up: false, down: false, move: false },
            down: (e) => {
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("topRight");
                if (this.#resizeEvents.topRight.hasEvent.down) {
                    this.#resizeEvents.topRight.hasEvent.down = false;
                    this.#resizePoints.topRight.removeEventListener('mousedown', this.#resizeEvents.topRight.down);
                }
                if (!document.body.classList.contains('resizing-topRight')) {
                    document.body.classList.add('resizing-topRight')
                }
                if (!this.#resizeEvents.topRight.hasEvent.up) {
                    this.#resizeEvents.topRight.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.topRight.up);
                }
                if (!this.#resizeEvents.topRight.hasEvent.move) {
                    this.#resizeEvents.topRight.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.topRight.move);
                }
            },
            move: (e) => {
                let diffY = this.#mouseEventPos.y - e.clientY;
                let diffX = this.#mouseEventPos.x - e.clientX;
                if(this.#aspectRatioScaling) {
                    if(diffX > diffY) {
                        let prevHeight = this.#size.height + 0;
                        this.size = { width: (this.#size.width - diffX), height: (this.#size.width - diffX) * this.#aspectRatio_wh };
                        diffY = this.size.height - prevHeight;
                    }  else {
                        let prevWidth = this.#size.width + 0;
                        this.size = { width: (this.#size.height + diffY) * this.#aspectRatio_hw, height: (this.#size.height + diffY) };
                        diffX = this.size.width - prevWidth;
                    }
                } else {
                    this.size = { width: this.#size.width - diffX, height: this.#size.height + diffY };
                }
                this.pos = { x: this.#pos.x, y: this.#pos.y - diffY };
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.topRight.classList.contains('disabled')) {
                    this.#resizePoints.topRight.classList.remove('disabled');
                }
                if (this.#resizeEvents.topRight.hasEvent.up) {
                    this.#resizeEvents.topRight.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.topRight.up);
                }
                if (this.#resizeEvents.topRight.hasEvent.move) {
                    this.#resizeEvents.topRight.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.topRight.move);
                }
                if (!this.#resizeEvents.topRight.hasEvent.down) {
                    this.#resizeEvents.topRight.hasEvent.down = true;
                    this.#resizePoints.topRight.addEventListener('mousedown', this.#resizeEvents.topRight.down);
                }
                if (document.body.classList.contains('resizing-topRight')) {
                    document.body.classList.remove('resizing-topRight')
                }
            },
            disable: () => {
                if (!this.#resizePoints.topRight.classList.contains('disabled')) {
                    this.#resizePoints.topRight.classList.add('disabled');
                }
                if (this.#resizeEvents.topRight.hasEvent.up) {
                    this.#resizeEvents.topRight.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.topRight.up);
                }
                if (this.#resizeEvents.topRight.hasEvent.move) {
                    this.#resizeEvents.topRight.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.topRight.move);
                }
                if (this.#resizeEvents.topRight.hasEvent.down) {
                    this.#resizeEvents.topRight.hasEvent.down = false;
                    this.#resizePoints.topRight.removeEventListener('mousedown', this.#resizeEvents.topRight.down);
                }
                if (document.body.classList.contains('resizing-topRight')) {
                    document.body.classList.remove('resizing-topRight')
                }
            }
        },
        left: {
            hasEvent: { up: false, down: false, move: false },
            down: (e) => {
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("left");
                if (this.#resizeEvents.left.hasEvent.down) {
                    this.#resizeEvents.left.hasEvent.down = false;
                    this.#resizePoints.left.removeEventListener('mousedown', this.#resizeEvents.left.down);
                }
                if (!document.body.classList.contains('resizing-left')) {
                    document.body.classList.add('resizing-left')
                }
                if (!this.#resizeEvents.left.hasEvent.up) {
                    this.#resizeEvents.left.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.left.up);
                }
                if (!this.#resizeEvents.left.hasEvent.move) {
                    this.#resizeEvents.left.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.left.move);
                }
            },
            move: (e) => {
                let diffX = this.#mouseEventPos.x - e.clientX;
                if(this.#aspectRatioScaling) {
                    this.size = { height: (this.#size.width + diffX) * this.#aspectRatio_wh, width: this.#size.width + diffX };
                } else {
                    this.size = { height: this.#size.height, width: this.#size.width + diffX };
                }
                this.pos = { y: this.#pos.y, x: this.#pos.x - diffX };
                this.#mouseEventPos.x = e.clientX;
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.left.classList.contains('disabled')) {
                    this.#resizePoints.left.classList.remove('disabled');
                }
                if (this.#resizeEvents.left.hasEvent.up) {
                    this.#resizeEvents.left.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.left.up);
                }
                if (this.#resizeEvents.left.hasEvent.move) {
                    this.#resizeEvents.left.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.left.move);
                }
                if (!this.#resizeEvents.left.hasEvent.down) {
                    this.#resizeEvents.left.hasEvent.down = true;
                    this.#resizePoints.left.addEventListener('mousedown', this.#resizeEvents.left.down);
                }
                if (document.body.classList.contains('resizing-left')) {
                    document.body.classList.remove('resizing-left')
                }
            },
            disable: () => {
                if (!this.#resizePoints.left.classList.contains('disabled')) {
                    this.#resizePoints.left.classList.add('disabled');
                }
                if (this.#resizeEvents.left.hasEvent.up) {
                    this.#resizeEvents.left.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.left.up);
                }
                if (this.#resizeEvents.left.hasEvent.move) {
                    this.#resizeEvents.left.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.left.move);
                }
                if (this.#resizeEvents.left.hasEvent.down) {
                    this.#resizeEvents.left.hasEvent.down = false;
                    this.#resizePoints.left.removeEventListener('mousedown', this.#resizeEvents.left.down);
                }
                if (document.body.classList.contains('resizing-left')) {
                    document.body.classList.remove('resizing-left')
                }
            }
        },
        right: {
            hasEvent: { up: false, down: false, move: false },
            down: (e) => {
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("right");
                if (this.#resizeEvents.right.hasEvent.down) {
                    this.#resizeEvents.right.hasEvent.down = false;
                    this.#resizePoints.right.removeEventListener('mousedown', this.#resizeEvents.right.down);
                }
                if (!document.body.classList.contains('resizing-right')) {
                    document.body.classList.add('resizing-right')
                }
                if (!this.#resizeEvents.right.hasEvent.up) {
                    this.#resizeEvents.right.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.right.up);
                }
                if (!this.#resizeEvents.right.hasEvent.move) {
                    this.#resizeEvents.right.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.right.move);
                }
            },
            move: (e) => {
                let diffX = this.#mouseEventPos.x - e.clientX;
                if(this.#aspectRatioScaling) {
                    this.size = { height: (this.#size.width - diffX) * this.#aspectRatio_wh, width: this.#size.width - diffX };
                } else {
                    this.size = { height: this.#size.height, width: this.#size.width - diffX };
                }
                this.#mouseEventPos.x = e.clientX;
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.right.classList.contains('disabled')) {
                    this.#resizePoints.right.classList.remove('disabled');
                }
                if (this.#resizeEvents.right.hasEvent.up) {
                    this.#resizeEvents.right.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.right.up);
                }
                if (this.#resizeEvents.right.hasEvent.move) {
                    this.#resizeEvents.right.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.right.move);
                }
                if (!this.#resizeEvents.right.hasEvent.down) {
                    this.#resizeEvents.right.hasEvent.down = true;
                    this.#resizePoints.right.addEventListener('mousedown', this.#resizeEvents.right.down);
                }
                if (document.body.classList.contains('resizing-right')) {
                    document.body.classList.remove('resizing-right')
                }
            },
            disable: () => {
                if (!this.#resizePoints.right.classList.contains('disabled')) {
                    this.#resizePoints.right.classList.add('disabled');
                }
                if (this.#resizeEvents.right.hasEvent.up) {
                    this.#resizeEvents.right.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.right.up);
                }
                if (this.#resizeEvents.right.hasEvent.move) {
                    this.#resizeEvents.right.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.right.move);
                }
                if (this.#resizeEvents.right.hasEvent.down) {
                    this.#resizeEvents.right.hasEvent.down = false;
                    this.#resizePoints.right.removeEventListener('mousedown', this.#resizeEvents.right.down);
                }
                if (document.body.classList.contains('resizing-right')) {
                    document.body.classList.remove('resizing-right')
                }
            }
        },
        bottom: {
            hasEvent: { up: false, down: false, move: false },
            down: (e) => {
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("bottom");
                if (this.#resizeEvents.bottom.hasEvent.down) {
                    this.#resizeEvents.bottom.hasEvent.down = false;
                    this.#resizePoints.bottom.removeEventListener('mousedown', this.#resizeEvents.bottom.down);
                }
                if (!document.body.classList.contains('resizing-bottom')) {
                    document.body.classList.add('resizing-bottom')
                }
                if (!this.#resizeEvents.bottom.hasEvent.up) {
                    this.#resizeEvents.bottom.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.bottom.up);
                }
                if (!this.#resizeEvents.bottom.hasEvent.move) {
                    this.#resizeEvents.bottom.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.bottom.move);
                }
            },
            move: (e) => {
                let diffY = this.#mouseEventPos.y - e.clientY;
                if(this.#aspectRatioScaling) {
                    this.size = {width: (this.#size.height - diffY) * this.#aspectRatio_hw, height: (this.#size.height - diffY)};
                } else {
                    this.size = {width: this.#size.width, height: this.#size.height - diffY};
                }
                this.#mouseEventPos.y = e.clientY;
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.bottom.classList.contains('disabled')) {
                    this.#resizePoints.bottom.classList.remove('disabled');
                }
                if (this.#resizeEvents.bottom.hasEvent.up) {
                    this.#resizeEvents.bottom.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.bottom.up);
                }
                if (this.#resizeEvents.bottom.hasEvent.move) {
                    this.#resizeEvents.bottom.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.bottom.move);
                }
                if (!this.#resizeEvents.bottom.hasEvent.down) {
                    this.#resizeEvents.bottom.hasEvent.down = true;
                    this.#resizePoints.bottom.addEventListener('mousedown', this.#resizeEvents.bottom.down);
                }
                if (document.body.classList.contains('resizing-bottom')) {
                    document.body.classList.remove('resizing-bottom')
                }
            },
            disable: () => {
                if (!this.#resizePoints.bottom.classList.contains('disabled')) {
                    this.#resizePoints.bottom.classList.add('disabled');
                }
                if (this.#resizeEvents.bottom.hasEvent.up) {
                    this.#resizeEvents.bottom.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.bottom.up);
                }
                if (this.#resizeEvents.bottom.hasEvent.move) {
                    this.#resizeEvents.bottom.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.bottom.move);
                }
                if (this.#resizeEvents.bottom.hasEvent.down) {
                    this.#resizeEvents.bottom.hasEvent.down = false;
                    this.#resizePoints.bottom.removeEventListener('mousedown', this.#resizeEvents.bottom.down);
                }
                if (document.body.classList.contains('resizing-bottom')) {
                    document.body.classList.remove('resizing-bottom')
                }
            }
        },
        bottomRight: {
            hasEvent: { up: false, down: false, move: false },
            down: (e) => {
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("bottomRight");
                if (this.#resizeEvents.bottomRight.hasEvent.down) {
                    this.#resizeEvents.bottomRight.hasEvent.down = false;
                    this.#resizePoints.bottomRight.removeEventListener('mousedown', this.#resizeEvents.bottomRight.down);
                }
                if (!document.body.classList.contains('resizing-bottomRight')) {
                    document.body.classList.add('resizing-bottomRight')
                }
                if (!this.#resizeEvents.bottomRight.hasEvent.up) {
                    this.#resizeEvents.bottomRight.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.bottomRight.up);
                }
                if (!this.#resizeEvents.bottomRight.hasEvent.move) {
                    this.#resizeEvents.bottomRight.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.bottomRight.move);
                }
            },
            move: (e) => {
                let diffY = this.#mouseEventPos.y - e.clientY;
                let diffX = this.#mouseEventPos.x - e.clientX;
                if(this.#aspectRatioScaling) {
                    if(diffX > diffY) {
                        let prevHeight = this.#size.height + 0;
                        this.size = { width: (this.#size.width - diffX), height: (this.#size.width - diffX) * this.#aspectRatio_wh };
                        diffY = this.size.height - prevHeight;
                    }  else {
                        let prevWidth = this.#size.width + 0;
                        this.size = { width: (this.#size.height - diffY) * this.#aspectRatio_hw, height: (this.#size.height - diffY) };
                        diffX = this.size.width - prevWidth;
                    }
                } else {
                    this.size = { width: this.#size.width - diffX, height: this.#size.height - diffY };
                }
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.bottomRight.classList.contains('disabled')) {
                    this.#resizePoints.bottomRight.classList.remove('disabled');
                }
                if (this.#resizeEvents.bottomRight.hasEvent.up) {
                    this.#resizeEvents.bottomRight.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.bottomRight.up);
                }
                if (this.#resizeEvents.bottomRight.hasEvent.move) {
                    this.#resizeEvents.bottomRight.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.bottomRight.move);
                }
                if (!this.#resizeEvents.bottomRight.hasEvent.down) {
                    this.#resizeEvents.bottomRight.hasEvent.down = true;
                    this.#resizePoints.bottomRight.addEventListener('mousedown', this.#resizeEvents.bottomRight.down);
                }
                if (document.body.classList.contains('resizing-bottomRight')) {
                    document.body.classList.remove('resizing-bottomRight')
                }
            },
            disable: () => {
                if (!this.#resizePoints.bottomRight.classList.contains('disabled')) {
                    this.#resizePoints.bottomRight.classList.add('disabled');
                }
                if (this.#resizeEvents.bottomRight.hasEvent.up) {
                    this.#resizeEvents.bottomRight.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.bottomRight.up);
                }
                if (this.#resizeEvents.bottomRight.hasEvent.move) {
                    this.#resizeEvents.bottomRight.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.bottomRight.move);
                }
                if (this.#resizeEvents.bottomRight.hasEvent.down) {
                    this.#resizeEvents.bottomRight.hasEvent.down = false;
                    this.#resizePoints.bottomRight.removeEventListener('mousedown', this.#resizeEvents.bottomRight.down);
                }
                if (document.body.classList.contains('resizing-bottomRight')) {
                    document.body.classList.remove('resizing-bottomRight')
                }
            }
        },
        bottomLeft: {
            hasEvent: { up: false, down: false, move: false },
            down: (e) => {
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
                if (this.#behaviourConfig.move) {
                    this.#movePoint.disable();
                }
                this.#disableResizeButtons("bottomLeft");
                if (this.#resizeEvents.bottomLeft.hasEvent.down) {
                    this.#resizeEvents.bottomLeft.hasEvent.down = false;
                    this.#resizePoints.bottomLeft.removeEventListener('mousedown', this.#resizeEvents.bottomLeft.down);
                }
                if (!document.body.classList.contains('resizing-bottomLeft')) {
                    document.body.classList.add('resizing-bottomLeft')
                }
                if (!this.#resizeEvents.bottomLeft.hasEvent.up) {
                    this.#resizeEvents.bottomLeft.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#resizeEvents.bottomLeft.up);
                }
                if (!this.#resizeEvents.bottomLeft.hasEvent.move) {
                    this.#resizeEvents.bottomLeft.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#resizeEvents.bottomLeft.move);
                }
            },
            move: (e) => {
                let diffY = this.#mouseEventPos.y - e.clientY;
                let diffX = this.#mouseEventPos.x - e.clientX;
                if(this.#aspectRatioScaling) {
                    if(diffX > diffY) {
                        let prevHeight = this.#size.height + 0;
                        this.size = { width: (this.#size.width + diffX), height: (this.#size.width + diffX) * this.#aspectRatio_wh };
                        diffY = this.size.height - prevHeight;
                    }  else {
                        let prevWidth = this.#size.width + 0;
                        this.size = { width: (this.#size.height - diffY) * this.#aspectRatio_hw, height: (this.#size.height - diffY) };
                        diffX = this.size.width - prevWidth;
                    }
                } else {
                    this.size = { width: this.#size.width + diffX, height: this.#size.height - diffY };
                }
                this.pos = { x: this.#pos.x - diffX, y: this.#pos.y };
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
            enable: () => {
                if (this.#resizePoints.bottomLeft.classList.contains('disabled')) {
                    this.#resizePoints.bottomLeft.classList.remove('disabled');
                }
                if (this.#resizeEvents.bottomLeft.hasEvent.up) {
                    this.#resizeEvents.bottomLeft.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.bottomLeft.up);
                }
                if (this.#resizeEvents.bottomLeft.hasEvent.move) {
                    this.#resizeEvents.bottomLeft.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.bottomLeft.move);
                }
                if (!this.#resizeEvents.bottomLeft.hasEvent.down) {
                    this.#resizeEvents.bottomLeft.hasEvent.down = true;
                    this.#resizePoints.bottomLeft.addEventListener('mousedown', this.#resizeEvents.bottomLeft.down);
                }
                if (document.body.classList.contains('resizing-bottomLeft')) {
                    document.body.classList.remove('resizing-bottomLeft')
                }
            },
            disable: () => {
                if (!this.#resizePoints.bottomLeft.classList.contains('disabled')) {
                    this.#resizePoints.bottomLeft.classList.add('disabled');
                }
                if (this.#resizeEvents.bottomLeft.hasEvent.up) {
                    this.#resizeEvents.bottomLeft.hasEvent.up = false;
                    document.body.removeEventListener('mouseup', this.#resizeEvents.bottomLeft.up);
                }
                if (this.#resizeEvents.bottomLeft.hasEvent.move) {
                    this.#resizeEvents.bottomLeft.hasEvent.move = false;
                    document.body.removeEventListener('mousemove', this.#resizeEvents.bottomLeft.move);
                }
                if (this.#resizeEvents.bottomLeft.hasEvent.down) {
                    this.#resizeEvents.bottomLeft.hasEvent.down = false;
                    this.#resizePoints.bottomLeft.removeEventListener('mousedown', this.#resizeEvents.bottomLeft.down);
                }
                if (document.body.classList.contains('resizing-bottomLeft')) {
                    document.body.classList.remove('resizing-bottomLeft')
                }
            }
        },
    }
    /** @type {{top: HTMLElement, topLeft: HTMLElement, topRight: HTMLElement, left: HTMLElement, right: HTMLElement, bottom: HTMLElement, bottomRight: HTMLElement, bottomLeft: HTMLElement}} */
    #resizePoints;
    /** @returns {{top: HTMLElement, topLeft: HTMLElement, topRight: HTMLElement, left: HTMLElement, right: HTMLElement, bottom: HTMLElement, bottomRight: HTMLElement, bottomLeft: HTMLElement}} */
    #createResizePoints = () => {
        /** @type {{top: HTMLElement, topLeft: HTMLElement, topRight: HTMLElement, left: HTMLElement, right: HTMLElement, bottom: HTMLElement, bottomRight: HTMLElement, bottomLeft: HTMLElement}} */ //@ts-ignore
        let el = {
            top: Utils.createHTMLElement('div', ['resizePoint', 'top']),
            topLeft: Utils.createHTMLElement('div', ['resizePoint', 'topLeft']),
            topRight: Utils.createHTMLElement('div', ['resizePoint', 'topRight']),
            left: Utils.createHTMLElement('div', ['resizePoint', 'left']),
            right: Utils.createHTMLElement('div', ['resizePoint', 'right']),
            bottom: Utils.createHTMLElement('div', ['resizePoint', 'bottom']),
            bottomRight: Utils.createHTMLElement('div', ['resizePoint', 'bottomRight']),
            bottomLeft: Utils.createHTMLElement('div', ['resizePoint', 'bottomLeft']),
        };
        return el;
    }
    /** @type {{el: HTMLElement, hasEvent: {down: Boolean, up: Boolean, move: Boolean}, enable: () => void, disable: () => void, funcs: {down: (e:MouseEvent) => void, up: (e:MouseEvent) => void, move: (e:MouseEvent) => void}}} */
    #movePoint = {
        el: Utils.createHTMLElement('div', ['movePoint']),
        hasEvent: {down: false, up: false, move: false},
        funcs: {
            down: (e) => {
                this.#mouseEventPos = {x: e.clientX, y: e.clientY};
                if (!document.body.classList.contains('windowMoving')) {
                    document.body.classList.add('windowMoving')
                }
                this.#disableResizeButtons();
                if (this.#movePoint.hasEvent.down) {
                    this.#movePoint.hasEvent.down = false;
                    this.#movePoint.el.removeEventListener('mousedown', this.#movePoint.funcs.down);
                }
                if (!this.#movePoint.hasEvent.up) {
                    this.#movePoint.hasEvent.up = true;
                    document.body.addEventListener('mouseup', this.#movePoint.funcs.up);
                }
                if (!this.#movePoint.hasEvent.move) {
                    this.#movePoint.hasEvent.move = true;
                    document.body.addEventListener('mousemove', this.#movePoint.funcs.move);
                }
            },
            move: (e) => {
                let diffX = this.#mouseEventPos.x - e.clientX;
                let diffY = this.#mouseEventPos.y - e.clientY;
                this.pos = {x: this.#pos.x - diffX, y: this.#pos.y - diffY};
                this.#mouseEventPos = { x: e.clientX, y: e.clientY };
            },
            up: (e) => {
                if (this.#behaviourConfig.move) {
                    this.#movePoint.enable();
                }
                this.#enableResizeButtons();
            },
        },
        enable: () => {
            if (this.#movePoint.el.classList.contains('disabled')) {
                this.#movePoint.el.classList.remove('disabled');
            }
            if (this.#movePoint.hasEvent.up) {
                this.#movePoint.hasEvent.up = false;
                document.body.removeEventListener('mouseup', this.#movePoint.funcs.up);
            }
            if (this.#movePoint.hasEvent.move) {
                this.#movePoint.hasEvent.move = false;
                document.body.removeEventListener('mousemove', this.#movePoint.funcs.move);
            }
            if (!this.#movePoint.hasEvent.down) {
                this.#movePoint.hasEvent.down = true;
                this.#movePoint.el.addEventListener('mousedown', this.#movePoint.funcs.down);
            }
            if (document.body.classList.contains('windowMoving')) {
                document.body.classList.remove('windowMoving')
            }
        },
        disable: () => {
            if (!this.#movePoint.el.classList.contains('disabled')) {
                this.#movePoint.el.classList.add('disabled');
            }
            if (this.#movePoint.hasEvent.up) {
                this.#movePoint.hasEvent.up = false;
                document.body.removeEventListener('mouseup', this.#movePoint.funcs.up);
            }
            if (this.#movePoint.hasEvent.move) {
                this.#movePoint.hasEvent.move = false;
                document.body.removeEventListener('mousemove', this.#movePoint.funcs.move);
            }
            if (this.#movePoint.hasEvent.down) {
                this.#movePoint.hasEvent.down = false;
                this.#movePoint.el.removeEventListener('mousedown', this.#movePoint.funcs.down);
            }
            if (document.body.classList.contains('windowMoving')) {
                document.body.classList.remove('windowMoving')
            }
        }
    };
    /** @type {String} */
    #id;
    get id() {
        return this.#id;
    }
    /** @type {String} */
    #name = '';
    /** @type {String} */
    get name () {
        return this.#name;
    }
    set name (newName) {
        this.#name = newName;
        this.#nameElement.innerHTML = newName;
        if (this.#name.trim() == '') {
            if (!this.#nameElement.classList.contains('empty')) {
                this.#nameElement.classList.add('empty');
            }
        } else {
            if (this.#nameElement.classList.contains('empty')) {
                this.#nameElement.classList.remove('empty');
            }
        }
    }
    /** @type {String} */
    #type = 'none';
    /** @type {String} */
    #icon = '';
    /** @type {String} */
    get icon() {
        return this.#icon;
    }
    set icon(newIcon) {
        this.#icon = newIcon;
        if(this.#icon.trim() == '') {
            this.#iconElement.style.removeProperty('--icon');
            if(!this.#iconElement.classList.contains('empty')) {
                this.#iconElement.classList.add('empty');
            }
        } else {
            this.#iconElement.style.setProperty('--icon', `${this.#icon.trim()}`);
            if (this.#iconElement.classList.contains('empty')) {
                this.#iconElement.classList.remove('empty');
            }
        }
    }
    /** @type {String} */
    #desc = '';
    /** @type {String} */
    get desc() {
        return this.#desc;
    }
    set desc(newDesc) {
        this.#desc = newDesc;
        if (this.#desc.length <= 10) {
            this.#descElement.innerHTML = newDesc;
            if (this.#desc.trim() == '') {
                if (!this.#descElement.classList.contains('empty')) {
                    this.#descElement.classList.add('empty');
                }
            } else {
                if (this.#descElement.classList.contains('empty')) {
                    this.#descElement.classList.remove('empty');
                }
            }
        } else {
            this.#descElement.innerHTML = `${newDesc.slice(0, 10)}...`;
            if (this.#descElement.classList.contains('empty')) {
                this.#descElement.classList.remove('empty');
            }
        }
    }
    /** @param {null|"top"|"topLeft"|"topRight"|"left"|"top"|"right"|"bottom"|"bottomRight"|"bottomLeft"} [skip=null] */
    #disableResizeButtons = (skip = null) => {
        if (this.#behaviourConfig.resize) {
            Object.keys(this.#resizeEvents).forEach((key) => {
                if (key !== skip) {
                    this.#resizeEvents[key].disable();
                }
            });
        }
    }
    /** @param {null|"top"|"topLeft"|"topRight"|"left"|"top"|"right"|"bottom"|"bottomRight"|"bottomLeft"} [skip=null] */
    #enableResizeButtons = (skip=null) => {
        if (this.#behaviourConfig.resize) {
            Object.keys(this.#resizeEvents).forEach((key) => {
                if(key !== skip) {
                    this.#resizeEvents[key].enable();
                }
            });
        }
    }
    /** @type {Boolean} */
    #isFullscreen = false;
    /** @type {Boolean} */
    get isFullscreen() {
        return this.#isFullscreen;
    }
    /** @type {Boolean} */
    set isFullscreen(_isFullscreen) {
        if(_isFullscreen == true) {
            if (!this.#window.classList.contains('fullscreen')) {
                this.#window.classList.add('fullscreen');
            }
            if (!this.buttons.fullscreen.el.classList.contains('on')) {
                this.buttons.fullscreen.el.classList.add('on');
            }
            if (this.#buttonsFuncsStatus.handleClick_fullscreen_on) {
                this.#buttonsFuncsStatus.handleClick_fullscreen_on = false;
                this.buttons.fullscreen.el.removeEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_on);
            }
            if (!this.#buttonsFuncsStatus.handleClick_fullscreen_off) {
                this.#buttonsFuncsStatus.handleClick_fullscreen_off = true;
                this.buttons.fullscreen.el.addEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_off);
            }
            this.#disableResizeButtons();
            if (this.#behaviourConfig.move) {
                this.#movePoint.disable();
            }
        } else {
            if (this.#window.classList.contains('fullscreen')) {
                this.#window.classList.remove('fullscreen');
            }
            if (!this.#window.classList.contains('fullscreenExit')) {
                this.#window.classList.add('fullscreenExit');
            }
            let waitTime = Utils.getTransitionTime(this.#window);
            setTimeout(() => {
                if (this.#window.classList.contains('fullscreenExit')) {
                    this.#window.classList.remove('fullscreenExit');
                }
            }, waitTime);
            if (this.buttons.fullscreen.el.classList.contains('on')) {
                this.buttons.fullscreen.el.classList.remove('on');
            }
            if (this.#buttonsFuncsStatus.handleClick_fullscreen_off) {
                this.#buttonsFuncsStatus.handleClick_fullscreen_off = false;
                this.buttons.fullscreen.el.removeEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_off);
            }
            if (!this.#buttonsFuncsStatus.handleClick_fullscreen_on) {
                this.#buttonsFuncsStatus.handleClick_fullscreen_on = true;
                this.buttons.fullscreen.el.addEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_on);
            }
            this.#enableResizeButtons();
            if (this.#behaviourConfig.move) {
                this.#movePoint.enable();
            }
            this.size = this.#size;
            this.pos = this.#pos;
        }
        this.#isFullscreen = _isFullscreen;
        this.#userFuncs.onFullscreen();
    }
    /** @type {{onClose: () => Promise<*>, onFullscreen: () => Promise<*>}} */
    #userFuncs = { onClose: () => { return new Promise((res) => { res(null); }) }, onFullscreen: () => { return new Promise((res) => { res(null); }) } };
    /** @type {{handleClick_close: Boolean, handleClick_fullscreen_on: Boolean, handleClick_fullscreen_off: Boolean, handleClick_minimize: Boolean}} */
    #buttonsFuncsStatus = {handleClick_close: false, handleClick_fullscreen_off: false, handleClick_fullscreen_on: false, handleClick_minimize: false};
    /** @type {{handleClick_close: () => void, handleClick_fullscreen_on: () => void, handleClick_fullscreen_off: () => void, handleClick_minimize: () => void}} */
    #buttonsFuncs = {
        handleClick_close: async () => {
            if(!this.#window.classList.contains('closing')) {
                this.#window.classList.add('closing');
            }
            this.#disableResizeButtons();
            if(this.#behaviourConfig.move) {
                this.#movePoint.disable();
            }
            let waitTime = Utils.getTransitionTime([this.#window]);
            await this.#userFuncs.onClose();
            setTimeout(() => {
                this.#window.remove();
            }, waitTime);
        },
        handleClick_fullscreen_off: () => {
            this.isFullscreen = false;
        },
        handleClick_fullscreen_on: () => {
            this.isFullscreen = true;
        },
        handleClick_minimize: () => {

        }
    };
    /** @type {Boolean} */
    #aspectRatioScaling = false;
    /** @type {Number} */
    #aspectRatio_wh = 1;
    /** @type {Number} */
    #aspectRatio_hw = 1;
    /** @type {{close: {el: HTMLButtonElement, disable: () => void, enable: () => void}, fullscreen: {el: HTMLButtonElement, disable: () => void, enable: () => void}, minimize:{el: HTMLButtonElement, disable: () => void, enable: () => void}}} */
    buttons;
    /** @type {HTMLElement} */
    content;
    /** @type {() => Promise<*>} */
    get onFullscreen() { //@ts-ignore
        return this.#userFuncs.onFullscreen;
    }
    /** @type {() => Promise<*>} */
    set onFullscreen(val) { //@ts-ignore
        this.#userFuncs.onFullscreen = val;
    }
    /** @type {() => Promise<*>} */
    get onClose() { //@ts-ignore
        return this.#userFuncs.onClose;
    }
    /** @type {() => Promise<*>} */
    set onClose(val) { //@ts-ignore
        this.#userFuncs.onClose = val;
    }
    close = () => {
        this.#buttonsFuncs.handleClick_close();
    }
    /**
     * 
     * @param {{x: Number, y:Number}} pos 
     * @param {Boolean} [animation=true]
     * @returns {Promise<Null>}
     */
    move = (pos, animation=true) => {
        return new Promise((res) => {
            if(!this.#isFullscreen) {
                if(animation) {
                    this.#disableResizeButtons();
                    if (this.#behaviourConfig.move) {
                        this.#movePoint.disable();
                    }
                    if (!this.#window.classList.contains('moving')) {
                        this.#window.classList.add('moving');
                    }
                    let waitTime = Utils.getTransitionTime(this.#window);
                    this.pos = pos;
                    setTimeout(() => {
                        if (this.#window.classList.contains('moving')) {
                            this.#window.classList.remove('moving');
                        }
                        this.#enableResizeButtons();
                        if (this.#behaviourConfig.move) {
                            this.#movePoint.enable();
                        }
                        res(null);
                    }, waitTime);
                } else {
                    this.pos = pos;
                    res(null);
                }
            } else {
                this.#pos = pos;
                res(null);
            }
        });
    }
    /**
     * 
     * @param {{width: Number, height:Number}} size 
     * @param {Boolean} [animation=true]
     * @returns {Promise<Null>}
     */
    resize = (size, animation = true) => {
        return new Promise((res) => {
            if (!this.#isFullscreen) {
                if (animation) {
                    this.#disableResizeButtons();
                    if (!this.#window.classList.contains('resizing')) {
                        this.#window.classList.add('resizing');
                    }
                    let waitTime = Utils.getTransitionTime(this.#window);
                    this.size = size;
                    setTimeout(() => {
                        if (this.#window.classList.contains('resizing')) {
                            this.#window.classList.remove('resizing');
                        }
                        this.#enableResizeButtons();
                        if (this.#behaviourConfig.move) {
                            this.#movePoint.enable();
                        }
                        res(null);
                    }, waitTime);
                } else {
                    this.size = size;
                    res(null);
                }
            } else {
                this.#size = size;
                res(null);
            }
        });
    }
    /**
     * @param {CONTENT|String|Number|HTMLElement} content 
     * @param {DisplayWindow_creationConfig} [config={}]
     */
    constructor(content, config={}) {
        let windowClassNames = ['window'];
        if (config.className) {
            if (typeof config.className == 'string') {
                if (!windowClassNames.includes(config.className)) {
                    windowClassNames.push(config.className);
                }
            } else if (Array.isArray(config.className)) {
                config.className.forEach((className) => {
                    if (!windowClassNames.includes(className)) {
                        windowClassNames.push(className);
                    }
                });
            }
        }
        this.#id = Utils.makeId(10, 'unnamedWindow-');
        if (config.type) {
            this.#type = config.type;
        }
        if (config.id) {
            this.#id = `${config.id}`;
            this.#name = `${this.#id}`;
        }
        if (config.name) {
            this.#name = config.name;
        }
        if (config.desc) {
            this.#desc = config.desc;
        }
        if (config.icon) {
            this.#icon = config.icon;
        }
        if (config.funcs) {
            if(config.funcs.onClose) {
                this.#userFuncs.onClose = config.funcs.onClose;
            }
            if(config.funcs.onFullscreen) {
                this.#userFuncs.onFullscreen = config.funcs.onFullscreen;
            }
        }
        if (config.size) {
            if(config.size.height !== null) {
                this.#size.height = config.size.height;
            }
            if (config.size.width !== null) {
                this.#size.width = config.size.width;
            }
        }
        let gdc = Utils.gcd(this.#size.width, this.#size.height);
            this.#aspectRatio_hw = (this.#size.width/gdc)/(this.#size.height/gdc);
            this.#aspectRatio_wh = (this.#size.height/gdc)/(this.#size.width/gdc);
        if (config.aspectRatioScaling) {
            this.#aspectRatioScaling = true;
        }
        if (config.pos) {
            if(config.pos.x !== null) {
                this.#pos.x = config.pos.x;
            }
            if(config.pos.y !== null) {
                this.#pos.y = config.pos.y;
            }
        }
        if (config.behaviour) {
            if (typeof config.behaviour.close == 'boolean') {
                this.#behaviourConfig.close = config.behaviour.close;
            }
            if (typeof config.behaviour.fullscreen == 'boolean') {
                this.#behaviourConfig.fullscreen = config.behaviour.fullscreen;
            }
            if (typeof config.behaviour.minimize == 'boolean') {
                this.#behaviourConfig.minimize = config.behaviour.minimize;
            }
            if (typeof config.behaviour.resize == 'boolean') {
                this.#behaviourConfig.resize = config.behaviour.resize;
            }
            if (typeof config.behaviour.move == 'boolean') {
                this.#behaviourConfig.move = config.behaviour.move;
            }
        }
        this.#window = Utils.createHTMLElement('section', windowClassNames, {attibutes: {'id': this.#id}, css: {"position": "absolute", "left": `${this.pos.x}px`, "top": `${this.pos.y}px`, "width": `${this.size.width}px`, "height": `${this.size.height}px`}});
        this.#deco = Utils.createAndAppendHTMLElement(this.#window, 'div', ['deco']);
        this.#container = Utils.createAndAppendHTMLElement(this.#window, 'div', ['container']);
        this.#resizeContainer = Utils.createAndAppendHTMLElement(this.#window, 'div', ['resizers'])
        this.#header = Utils.createAndAppendHTMLElement(this.#container, 'header');
        this.#headerInfo = Utils.createAndAppendHTMLElement(this.#header, 'div', ['info']);
        if(this.#icon.trim() !== '') {
            this.#iconElement = Utils.createAndAppendHTMLElement(this.#headerInfo, 'div', ['icon'], {css: {'--icon': `url('${this.#icon}')`}})
        } else {
            this.#iconElement = Utils.createAndAppendHTMLElement(this.#headerInfo, 'div', ['icon', 'empty']);
        }
        this.#nameElement = Utils.createAndAppendHTMLElement(this.#headerInfo, 'h1', ['name'], {}, this.#name);
        if (this.#name.trim() == '') {
            if (!this.#nameElement.classList.contains('empty')) {
                this.#nameElement.classList.add('empty');
            }
        } else {
            if (this.#nameElement.classList.contains('empty')) {
                this.#nameElement.classList.remove('empty');
            }
        }
        if(this.#desc.length <= 10) {
            this.#descElement = Utils.createAndAppendHTMLElement(this.#headerInfo, 'h2', ['desc'], {}, this.#desc)
            if(this.#desc.trim() == '') {
                if (!this.#descElement.classList.contains('empty')) {
                    this.#descElement.classList.add('empty');
                }
            } else {
                if (this.#descElement.classList.contains('empty')) {
                    this.#descElement.classList.remove('empty');
                }
            }
        } else {
            this.#descElement = Utils.createAndAppendHTMLElement(this.#headerInfo, 'h2', ['desc'], {}, `${this.#desc.slice(0, 10)}...`);
            if (this.#descElement.classList.contains('empty')) {
                this.#descElement.classList.remove('empty');
            }
        }
        this.#buttons = Utils.createAndAppendHTMLElement(this.#header, 'div', ['buttons']);
        this.buttons = {
            minimize: {
                el: Utils.createHTMLElement('button', ['minimize'], {}, '<div class="face"></div>'),
                disable: () => {
                    if (!this.buttons.minimize.el.classList.contains('disabled')) {
                        this.buttons.minimize.el.classList.add('disabled');
                    }
                    if (this.#buttonsFuncsStatus.handleClick_close) {
                        this.#buttonsFuncsStatus.handleClick_close = false;
                        this.buttons.minimize.el.removeEventListener('click', this.#buttonsFuncs.handleClick_minimize);
                    }
                },
                enable: () => {
                    if (this.buttons.minimize.el.classList.contains('disabled')) {
                        this.buttons.minimize.el.classList.remove('disabled');
                    }
                    if (!this.#buttonsFuncsStatus.handleClick_close) {
                        this.#buttonsFuncsStatus.handleClick_close = true;
                        this.buttons.minimize.el.addEventListener('click', this.#buttonsFuncs.handleClick_minimize);
                    }
                }
            },
            fullscreen: {
                el: Utils.createHTMLElement('button', ['fullscreen'], {}, '<div class="face"></div>'),
                disable: () => {
                    if (!this.buttons.fullscreen.el.classList.contains('disabled')) {
                        this.buttons.fullscreen.el.classList.add('disabled');
                    }
                    if (this.#buttonsFuncsStatus.handleClick_fullscreen_off) {
                        this.#buttonsFuncsStatus.handleClick_fullscreen_off = false;
                        this.buttons.fullscreen.el.removeEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_off);
                    }
                    if (this.#buttonsFuncsStatus.handleClick_fullscreen_on) {
                        this.#buttonsFuncsStatus.handleClick_fullscreen_on = false;
                        this.buttons.fullscreen.el.removeEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_on);
                    }
                },
                enable: () => { 
                    if (this.buttons.fullscreen.el.classList.contains('disabled')) {
                        this.buttons.fullscreen.el.classList.remove('disabled');
                    }
                    if(this.#isFullscreen) {
                        if (this.#buttonsFuncsStatus.handleClick_fullscreen_on) {
                            this.#buttonsFuncsStatus.handleClick_fullscreen_on = false;
                            this.buttons.fullscreen.el.removeEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_on);
                        }
                        if (!this.#buttonsFuncsStatus.handleClick_fullscreen_off) {
                            this.#buttonsFuncsStatus.handleClick_fullscreen_off = true;
                            this.buttons.fullscreen.el.addEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_off);
                        }
                    } else {
                        if (this.#buttonsFuncsStatus.handleClick_fullscreen_off) {
                            this.#buttonsFuncsStatus.handleClick_fullscreen_off = false;
                            this.buttons.fullscreen.el.removeEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_off);
                        }
                        if (!this.#buttonsFuncsStatus.handleClick_fullscreen_on) {
                            this.#buttonsFuncsStatus.handleClick_fullscreen_on = true;
                            this.buttons.fullscreen.el.addEventListener('click', this.#buttonsFuncs.handleClick_fullscreen_on);
                        }
                    }
                },
            },
            close: {
                el: Utils.createHTMLElement('button', ['close'], {}, '<div class="face"></div>'),
                disable: () => {
                    if (!this.buttons.close.el.classList.contains('disabled')) {
                        this.buttons.close.el.classList.add('disabled');
                    }
                    if (this.#buttonsFuncsStatus.handleClick_close) {
                        this.#buttonsFuncsStatus.handleClick_close = false;
                        this.buttons.close.el.removeEventListener('click', this.#buttonsFuncs.handleClick_close);
                    }
                },
                enable: () => {
                    if (this.buttons.close.el.classList.contains('disabled')) {
                        this.buttons.close.el.classList.remove('disabled');
                    }
                    if (!this.#buttonsFuncsStatus.handleClick_close) {
                        this.#buttonsFuncsStatus.handleClick_close = true;
                        this.buttons.close.el.addEventListener('click', this.#buttonsFuncs.handleClick_close);
                    }
                }
            }
        }
        if(this.#behaviourConfig.minimize) {
            this.#buttons.appendChild(this.buttons.minimize.el);
            this.buttons.minimize.enable();
        }
        if (this.#behaviourConfig.fullscreen) {
            this.#buttons.appendChild(this.buttons.fullscreen.el);
            this.buttons.fullscreen.enable();
        }
        if (this.#behaviourConfig.close) {
            this.#buttons.appendChild(this.buttons.close.el);
            this.#buttonsFuncsStatus.handleClick_close = false;
            this.buttons.close.enable();
        }
        this.#resizePoints = this.#createResizePoints();
        if(this.#behaviourConfig.resize) {
            this.#resizeContainer.appendChild(this.#resizePoints.topLeft);
            this.#resizeEvents.topLeft.enable();
            this.#resizeContainer.appendChild(this.#resizePoints.topRight);
            this.#resizeEvents.topRight.enable();
            this.#resizeContainer.appendChild(this.#resizePoints.bottomRight);
            this.#resizeEvents.bottomRight.enable();
            this.#resizeContainer.appendChild(this.#resizePoints.bottomLeft);
            this.#resizeEvents.bottomLeft.enable();
            this.#resizeContainer.appendChild(this.#resizePoints.left);
            this.#resizeEvents.left.enable();
            this.#resizeContainer.appendChild(this.#resizePoints.right);
            this.#resizeEvents.right.enable();
            this.#resizeContainer.appendChild(this.#resizePoints.top);
            this.#resizeEvents.top.enable();
            this.#resizeContainer.appendChild(this.#resizePoints.bottom);
            this.#resizeEvents.bottom.enable();
        }
        if(this.#behaviourConfig.move) {
            this.#resizeContainer.appendChild(this.#movePoint.el);
            this.#movePoint.enable();
        }
        this.#contentHolder = Utils.createAndAppendHTMLElement(this.#container, 'section', ['contentHolder']);
        if(typeof content == 'string' || typeof content == 'number') {
            this.content = Utils.createAndAppendHTMLElement(this.#contentHolder, 'div', ['content'], {}, `${content}`);
        } else if(Utils.isElement(content)) { //@ts-ignore
            if(!content.classList.contains('content')) { //@ts-ignore
                content.classList.add('content')
            } //@ts-ignore
            this.#contentHolder.appendChild(content); //@ts-ignore
            this.content = content;
        } else {
            let classNames = ['content']; //@ts-ignore
            if(content.classNames) { //@ts-ignore
                content.classNames.forEach((className) => {
                    if(!classNames.includes(className)) {
                        classNames.push(className);
                    }
                });
            } //@ts-ignore
            this.content = Utils.createAndAppendHTMLElement(this.#contentHolder, content.type, classNames, content.params, content.content);
        }
        this.#footer = Utils.createAndAppendHTMLElement(this.#container, 'footer');
        this.focused = true;
        if(config.startFullscreen) {
            this.isFullscreen = true;
        }
    }
}

export { DisplayWindow };