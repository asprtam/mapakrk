/** @typedef {import("../../index").SPRITE} SPRITE */
/** @typedef {import("./app").App} App */

class Sprite {
    /** @type {SPRITE} */
    #sprite = {size: {width: 1, height: 1}, data: [[false]]};
    /** @type {App} */
    #app;
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{x: Number, y: Number}} pos 
     * @param {Number} scalingFactor 
     * @param {Number} requiredFactor 
     * @param {SPRITE} sprite
     * @param {String} color
     */
    static draw = (ctx, pos, scalingFactor, requiredFactor, sprite, color) => {
        let _pos = pos;
        let pixel = scalingFactor/requiredFactor;
        ctx.fillStyle = color;
        sprite.data.forEach((column, column_id) => {
            column.forEach((filled, row_id) => {
                if(filled && (_pos.x) + (column_id * pixel) >= 0 && (_pos.y) + (row_id * pixel) >= 0) {
                    ctx.fillRect((_pos.x) + (column_id * pixel), (_pos.y) + (row_id * pixel), pixel, pixel);
                }
            });
        });
    }

    get width () {
        return this.#sprite.size.width;
    }

    get height () {
        return this.#sprite.size.height;
    }

    /**
     * @param {String} name 
     * @returns {Promise<Boolean>}
     */
    get = (name) => {
        return new Promise(async (res) => {
            const responseSprite = await fetch(`${this.#app.serverUrl}/sprite/${name}`);
            if(responseSprite.status == 200) {
                const jsonSprite = await responseSprite.json();
                if(jsonSprite.data) {
                    if(Array.isArray(jsonSprite.data)) {
                        if(jsonSprite.data.length > 0) {
                            if(Array.isArray(jsonSprite.data[0])) {
                                if(jsonSprite.data[0].length > 0) {
                                    this.#sprite = jsonSprite;
                                    res(true);
                                } else {
                                    res(false);
                                }
                            } else {
                                res(false);
                            }
                        } else {
                            res(false);
                        }
                    } else {
                        res(false);
                    }
                } else {
                    res(false);
                }
            } else {
                res(false);
            }
        });
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x: Number, y: Number}} pos
     * @param {Number} scalingFactor
     * @param {Number} requiredFactor
     * @param {String} color
     */
    draw = (ctx, pos, scalingFactor, requiredFactor, color) => {
        Sprite.draw(ctx, pos, scalingFactor, requiredFactor, this.#sprite, color);
    }

    /**
     * @param {App} app 
     */
    constructor(app) {
        this.#app = app;
    }
}

export {Sprite};