import Files from "files";
import sharp from "sharp";
import { readdir, readFile } from 'node:fs/promises';
import { Color } from "./simulation/utils.js";
import { WebSocketExpress, Router } from 'websocket-express';
import { Grid } from "./simulation/grid.js";
import { Simulation } from "./simulation/simulation.js";
import { SimulationGlobals } from "./simulation/simulationGlobals.js";
import { LogWrite } from "./logWrite.js";

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


const port = 3000;

const init = async () => {
    /** @returns {Promise<Array<Array<Number>>>} */
    const getRawMap = () => {
        return new Promise(async (res) => {
            const { data, info } = await sharp('./src1.png').toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
            if (info.width && info.height) {
                /** @type {Array<Number>} */
                const RAW = Array.from(data);

                res(new Array(info.width).fill(null).map((el, colId) => {
                    return new Array(info.height).fill(0).map((_el, rowId) => {
                        if (RAW[colId + rowId*info.width]) {
                            return 0;
                        } else {
                            return 1;
                        }
                    });
                }));
            }
        });
    }
    
    const RAW_MAP = await getRawMap();
    if(generateColors) { 
        await createColors();
    }
    console.clear();

    const sprites = await getSprites();

    let simulation = new Simulation(new Grid(RAW_MAP), SimulationGlobals.startHumans, SimulationGlobals.startHospitalities, log);

    const app = new WebSocketExpress();
    const router = new Router();
    /** @type {Array<{ws: import("websocket-express").ExtendedWebSocket, id: Number}>} */
    let connections = [];

    // app.use(bodyParser.text());

    router.ws('/', async(req, res) => {
        const ws = await res.accept();
        let id = connections.length;
        let connection = {ws: ws};
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
            if(event.data.slice(0, 'humanData-'.length) == 'humanData-') {
                let targetId = Number(event.data.slice('humanData-'.length));
                if(!isNaN(targetId)) {
                    ws.send(`humanData-${JSON.stringify(simulation.getHumanData(targetId))}`);
                }
            }
        }
        ws.send(`tickData-${JSON.stringify(simulation.tick)}`);
        ws.onclose = () => {
            /** @type {Array<{ws: import("websocket-express").ExtendedWebSocket, id: Number}>} */
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
        res.set({
            'Access-Control-Allow-Origin': '*'
        });
        if(Object.keys(sprites).includes(name)) {
            res.json(sprites[name]);
        } else {
            res.json([[false]]);
        }
    });

    router.get('/mapSize', async (req, res) => {
        res.set({
            'Access-Control-Allow-Origin': '*'
        });
        res.json({width: RAW_MAP.length, height: RAW_MAP[0].length});
    });

    router.get('/rawMap', async (req, res) => {
        res.set({
            'Access-Control-Allow-Origin': '*'
        });
        res.json(RAW_MAP);
    });

    app.use(router);
    const server = app.createServer();
    console.log(`Listening on port ${port}...`);
    server.listen(port);

    simulation.onNewTick = ((tickData, msg) => {
        return new Promise((res) => {
            if(clearConsole) {
                console.clear();
                console.log(`Listening on port ${port}...`);
            }
            console.log(`\n`);
            console.log(msg);
            connections.forEach((con) => {
                try {
                    con.ws.send(`tickData-${JSON.stringify(tickData)}`);
                } catch(err) {
                    console.error(err);
                }
            });
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