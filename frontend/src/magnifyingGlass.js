/** @typedef {import("./app").App} App */
import { Utils } from "./utils";
import { DisplayWindow } from "./window";

class MagnifyingGlass {
    /** @type {App} */
    app;
    /** @type {Boolean} */
    enabled = true;

    /**
     * 
     * @param {{x: Number, y: Number}} pos 
     */
    sendCords = (pos) => {
        let diffX = ((pos.x)/this.app.mapSizeScaled.width)*100;
        let diffY = ((pos.y)/this.app.mapSizeScaled.height)*100;
        let minX = 3;
        let maxX = 97;
        if(diffX < minX) {
            diffX = minX;
        } else if(diffX > maxX) {
            diffX = maxX;
        }
        let minY = 2.5;
        let maxY = 97.5;
        if(diffY < minY) {
            diffY = minY;
        } else if(diffY > maxY) {
            diffY = maxY;
        }
        this.windowContent.style.setProperty(`--currentMapOffsetX`, `-${diffX}%`);
        this.windowContent.style.setProperty(`--currentMapOffsetY`, `-${diffY}%`);
    }

    onClose = () => {

    }

    close = () => {
        this.windowEl.close();
    }

    /**
     * @param {App} app 
     * @param {() => void} onClose
     */
    constructor(app, onClose) {
        this.app = app;
        this.onClose = onClose;
        let gdc = Utils.gcd(this.app.mapSize.width, this.app.mapSize.height);
        this.windowContent = Utils.createHTMLElement('div', ['content', 'magnifyingGlass']);
        this.windowEl = new DisplayWindow(this.windowContent, {
            className: ['magnifyingGlass', 'open'], 
            id: `magnifyingGlass`,
            name: `Lupa`,
            type: `magnifyingGlass-window`,
            behaviour: {minimize: false, fullscreen: false, close: true, resize: false},
            size: {width: 300, height: 300 + 35},
            pos: {x: (window.innerWidth) - 320, y: 20}
        });
        this.windowEl.onClose = () => {
            return new Promise((res) => {
                this.onClose();
                this.app.removeInfoWindow(this.windowEl);
                this.app.magnifyingGlass = undefined;
                if(this.app.optionsMenu) {
                    if(this.app.optionsMenu.options.magnifyingGlass) {
                        this.app.optionsMenu.options.magnifyingGlass.silentDisable();
                        this.app.viewOptions.glassOpened = false;
                    }
                }
                res(true);
            });
        }
        this.mapsCont = Utils.createAndAppendHTMLElement(this.windowContent, 'div', ['cont']);
        this.mapCanvas = Utils.createAndAppendHTMLElement(this.mapsCont, 'canvas', ['screen-glass'], {attibutes: {"width": `${this.app.mapSizeScaled.width}`, "height": `${this.app.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.app.mapSize.width / gdc} / ${this.app.mapSize.height / gdc}`, 'width': `${this.app.mapSizeScaled.width}px`, 'height': `${this.app.mapSizeScaled.height}px`}});
        this.plotsCanvas = Utils.createAndAppendHTMLElement(this.mapsCont, 'canvas', ['screen-glass', 'plots'], {attibutes: {"width": `${this.app.mapSizeScaled.width}`, "height": `${this.app.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.app.mapSize.width / gdc} / ${this.app.mapSize.height / gdc}`, 'width': `${this.app.mapSizeScaled.width}px`, 'height': `${this.app.mapSizeScaled.height}px`}});
        this.humansCanvas = Utils.createAndAppendHTMLElement(this.mapsCont, 'canvas', ['screen-glass', 'humans'], {attibutes: {"width": `${this.app.mapSizeScaled.width}`, "height": `${this.app.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.app.mapSize.width / gdc} / ${this.app.mapSize.height / gdc}`, 'width': `${this.app.mapSizeScaled.width}px`, 'height': `${this.app.mapSizeScaled.height}px`}});
        this.pinnedHumansCanvas = Utils.createAndAppendHTMLElement(this.mapsCont, 'canvas', ['screen-glass', 'pinnedHumans'], {attibutes: {"width": `${this.app.mapSizeScaled.width}`, "height": `${this.app.mapSizeScaled.height}`}, css: {'aspect-ratio': `${this.app.mapSize.width / gdc} / ${this.app.mapSize.height / gdc}`, 'width': `${this.app.mapSizeScaled.width}px`, 'height': `${this.app.mapSizeScaled.height}px`}});
        this.app.appCont.append(this.windowEl.window);
        this.app.addInfoWindow(this.windowEl);
        this.mapCanvasCtx = this.mapCanvas.getContext('2d');
        this.humansCanvasCtx = this.humansCanvas.getContext('2d');
        this.pinnedHumansCanvasCtx = this.pinnedHumansCanvas.getContext('2d');
        this.plotsCanvasCtx = this.plotsCanvas.getContext('2d');
        this.mapCanvasCtx.drawImage(this.app.mapCanvas, 0, 0);
        this.plotsCanvasCtx.drawImage(this.app.plotsCanvas, 0, 0);
        let waitTime = Utils.getTransitionTime(this.windowEl.window);
        setTimeout(() => {
            if(this.windowEl.window.classList.contains('open')) {
                this.windowEl.window.classList.remove('open');
            }
            this.app.focusInfoWindow(this.windowEl);
            this.windowEl.window.addEventListener('pointerdown', () => {
                this.app.focusInfoWindow(this.windowEl);
            });
        }, waitTime);
    }
}

export { MagnifyingGlass };