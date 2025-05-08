import sharp from "sharp";
import { Color } from "./simulation/utils";
import { Grid } from "./simulation/grid";
import { Simulation } from "./simulation/simulation";
import { SimulationGlobals } from "./simulation/simulationGlobals";
import express from "express";
import bodyParser, { text } from "body-parser"; //@ts-ignore
/** @type {false|Server<typeof IncomingMessage, typeof ServerResponse>} */
let server = false;
/** @type {Simulation|Null} */
let simulation = null;
const port = 80;

const colors = {
    color1: '#8C876D',
    color2: '#F2BFA2',
    color3: '#A2D92B',
    color4: '#C7CFD9',
    color5: '#A5A2F2',
    color6: '#D9462B',
    color7: '#A69F61',
    color8: '#84A660'
}

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

    const colorsCSSFile = Bun.file('./public/css/colors.css');
    const colorsJSFile = Bun.file('./public/js/colors.js');
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
    if(jsColorsTypedef.length > 0) {
        let obj = `const colors = { ${jsColorsTypedef.slice(0, -2)} };`;
        jsColorsTypedef = `/** @type {{ ${jsColorsTypedef.slice(0, -2)} }} */\n`;
        await colorsJSFile.write(`${jsColorsTypedef}${obj}\nexport { colors };`);
    } else {
        jsColorsTypedef = "/** @type {*} */\n";
        await colorsJSFile.write(`${jsColorsTypedef}const colors = {};\nexport { colors };`);
    }
    cssColorsString = `:root {\n${colorsObjStringStart}}\n${cssColorsString}`;
    await colorsCSSFile.write(cssColorsString);

    const RAW_MAP = await getRawMap(); //@ts-ignore
    // console.log('RAW_MAP', RAW_MAP);
    console.log({width: RAW_MAP.length, height: RAW_MAP[0].length});
    simulation = new Simulation(new Grid(RAW_MAP), SimulationGlobals.startHumans, SimulationGlobals.startHospitalities);
    simulation.start();

    const app = express();

    /**
     * 
     * @param {String} path 
     * @returns {String}
     */
    const getPublicFilePath = (path) => {
        let newPath = ``;

        let pathArr = path.split('/');

        if (pathArr[pathArr.length - 1] == '') {
            pathArr[pathArr.length - 1] = 'index';
        }

        if(!['simulation', 'node_modules'].includes(pathArr[0].toLowerCase().trim())) {
            newPath = `/public`;
            if (pathArr[pathArr.length - 1].indexOf('.') < 0) {
                pathArr[pathArr.length - 1] = `${pathArr[pathArr.length - 1]}.html`;
            }
        } else {
            if (pathArr[pathArr.length - 1].indexOf('.') < 0) {
                pathArr[pathArr.length - 1] = `${pathArr[pathArr.length - 1]}.js`;
            }
        }

        pathArr.forEach((part) => {
            newPath = `${newPath}/${part}`;
        });
        return newPath;
    }

    app.use(bodyParser.text());

    app.get('/mapSize', async (req, res) => {
        res.json({width: RAW_MAP.length, height: RAW_MAP[0].length});
    });

    app.get('/rawMap', async (req, res) => {
        res.json(RAW_MAP);
    });

    app.get('/humansPos', async (req, res) => {
        res.json(simulation.humanPositions);
    });

    app.get('/*', async (req, res) => {
        let url = req.url;
        while (url.slice(0, 1) == '/') {
            url = url.slice(1);
        }
        if (url.slice(-1) == '/') {
            url = url.slice(0, -1);
        }
        let path = `public/index.html`;
        
        if(req.get('Referrer')) {
            path = getPublicFilePath(url);
        }

        let file = Bun.file(`./${path}`);
        let fileExists = await file.exists();

        if(fileExists) {
            res.sendFile(`./${path}`, { root: __dirname });
        } else {
            res.status(404);
        }
    });

    server = app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    });
}

const tryInit = () => {
    if (server) { //@ts-ignore
        server.close();
        server = false;
    }
    if(simulation) {
        simulation.stop();
        simulation = null;
    }

    try {
        init();
    } catch (err) {
        console.error(err);
        tryInit();
    }
}

tryInit();