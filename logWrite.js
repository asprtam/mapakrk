import fs, { WriteStream } from 'fs';

class LogWrite {
    /** @type {String} */
    fileName;
    /** @type {WriteStream} */
    #writer;
    /** @type {Boolean} */
    #save;

    /**
     * 
     * @param  {...any} args 
     * @returns {String}
     */
    #returnText = (...args) => {
        const parseObjString = (objString) => {
            let rtrnTxt = `${objString}`;
            let longestMatch = 3;
            const matchSpace = rtrnTxt.match(/\n\s{2,}/gmi);
            if(matchSpace !== null) {
                matchSpace.forEach((match) => {
                    longestMatch = Math.max(longestMatch, match.length);
                });
            }
            const pattern = new RegExp(`\\n\\s\{${longestMatch - 1},\}`, 'gmi');
            return rtrnTxt.replaceAll(pattern, ' ').replaceAll(/\n\s\}/gmi, ' \}');
        }
        switch(args.length) {
            case 0: {
                return '';
                break;
            }
            case 1: {
                switch(typeof args[0]) {
                    case 'string': {
                        let textToWrite = `${args[0]}`.replaceAll(/\x1b\[\d*m/gmi, '').replaceAll(`"`, `\\\"`);
                        return `"${textToWrite}"`;
                        break;
                    }
                    case 'number':
                    case 'bigint':
                    case 'boolean': {
                        return `${args[0]}`;
                        break;
                    }
                    case 'symbol':
                    case 'undefined': {
                        return `undefined`;
                        break;
                    }
                    case 'object':
                    case 'function': {
                        return `${parseObjString(`${JSON.stringify(args[0], null, ` `)}, `)}`;
                        break;
                    }
                }
                break;
            }
            default: {
                let textToWrite = ``;
                args.forEach((element) => {
                    switch(typeof element) {
                        case 'string': {
                            textToWrite += `"${`${element}`.replaceAll(/\x1b\[\d*m/gmi, '').replaceAll(`"`, `\\\"`)}", `;
                            break;
                        }
                        case 'number':
                        case 'bigint':
                        case 'boolean': {
                            textToWrite += `${element}, `;
                            break;
                        }
                        case 'symbol':
                        case 'undefined': {
                            textToWrite += `undefined`;
                            break;
                        }
                        case 'object':
                        case 'function': {
                            textToWrite += parseObjString(`${JSON.stringify(element, null, ` `)}, `);
                            break;
                        }
                    }
                });
                textToWrite = textToWrite.slice(0, -2);
                return textToWrite;
            }
        }

    }

    /** @type {Array<{time: String, val: String}>} */
    #queue = [];
    /** @type {Boolean} */
    #queueRunning = false;

    /** 
     * @param {{time: String, val: String}} queueElement
     * @returns {Promise<Boolean>}
     */
    #write = (queueElement) => {
        return new Promise((res) => {
            if(queueElement.val.trim().length > 0) {
                this.#writer.write(`\n${queueElement.time} ${queueElement.val}\n`);
                setTimeout(() => {
                    res(true);
                });
            } else {
                setTimeout(() => {
                    res(true);
                });
            }
        });
    }

    #queueFunc = () => {
        if(this.#queue.length > 0) {
            let currentElement = this.#queue[0];
            this.#queue = this.#queue.slice(1);
            this.#write(currentElement).then(() => {
                this.#queueFunc();
            });
        } else {
            this.#queueRunning = false;
        }
    }


    /**
     * @param  {...any} args 
     */
    write = async (...args) => {
        let writText = {time: `${this.#getTimeDate().time}`, val: this.#returnText(...args)};
        if(this.#save) {
            setTimeout(() => {
            this.#queue.push(writText);
                if(!this.#queueRunning) {
                    this.#queueRunning = true;
                    this.#queueFunc();
                }
            });
        }
    }

    /**
     * @returns {{time: String, date: String}}
     */
    #getTimeDate = () => {
        let date = `${new Date(Date.now()).toLocaleString()}`.replaceAll(',', '').trim().split(' ');
        return {time: `${date[1]}`, date: date[0]}; 
    }

    /**
     * @param {Boolean} save
     */
    constructor(save) {
        this.#save = save;
        const {time, date} = this.#getTimeDate();
        console.log(time, date);
        this.fileName = `${date.replaceAll(/[\.\/]/gmi, '-')}_${time.replaceAll(':', '-')}.txt`;
        if(this.#save) {
            if (!fs.existsSync('./logs')) {
                fs.mkdirSync('./logs');
            }
            this.#writer = fs.createWriteStream(`./logs/${this.fileName}`);
            this.#writer.write(`Start: ${time}, ${date}`);
        }
    }
}

export { LogWrite };