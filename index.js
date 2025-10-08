import Files from "files";
import fs from "fs";
import sharp from "sharp";
import { readdir, readFile } from 'node:fs/promises';
import { Color } from "./simulation/utils.js";
import { WebSocketExpress, Router } from 'websocket-express';
import { Grid } from "./simulation/grid.js";
import { Simulation } from "./simulation/simulation.js";
import { SimulationGlobals } from "./simulation/simulationGlobals.js";
import { LogWrite } from "./logWrite.js";
import { streets } from "./data/streets.js";
import { intrests, intrestCategories } from "./data/intrests.js";
import https from "https";

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const setOrigins = (req, res) => {
    const allowedOrigins = ['https://goblin.international', 'http://goblin.international', 'https://goblin.international:443', 'http://goblin.international:80', 'https://goblin.international:10443', 'http://goblin.international:8080', 'http://goblin.international:5173', 'http://goblin.international:5174', 'https://goblin.international:5174'];
    if(allowedOrigins.includes(req.get('origin'))) {
        res.set({
            'Access-Control-Allow-Origin': req.get('origin')
        });
    }
}

const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/goblin.international-0001/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/goblin.international-0001/cert.pem', 'utf8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/goblin.international-0001/chain.pem', 'utf8')
}

/** @returns {{saveLogs: Boolean, generateColors: Boolean, clearConsole: Boolean}} */
const getCommandLineParams = () => {
    let returnParams = {saveLogs: false, generateColors: false, clearConsole:true};
    if (process.argv.length > 0) {
        if(process.argv.indexOf('-save-logs') > -1) {
            returnParams.saveLogs = true;
        }
        if(process.argv.indexOf('-no-clear') > -1) {
            returnParams.clearConsole = false;
        }
        if(process.argv.indexOf('-colors') > -1) {
            returnParams.generateColors = true;
        }
    }
    return returnParams;
}

const {saveLogs, generateColors, clearConsole} = getCommandLineParams();
const log = new LogWrite(saveLogs);

const createColors = () => {
    const colors = {
        color1: '#8C876D',
        color2: '#F2BFA2',
        color3: '#A2D92B',
        color4: '#C7CFD9',
        color5: '#A5A2F2',
        color6: '#D9462B',
        color7: '#A69F61',
        color8: '#84A660',
        color9: '#AB2BD9',
        color10: '#2B66D9',
        color11: '#D9A32B',
        color12: '#2BD98F'
    };
    return new Promise((res) => {
        let colorsObjStringStart = '';
        let cssColorsString = '';
        const colorsObj = Color.createAltColors(colors, "object", {prefix: ""});
        let jsColorsTypedef = ``;
        Object.keys(colorsObj).forEach((key) => {
            let typedefLight = ``;
            let typedefDark = ``;
            colorsObjStringStart+=`    --${key}: ${colors[key]};\n`;
            let lightString = `:root { /* ${key} light */\n`;
            let darkString = `:root { /* ${key} dark */\n`;
            Object.keys(colorsObj[key].light).forEach((_key) => {
                lightString+= `    --${_key}: ${colorsObj[key].light[_key]};\n`;
                typedefLight+= ` "${_key}": "${colorsObj[key].light[_key]}",`;
            });
            Object.keys(colorsObj[key].dark).forEach((_key) => {
                darkString+= `    --${_key}: ${colorsObj[key].dark[_key]};\n`;
                typedefDark+= ` "${_key}": "${colorsObj[key].dark[_key]}",`;
            });
            if(typedefLight.length > 0) {
                typedefLight = `{${typedefLight.slice(0, -1)} }`;
            } else {
                typedefLight = `*`;
            }
            if(typedefDark.length > 0) {
                typedefDark = `{${typedefDark.slice(0, -1)} }`;
            } else {
                typedefDark = `*`;
            }
            lightString += `}`;
            darkString += `}`;

            jsColorsTypedef+= `"${key}": { base: "${colors[key]}", light: ${typedefLight}, dark: ${typedefDark} }, `;

            cssColorsString += `${lightString}\n${darkString}\n`;
        });

        /** @type {Array<Promise>} */
        const promiseArr = [new Promise((_res) => { _res(true); })];
        if(jsColorsTypedef.length > 0) {
            let obj = `const colors = { ${jsColorsTypedef.slice(0, -2)} };`;
            jsColorsTypedef = `/** @type {{ ${jsColorsTypedef.slice(0, -2)} }} */\n`;
            promiseArr.push(Files.write(`./frontend/src/colors.js`, `${jsColorsTypedef}${obj}\nexport { colors };`));
        } else {
            jsColorsTypedef = "/** @type {*} */\n";
            promiseArr.push(Files.write(`./frontend/src/colors.js`, `${jsColorsTypedef}const colors = {};\nexport { colors };`));
        }
        cssColorsString = `:root {\n${colorsObjStringStart}}\n${cssColorsString}`;
        promiseArr.push(Files.write('./frontend/src/css/colors.css', cssColorsString));

        Promise.all(promiseArr).then(() => {
            res(true);
        });
    });
}

/**
 * @typedef {{size: {width: Number, height: Number}, data: Array<Array<Boolean>>}} SPRITE
 */

/** @returns {Promise<{[id:String]: SPRITE}>} */
const getSprites = () => {
    return new Promise((resolve) => {
        readdir('./sprites', { withFileTypes: true }).then((entries) => {
            /** @type {Array<Promise<{name: String, data: SPRITE}>>} */
            const promiseArr = [];

            for(let i = 0; i<entries.length; i++) {
                if(!entries[i].isDirectory() && entries[i].name.slice(-4) == '.png') {
                    let name = entries[i].name.slice(0, -4);
                    promiseArr.push(new Promise(async (res) => {
                        const { data, info } = await sharp(`./sprites/${name}.png`).toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
                        /** @type {Array<Number>} */
                        const RAW = Array.from(data);
                        res({name: name, data: {size: {width: info.width, height: info.height}, data: new Array(info.width).fill(null).map((el, colId) => {
                            return new Array(info.height).fill(false).map((_el, rowId) => {
                                if (RAW[colId + rowId*info.width]) {
                                    return false;
                                } else {
                                    return true;
                                }
                            });
                        })}});
                    }));
                }
            }

            Promise.all(promiseArr).then((images) => {
                /** @type {{[id:String]: SPRITE}} */
                let returnObject = {};
                images.forEach((imgData) => {
                    returnObject[imgData.name] = imgData.data;
                });
                resolve(returnObject);
            });
        });
    });
}

/** @returns {Promise<Boolean>} */
const copyGlobals = () => {
    return new Promise(async (res) => {
        let fileExists = await Files.exists('./simulation/simulationGlobals.js');
        if(fileExists) {
            let text = await Files.read('./simulation/simulationGlobals.js', {type: "text"});
            await Files.write('./frontend/src/simulationGlobals.js', text);
        }
        res(true);
    });
}

/**
 * @typedef {Object} RAW_MAP_PIXEL
 * @property {Boolean} w - walkable
 * @property {"W"|"N"|"B"|"S"} t - type "W" - water, "N" - nature, "B" - building, "S" - street
 * @property {Number|undefined} [s] - id of street if exists
 */

/**
 * @typedef {Array<Array<RAW_MAP_PIXEL>>} RAW_MAP
 */

/** @typedef {Array<Array<1|0>>} WALKABILITY_ARR */

const port = 3000;
const portHttps = 3001;

const init = async () => {
    /** 
     * @param {String} path
     * @returns {Promise<Array<Array<String>>>}
     */
    const getColorsOfImage = (path) => {
        return new Promise(async (res, rej) => {
            const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
            if(info.width && info.height) {
                const RAW = new Array(info.width).fill([]).map((el) => { return []; });
                    
                let channel = 0;
                let colId = 0;
                let rowId = 0;
                let currentElement = '#';
                for(let pData of Array.from(data)) {
                    let currString = pData.toString(16);
                    if(currString.length < 2) {
                        currString = `0${currString}`;
                    }
                    currentElement += currString;
                    channel++;
                    if(channel >= 3) {
                        RAW[colId][rowId] = `${currentElement}`;
                        channel = 0;
                        currentElement = '#';
                        colId++;
                        if(colId >= info.width) {
                            colId = 0;
                            rowId++;
                        }
                    }
                }

                res(RAW);
            } else {
                rej('error reading file');
            }
        });
    }

    /** @returns {Promise<RAW_MAP>} */
    const getRawMap = () => {
        return new Promise(async (res) => {
            const results = await Promise.all([getColorsOfImage('./data/outlines.png'), getColorsOfImage('./data/streets.png')]);
            
            /**
             * 
             * @param {RAW_MAP_PIXEL} obj 
             * @param {Number} colId 
             * @param {Number} rowId 
             */
            const getStreetForBuilding = (obj, colId, rowId) => {
                /** @type {{[id: String]: Number}} */
                let counts = {};
                [
                    { rowId: rowId - 1, colId: colId - 1},
                    { rowId: rowId - 1, colId: colId },
                    { rowId: rowId - 1, colId: colId + 1 },
                    { rowId: rowId + 1, colId: colId - 1 },
                    { rowId: rowId + 1, colId: colId },
                    { rowId: rowId + 1, colId: colId - 1 },
                    { rowId: rowId, colId: colId - 1 },
                    { rowId: rowId, colId: colId + 1 }
                ].forEach((sibling) => {
                    if(sibling.colId >= 0 && sibling.colId < results[1].length && sibling.rowId >= 0 && sibling.rowId < results[1][0].length) {
                        if(Object.keys(streets).includes(results[1][sibling.colId][sibling.rowId])) {
                            if(streets[results[1][sibling.colId][sibling.rowId]].noBuildings !== true) {
                                if(Object.keys(counts).includes(results[1][sibling.colId][sibling.rowId])) {
                                    counts[results[1][sibling.colId][sibling.rowId]]++;
                                } else {
                                    counts[results[1][sibling.colId][sibling.rowId]] = 1;
                                }
                            }
                        }
                    }
                });
                if(Object.keys(counts).length > 0) {
                    const keys = Object.keys(counts);
                    let currentStreet = keys[0];
                    let max = counts[keys[0]] + 0;
                    for(let i = 1; i<keys.length; i++) {
                        if(counts[keys[i]] > max) {
                            currentStreet = keys[i];
                            max = counts[keys[i]];
                        }
                    }
                    obj.s = Object.keys(streets).indexOf(currentStreet);
                }
            }

            /**
             * @param {RAW_MAP_PIXEL} obj 
             * @param {Number} colId 
             * @param {Number} rowId 
             */
            const getStreetForWalkable = (obj, colId, rowId) => {
                if(Object.keys(streets).includes(results[1][colId][rowId])) {
                    obj.s = Object.keys(streets).indexOf(results[1][colId][rowId]);
                }
            }
            
            let RAW_MAP = results[0].map((row, colId) => {
                return row.map((colorHex, rowId) => {
                    /** @type {RAW_MAP_PIXEL} */
                    let obj = { w: true, t: "S" };
                    switch(colorHex) {
                        case '#000000': {
                            obj = { w: false, t: "B" };
                            getStreetForBuilding(obj, colId, rowId);
                            break;
                        }
                        case '#0000ff': {
                            obj = { w: false, t: "W" };
                            break;
                        }
                        case '#00ff00': {
                            obj = { w: true, t: "N" };
                            getStreetForWalkable(obj, colId, rowId);
                            break;
                        }
                        default: {
                            getStreetForWalkable(obj, colId, rowId);
                            break;
                        }
                    }

                    return obj;
                });
            });

            //@ts-ignore
            res(RAW_MAP);
        });
    }

    
    const RAW_MAP = await getRawMap();
    if(generateColors) { 
        await createColors();
    }
    await copyGlobals();
    console.clear();

    const sprites = await getSprites();

    let simulation = new Simulation(new Grid(RAW_MAP), SimulationGlobals.startHumans, SimulationGlobals.startHospitalities, log);

    const app = new WebSocketExpress();
    const router = new Router();
    /** @type {Array<{ws: import("websocket-express").ExtendedWebSocket, id: Number, requireStatusOf: Array<Number>, requireStatusOfPlots: Array<Number>}>} */
    let connections = [];

    // app.use(bodyParser.text());

    router.ws('/', async(req, res) => {
        const ws = await res.accept();
        let id = connections.length;
        let connection = {ws: ws, requireStatusOf: [], requireStatusOfPlots: []};
        Object.defineProperty(connection, 'id', {
            set: (val) => {
                id = val;
            },
            get: () => {
                return id;
            },
            enumerable: true
        }); //@ts-ignore
        connections.push(connection);
        ws.onmessage = (event) => {
            let indexOfDash = event.data.indexOf('-');
            if(indexOfDash >= 0) {
                let tag = event.data.slice(0, indexOfDash);
                let rest = event.data.slice(indexOfDash + 1);
                switch(tag) {
                    case 'humanData': {
                        let targetId = Number(rest);
                        if(!isNaN(targetId)) {
                            ws.send(`humanData-${JSON.stringify(simulation.getHumanData(targetId))}`);
                        }
                        break;
                    }
                    case 'humanStatus': {
                        let targetId = Number(rest);
                        if(!isNaN(targetId)) {
                            if(!connection.requireStatusOf.includes(targetId)) {
                                connection.requireStatusOf.push(targetId);
                            }
                            ws.send(`humanStatus-${JSON.stringify(simulation.getHumanStatus(targetId))}`);
                        }
                        break;
                    }
                    case 'plotStatus': {
                        let targetId = Number(rest);
                        if(!isNaN(targetId)) {
                            if(simulation.plots[targetId]) {
                                if(!connection.requireStatusOfPlots.includes(targetId)) {
                                    connection.requireStatusOfPlots.push(targetId);
                                }
                                ws.send(`humanStatus-${JSON.stringify(simulation.getPlotStatus(targetId))}`);
                            }
                        }
                        break;
                    }
                    case 'humanStatusRevoke': {
                        let targetId = Number(rest);
                        if(!isNaN(targetId)) {
                            let indexOf = connection.requireStatusOf.indexOf(targetId);
                            if(indexOf >= 0) {
                                connection.requireStatusOf = connection.requireStatusOf.slice(0, indexOf).concat(connection.requireStatusOf.slice(indexOf+1));
                            }
                        }
                        break;
                    }
                    case 'plotStatusRevoke': {
                        let targetId = Number(rest);
                        if(!isNaN(targetId)) {
                            let indexOf = connection.requireStatusOfPlots.indexOf(targetId);
                            if(indexOf >= 0) {
                                connection.requireStatusOfPlots = connection.requireStatusOfPlots.slice(0, indexOf).concat(connection.requireStatusOfPlots.slice(indexOf + 1));
                            }
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        ws.send(`tickData-${JSON.stringify(simulation.tick)}`);
        ws.onclose = () => {
            /** @type {Array<{ws: import("websocket-express").ExtendedWebSocket, id: Number, requireStatusOf:Array<Number>, requireStatusOfPlots:Array<Number>}>} */
            let newConnections = [];
            let newIndex = 0;
            connections.forEach((_con) => {
                if(_con.id !== id) {
                    _con.id = newIndex + 0;
                    newConnections.push(_con);
                    newIndex++;
                }
            });
            connections = newConnections;
        }
    });

    router.get('/sprite/*splat', async (req, res) => {
        let name = `${req.url.trim()}`.replace(`/sprite/`, '');
        let lastIndexOf = name.lastIndexOf(`/`);
        if(lastIndexOf > 0) {
            name = name.slice(0, lastIndexOf);
        }
        setOrigins(req, res);
        if(Object.keys(sprites).includes(name)) {
            res.json(sprites[name]);
        } else {
            res.json([[false]]);
        }
    });

    router.get('/intrests', async (req, res) => {
        setOrigins(req, res);
        res.json({intrests: intrests.list, categories: intrestCategories.list});
    });

    router.get('/mapSize', async (req, res) => {
        setOrigins(req, res);
        res.json({width: RAW_MAP.length, height: RAW_MAP[0].length});
    });

    router.get('/rawMap', async (req, res) => {
        setOrigins(req, res);
        res.json(RAW_MAP);
    });

    router.get('/plots', async (req, res) => {
        setOrigins(req, res);
        const plots = simulation.plots.map((plot) => {
            if(plot.isHospitality) { //@ts-ignore
                return {id: plot.id, pos: plot.pos, squares: plot.squares, name: plot.name, adress: plot.adress, isHospitality: plot.isHospitality, welcomeIntrestsTags: plot.welcomeIntrestsTags, welcomeIntrestCategories: plot.welcomeIntrestCategories, unwelcomeIntrestsTags: plot.unwelcomeIntrestsTags, unwelcomeIntrestCategories: plot.unwelcomeIntrestCategories };
            } else {
                return {id: plot.id, pos: plot.pos, squares: plot.squares, name: plot.name, adress: plot.adress, isHospitality: plot.isHospitality}
            }
        });
        res.json(plots);
    });

    app.use(router);
    const httpsServer = https.createServer(credentials);
    app.attach(httpsServer)
    httpsServer.listen(portHttps);
    const server = app.createServer();
    server.listen(port);

    simulation.onLogWrite = (str) => {
        for(let con of connections) {
            try {
                con.ws.send(`log-${str}`);
            } catch(err) {
                console.error(err);
            }
        }
    }

    simulation.onNewTick = ((tickData, msg) => {
        return new Promise((res) => {
            if(clearConsole) {
                console.clear();
                console.log(`Listening on port ${port}...`);
                console.log(`\n`);
                console.log(msg);
            }
            for(let con of connections) {
                try {
                    con.ws.send(`tickData-${JSON.stringify(tickData)}`);
                } catch(err) {
                    console.error(err);
                }
                if(con.requireStatusOf.length > 0) {
                    for(let humanId of con.requireStatusOf) {
                        try {
                            con.ws.send(`humanStatus-${JSON.stringify(simulation.getHumanStatus(humanId))}`);
                        } catch(err) {
                            console.error(err);
                        }
                    }
                }
                if(con.requireStatusOfPlots.length > 0) {
                    for(let plotId of con.requireStatusOfPlots) {
                        try {
                            con.ws.send(`plotStatus-${JSON.stringify(simulation.getPlotStatus(plotId))}`);
                        } catch(err) {
                            console.error(err);
                        }
                    }
                }
            }
            res(true);
        });
    });
    
    simulation.start();
}

try {
    init();
} catch(error) {
    console.error(error);
}