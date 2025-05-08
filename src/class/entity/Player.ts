import Drawable from "../../interface/Drawable";
import Motionable from "../../interface/Motionable";
import Scene from "../Scene";
import AbstractEntity, { AbstractEntityParams } from "./AbstactEntity";

export default class Player extends AbstractEntity implements Drawable, Motionable {
    constructor(scene: Scene, params: AbstractEntityParams) {
        super(scene, params);
    }

    initPath() {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        this.path.moveTo(0, -halfHeight);
        this.path.quadraticCurveTo(10, -2, halfWidth, halfHeight);
        this.path.quadraticCurveTo(0, 0, -halfWidth, halfHeight);
        this.path.quadraticCurveTo(-10, -2, 0, -halfHeight);

        return this;
    }



    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fill(this.path);

        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    addVelocity() {
        this.velocityX.value = Math.cos(this.angle - 1.5708) * (this.velocityX.max || 0);
        this.velocityY.value = Math.sin(this.angle - 1.5708) * (this.velocityY.max || 0);
    }
} 