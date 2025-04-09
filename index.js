import sharp from "sharp";
import { Color } from "./simulation/utils";
import { Grid } from "./simulation/map";
import { Simulation } from "./simulation/simulation";
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
            const { data, info } = await sharp('./src.png').toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
            if (info.width && info.height) {
                /** @type {Array<Number>} */
                const RAW = Array.from(data);
                let iterator = -1;
                /** @type {Array<Array<Number>>} */
                res(new Array(info.width).fill(null).map(() => {
                    return new Array(info.height).fill(0).map(() => {
                        iterator++;
                        if (RAW[iterator]) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                }));
            }
        });
    }

    const colorsFile = Bun.file('./public/css/colors.css');
    let colorsObjStringStart = '';
    let cssColorsString = '';
    const colorsObj = Color.createAltColors(colors, "objString", {prefix: "    --"});
    Object.keys(colorsObj).forEach((key) => {
        colorsObjStringStart+=`    --${key}: ${colors[key]};\n`;
        cssColorsString += `:root {\n${colorsObj[key]}\n}\n`
    });

    cssColorsString = `:root {\n${colorsObjStringStart}}\n${cssColorsString}`;
    await colorsFile.write(cssColorsString);

    const RAW_MAP = await getRawMap(); //@ts-ignore
    simulation = new Simulation(new Grid(RAW_MAP), 1, 5);
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
        console.log(path, newPath);
        return newPath;
    }

    app.use(bodyParser.text());

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
        let path = getPublicFilePath(url);

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