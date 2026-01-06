/** @typedef {import("./app").App} App */
/** @typedef {import("../../simulation/entites").HUMAN_DATA} HUMAN_DATA */
import { CustomScroll, Utils } from "./utils";
import { DisplayWindow } from "./window";

class ALLHumansWindow {
    /** @type {App} */
    app;
    get parent() {
        return this.app;
    }
    set parent(v) {
        this.app = v;
    }

    /** @type {DisplayWindow} */
    windowEl;

    /** @type {HTMLElement} */
    windowContent;

    /** @type {CustomScroll} */
    customScroll;

    /** @type {{[key in ('A'|'Ą'|'B'|'C'|'Ć'|'D'|'E'|'Ę'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'Ł'|'M'|'N'|'Ń'|'O'|'Ó'|'P'|'R'|'S'|'Ś'|'T'|'U'|'W'|'Y'|'Z'|'Ź'|'Ż')]?: {data: Array<HUMAN_DATA>, parentCont: HTMLElement, head: HTMLElement, cont: HTMLElement, elements: Array<HTMLElement>}}} */
    sortedData = {};

    /** @returns {Promise<ALLHumansWindow>} */
    init = () => {
        return new Promise((res) => {
            this.windowContent = Utils.createHTMLElement('div', ['content']);
            const promiseArr = this.app.humans.map((el) => { return el.getData(); });
            Promise.all(promiseArr).then((data) => {
                data.sort((a, b) => {
                    return `${a.info.lastname.slice} ${a.info.name}`.localeCompare(`${b.info.lastname} ${b.info.name}`);
                }).forEach((human, index) => {
                    let firstLetter = human.info.lastname.slice(0, 1).toLocaleUpperCase();
                    let element = Utils.createHTMLElement('a', ['humanName', 'clickable'], { css: { 'order': `${index}` } }, `<div class="inner"><p><span class="name">${human.info.name}</span> <span class="lastname">${human.info.lastname}</span></p></div>`);
                    element.addEventListener('click', () => {
                        if(this.app.humans[human.id]) {
                            this.app.humans[human.id].handleClick();
                        }
                    });
                    if(this.sortedData[firstLetter]) {
                        this.sortedData[firstLetter].cont.appendChild(element);
                        this.sortedData[firstLetter].data.push(human);
                        this.sortedData[firstLetter].elements.push(element);
                    } else {
                        this.sortedData[firstLetter] = {
                            data: [human],
                            parentCont: Utils.createHTMLElement('div', ['letterParent']),
                            cont: Utils.createHTMLElement('div', ['letterList']),
                            head: Utils.createHTMLElement('div', ['letter'], {}, `${firstLetter}`),
                            elements: [element]
                        }
                        this.sortedData[firstLetter].parentCont.appendChild(this.sortedData[firstLetter].head);
                        this.sortedData[firstLetter].cont.appendChild(element);
                        this.sortedData[firstLetter].parentCont.appendChild(this.sortedData[firstLetter].cont);
                        this.windowContent.appendChild(this.sortedData[firstLetter].parentCont);
                    }
                });
                console.log((this.sortedData));
                let size = { width: 900, height: 600 };
                this.windowEl = new DisplayWindow(this.windowContent, {
                    className: ['ALLHumans', 'open'],
                    id: `ALLHumansWindow`,
                    name: `ALLHumans`,
                    type: `ALLHumans-window`,
                    behaviour: { minimize: false, fullscreen: false, close: true },
                    size: size,
                    pos: { x: window.innerWidth - (10 + size.width), y: window.innerHeight - (10 + size.height) }
                });
                this.windowEl.onClose = () => {
                    this.customScroll.dettachObserver();
                    return new Promise((__res) => {
                        Promise.all(this.app.humans.map((human) => {
                            if(true) {
                                return new Promise((_res) => { _res(true) });
                            } else {
                                
                            }
                        })).then(() => {
                            __res(true);
                        });
                    });
                };
                this.parent.appCont.append(this.windowEl.window);
                this.customScroll = new CustomScroll(this.windowContent, 'windowContentScroll');
                this.parent.addInfoWindow(this.windowEl);
                let waitTime = Utils.getTransitionTime(this.windowEl.window);
                setTimeout(() => {
                    if(this.windowEl.window.classList.contains('open')) {
                            this.windowEl.window.classList.remove('open');
                    }
                    this.parent.focusInfoWindow(this.windowEl);
                    this.customScroll.attachObserver();
                    this.windowEl.window.addEventListener('pointerdown', () => {
                        this.parent.focusInfoWindow(this.windowEl);
                    });
                }, waitTime);
                res(this);
            });
        });
    }

    /**
     * 
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        
    }
}

export {ALLHumansWindow};