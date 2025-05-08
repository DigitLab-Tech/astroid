import Drawable from "../../interface/Drawable";
import Scene from "../Scene";
import AbstractEntity, { AbstractEntityParams } from "./AbstactEntity";

export default class Meteorite extends AbstractEntity implements Drawable {
    constructor(scene: Scene, params?: AbstractEntityParams) {
        super(scene, params || {});
    }

    initPath() {
        this.path.arc(0, 0, this.width + 1, 0, Math.PI * 2, true);
        return this;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.fill(this.path);

        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}