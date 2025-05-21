import Files from "files";
import sharp from "sharp";
import express from "express";
import { WebSocketServer } from 'ws';
import { Grid } from "./simulation/grid.js";
import { Simulation } from "./simulation/simulation.js";
import { SimulationGlobals } from "./simulation/simulationGlobals.js";


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
    const app = express();

    // app.use(bodyParser.text());

    app.get('/mapSize', async (req, res) => {
        res.set({
            'Access-Control-Allow-Origin': '*'
        });
        res.json({width: RAW_MAP.length, height: RAW_MAP[0].length});
    });

    app.get('/rawMap', async (req, res) => {
        res.set({
            'Access-Control-Allow-Origin': '*'
        });
        res.json(RAW_MAP);
    });

    let simulation = new Simulation(new Grid(RAW_MAP), SimulationGlobals.startHumans, SimulationGlobals.startHospitalities);

    let webSocketServer = new WebSocketServer({ port: port+1, });

    let server = app.listen(port, () => {
        console.clear();
        console.log(`Listening on port ${port}...`);
    });

    /** @type {*} */
    let connection = null;

    webSocketServer.on('connection', (ws) => {
        connection = ws;
    });

    simulation.onNewTick = ((tickData, msg) => {
        return new Promise((res) => {
            console.clear();
            console.log(`Listening on port ${port}...`);
            console.log(`\n`);
            console.log(msg);
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