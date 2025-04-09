import { Utils } from "../../simulation/utils.js";
import { DisplayWindow } from "./window.js";
/** @typedef {import("../../simulation/utils").HTML_TAGS} HTML_TAGS */
/** @typedef {keyof HTML_TAGS} HTML_TAG */

class App {
    /** @type {Array<DisplayWindow>} */
    windows = [];
    /** @type {{[id:String]: Array<DisplayWindow>}} */
    windowsByType = {};
    /** @type {HTMLElement} */
    appCont;
    /** @type {HTMLInputElement} */
    #fakeInput;

    removeWindow = (id) => {

    }

    dispose = () => {

    }

    /**
     * @param {KeyboardEvent} e 
     */
    handleKey = (e) => {
        e.preventDefault();
        console.log(e);
    }
    
    constructor() {
        this.appCont = Utils.createAndAppendHTMLElement(document.body, 'div', ['app'], {attibutes: {id: 'app'}});
        document.body.addEventListener('keydown', this.handleKey);
        new DisplayWindow(this, 'test', {id: 'test', name: 'Test', desc: 'Testowe okienko', type: 'test', size: {width: 600, height: 400}, pos: {x:10, y: 10}, behaviour: {close: true}});
    }
}

export {App};