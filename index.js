import Files from "files";
import sharp from "sharp";
// import express from "express";
// import { WebSocketServer } from 'ws';
import { WebSocketExpress, Router } from 'websocket-express';
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
    let simulation = new Simulation(new Grid(RAW_MAP), SimulationGlobals.startHumans, SimulationGlobals.startHospitalities);

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
        ws.send(JSON.stringify(simulation.tick));
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

    // let webSocketServer = new WebSocketServer({ port: port+1, });
    app.use(router);
    const server = app.createServer();
    console.clear();
    console.log(`Listening on port ${port}...`);
    server.listen(port);

    // let server = app.listen(port, () => {
    //     console.clear();
    //     console.log(`Listening on port ${port}...`);
    // });

    simulation.onNewTick = ((tickData, msg) => {
        return new Promise((res) => {
            console.clear();
            console.log(`Listening on port ${port}...`);
            console.log(`\n`);
            console.log(msg);
            connections.forEach((con) => {
                try {
                    con.ws.send(JSON.stringify(tickData));
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