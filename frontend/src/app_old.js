class APP_OLD {
    /** 
     * @param {Number} length
     * @param {TICK_DATA} tickData
     * @returns {DRAWING_INSTANCE}
     */
    drawHumans = (length=this.lastFetchTime, tickData) => {
        let stopped = false;
        const drawingInstancePromise = Promise.withResolvers();
        let lastFrame = 0;
        const drawingInstanceFunc = async () => {

            const waitForOrStop = (time=1000) => {
                return new Promise((res) => {
                    let timeoutHelper = null;
                    let timeoutFunc = setTimeout(() => {
                        if(timeoutHelper) {
                            clearTimeout(timeoutHelper);
                            timeoutHelper = null;
                        }
                        res(true);
                    }, time);

                    const waitForOrStopHelperFunc = () => {
                        if(timeoutHelper) {
                            clearTimeout(timeoutHelper);
                            timeoutHelper = null;
                        }
                        if(stopped) {
                            if(timeoutFunc) {
                                clearTimeout(timeoutFunc);
                                timeoutFunc = null;
                            }
                            res(true);
                        } else {
                           timeoutHelper = setTimeout(() => {
                            waitForOrStopHelperFunc();
                           });
                        }
                    }
                    waitForOrStopHelperFunc();
                });
            }


            let frames = length/this.frameTime;
            let i = 0;
            while(i < frames && !stopped) {
                console.log(`draw frame ${i} of ${frames} in tick ${tickData.id}`);
                this.pinnedHumansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                this.fakeCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                this.humansCanvasCTX.clearRect(0, 0, this.mapSizeScaled.width, this.mapSizeScaled.height);
                for(let human of this.humans) {
                    if(tickData.humanPos[human.id]) {
                        human.drawPos(i+0, frames+0, tickData.humanPos[human.id].crossedPoints, tickData.id);
                    } else {
                        human.drawPos(i+0, frames+0, [], tickData.id);   
                    }
                }
                lastFrame = i+0;
                await waitForOrStop(this.frameTime);
                if(stopped) {
                    break;
                }
                i++;
            }
            drawingInstancePromise.resolve(true);
        }
        drawingInstanceFunc();
        return { stop: () => {
            stopped = true;
            console.log(`stopped animation of tick ${tickData.id}, last frame: ${lastFrame}`);
        }, finish: drawingInstancePromise.promise };
    }
    constructor() {

    }
}

class DISPLAYEDHUMAN_OLD {
    /** 
 * @param {Number} part
 * @param {Number} total
 * @param {Array<{x: Number, y: Number}>} [crossedPoints]
 * @param {Number} [tickId]
 */
    drawPos = (part, total, crossedPoints = this.crossedPoints, tickId = 0) => {
        // console.log(`part ${part}, total ${total},`, crossedPoints, `tickId: ${tickId}, humanId: ${this.id}`);
        if(crossedPoints.length == 1) {
            // console.log('crossedPoints.length == 1', crossedPoints[0], 0, tickId, this.id);
            this.draw(crossedPoints[0]);
        } else if(crossedPoints.length == total) {
            // console.log('crossedPoints.length == total', crossedPoints[part], 0, tickId, this.id);
            this.draw(crossedPoints[part]);
        } else {
            let percent = part / (total - 1);
            let closestPrevPoint = Math.floor(percent * (crossedPoints.length - 1));
            let closestNextPoint = Math.ceil(percent * (crossedPoints.length - 1));
            if(closestNextPoint == closestPrevPoint) {
                // console.log('else nofactor', crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], 0, tickId, this.id);
                this.draw(crossedPoints[closestPrevPoint]);
            } else {
                let factor = (percent * (crossedPoints.length - 1)) % 1;
                let beetwenPoint = this.getBetweenPoint(crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], factor);
                if(crossedPoints[closestPrevPoint].x !== crossedPoints[closestNextPoint].x && crossedPoints[closestPrevPoint].y !== crossedPoints[closestNextPoint].y) {
                    // console.log('else factor', beetwenPoint, crossedPoints[closestPrevPoint], crossedPoints[closestNextPoint], this.id, factor);
                    this.draw(beetwenPoint, true);
                } else {
                    this.draw(beetwenPoint);
                }
            }
        }
        }
    constructor() {

    }
}