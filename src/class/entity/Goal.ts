import Drawable from "../../interface/Drawable";
import Motionable from "../../interface/Motionable";
import Scene from "../Scene";
import AbstractEntity, { AbstractEntityParams } from "./AbstactEntity";

export default class Goal extends AbstractEntity implements Drawable, Motionable {
    constructor(scene: Scene, params: AbstractEntityParams) {
        super(scene, params);
    }

    initPath() {
        const halfHeight = this.height / 2;

        this.path.moveTo(0, -halfHeight);
        this.path.rect(0, -halfHeight, this.width, this.height)

        return this;
    }



    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.translate(this.x, this.y);
        ctx.fill(this.path);

        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    addVelocity() {
        this.velocityX.value = Math.cos(this.angle - 1.5708) * (this.velocityX.max || 0);
        this.velocityY.value = Math.sin(this.angle - 1.5708) * (this.velocityY.max || 0);
    }
} 