class OLDHUMAN {
    walkProgress = () => {
        return new Promise((res) => {
            let crossedPlots = this.walkTickRange * this.simulation.currentSpeed;
            if(this.pathToWalkOn.length <= crossedPlots) {
                this.currentTickVisitedPoints = JSON.parse(JSON.stringify(this.pathToWalkOn));
                this.pathToWalkOn = null;
                this.simulation.logWrite(`walk progress ${this.info.name} ${this.info.lastname}`, this.currentTickVisitedPoints);
                this.pos = this.currentTickVisitedPoints[this.currentTickVisitedPoints.length - 1];
                while(this.currentTickVisitedPoints.length < crossedPlots) {
                    this.currentTickVisitedPoints.push({x: this.pos.x, y: this.pos.y});
                }
                this.onWalkEnd();
                this.onWalkEnd = () => {};
            } else {
                this.currentTickVisitedPoints = this.pathToWalkOn.slice(0, crossedPlots);
                this.pathToWalkOn = this.pathToWalkOn.slice(crossedPlots);
                this.pos = this.currentTickVisitedPoints[this.currentTickVisitedPoints.length - 1];
                this.simulation.logWrite(`walk progress ${this.info.name} ${this.info.lastname}`, this.currentTickVisitedPoints);
                if(this.pathToWalkOn.length == 0) {
                    this.pathToWalkOn = null;
                    this.onWalkEnd();
                    this.onWalkEnd = () => {};
                }
            }
            res(true);
        });
    }
    /** 
     * @param {pos} from
     * @param {pos} to
     * @returns {Promise<Array<pos>>}
     */
    getPath = (from, to) => {
        return new Promise((res) => {
            this.simulation.findPaths(from, to).then((foundPaths) => {
                this.simulation.logWrite(`foundPaths ${this.info.name} ${this.info.lastname}`, foundPaths);
                if(foundPaths.paths.length > 0) {
                    let randomPath = foundPaths.paths[Utils.getRandomWithProbability(foundPaths.probability)];
                    if(randomPath.length > 0) {
                        res(randomPath.slice(1));
                    } else {
                        res([to]);
                    }
                } else {
                    res([to]);
                }
            });
        });
        }
    decideNext = () => {
        return new Promise(async (res) => {
            switch(this.action) {
                case "in home": {
                    let nextAction = Utils.getRandomWithProbability({'stay home': 100 - this.status.boredom, 'leave home': this.status.boredom});
                    if(nextAction == 'stay home') {
                        this.targetType = 'home';
                        this.target = this.homeId;
                        this.status.boredom += Math.floor((this.attributes.social + SimulationGlobals.boredomRatio) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed;
                        if(this.status.boredom > 99) {
                            this.status.boredom = 99;
                        }
                    } else {
                        this.simulation.plots[this.homeId].removeVisitor(this.id);
                        this.status.boredom = 1;
                        this.targetType = 'hospitality';
                        let targetHospitality = this.getPreferredHospitality();
                        this.target = targetHospitality.id;
                        this.walkingTo = targetHospitality.pos;
                        this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                        this.action = 'walking';
                        this.currentPlotId = null;
                        this.onWalkEnd = () => {
                            this.action = 'in hospitality';
                            this.simulation.plots[this.target + 0].addVisitor(this.id);
                            this.currentPlotId = this.target + 0;
                        }
                    }
                    res(true);
                    break;
                }
                case "in hospitality": {
                    let nextAction = Utils.getRandomWithProbability({'change': this.status.boredom, 'stay': 100 - this.status.boredom});
                    if(nextAction == 'change') {
                        this.simulation.plots[this.target + 0].removeVisitor(this.id);
                        const goHome = async () => {
                            this.targetType = 'home';
                            this.target = this.homeId;
                            this.status.boredom = 1;
                            this.walkingTo = this.home.pos;
                            this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                            this.action = 'walking';
                            this.currentPlotId = null;
                            this.onWalkEnd = () => {
                                this.action = 'in home';
                                this.simulation.plots[this.homeId].addVisitor(this.id);
                                this.currentPlotId = this.homeId + 0;
                            }
                            res(true);
                        }

                        let goHomeOrNew = Utils.getRandomWithProbability({'go home': 100 - this.attributes.social, 'change place': this.attributes.social});
                        if(goHomeOrNew == 'go home') {
                            goHome();
                        } else {
                            let targetHospitality = this.getPreferredHospitality([this.target + 0], true);
                            if(targetHospitality === null) {
                                goHome();
                            } else {
                                this.status.boredom = this.status.boredom - 50;
                                if(this.status.boredom < 1) {
                                    this.status.boredom = 1;
                                }
                                this.targetType = 'hospitality';
                                this.target = targetHospitality.id;
                                this.walkingTo = targetHospitality.pos;
                                this.pathToWalkOn = await this.getPath(this.pos, this.walkingTo);
                                this.action = 'walking';
                                this.currentPlotId = null;
                                this.onWalkEnd = () => {
                                    this.action = 'in hospitality';
                                    this.simulation.plots[this.target + 0].addVisitor(this.id);
                                    this.currentPlotId = this.target + 0;
                                }
                                res(true);
                            }
                        }
                    } else {
                        this.status.boredom += Math.floor(((100 + SimulationGlobals.boredomRatio) - this.attributes.social) / SimulationGlobals.boredomRatio) * this.simulation.currentSpeed;
                        res(true);
                    }
                    break;
                }
                case "walking": {
                    await this.walkProgress();
                    res(true);
                    break;
                }
            }
        });
        }
    constructor() {

    }
}