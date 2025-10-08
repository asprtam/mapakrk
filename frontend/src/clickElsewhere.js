import { Utils } from "./utils.js";

class ClickElewhereEvent {
    /**
     * @type {HTMLElement}
     */
    #element;
    /**
     * @type {() => void}
     */
    #callback;
    /** @type {String} */   
    #id;
    #enabled = false;
    /** @param {MouseEvent} event */
    #elsewhereFunc = (event) => {
        /** 
         * @param {HTMLElement} el 
         * @returns {Boolean}
         */
        const checkParent = (el) => {
            if(el.getAttribute('id') == this.#id) {
                return true;
            } else if(el.parentElement && el?.tagName.toLowerCase() != 'body') {
                return checkParent(el.parentElement);
            } else {
                return false;
            }
        }
        
        if(event.target) { //@ts-ignore
            if(event.target.getAttribute('id') && this.#id.trim() == event.target.getAttribute('id').trim()) { //@ts-ignore
            } else if (!this.#element.contains(event.target)) {
                this.#callback();
            }
        } else {
            this.#callback();
        }
    }
    get enabled() {
        return this.#enabled;
    }
    set enabled(val) {
        if(val) {
            if (!this.#enabled) {
                this.#enabled = true
                document.body.addEventListener('click', this.#elsewhereFunc);
            }
        } else {
            if (this.#enabled) {
                this.#enabled = false
                document.body.removeEventListener('click', this.#elsewhereFunc);
            }
        }
    }
    /**
     * @param {HTMLElement} element
     * @param {() => void} callback
     * @param {String} [id]
     */
    constructor(element, callback, id) {
        this.#element = element;
        this.#callback = callback;
        if(id) {
            this.#id = id;
            this.#element.setAttribute('id', id);
        } else if(this.#element.getAttribute('id')) { //@ts-ignore
            this.#id = this.#element.getAttribute('id');
        } else {
            this.#id = Utils.makeId(10, "clickElsewhwere-master-");
            this.#element.setAttribute('id', this.#id);
        }
    }
}

export { ClickElewhereEvent };