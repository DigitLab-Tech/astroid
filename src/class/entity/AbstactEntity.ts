import random from "../../utils/random";
import LimitedNumber from "../LimitedNumber";
import Scene from "../Scene";

export type AbstractEntityParams = {
    width?: number;
    height?: number;
    size?: number | undefined;
    x?: number;
    y?: number;
    speedX?: LimitedNumber;
    speedY?: LimitedNumber;
    velocityX?: LimitedNumber;
    velocityY?: LimitedNumber;
    angle?: number;
    color?: string;
}

export default abstract class AbstractEntity {
    protected scene: Scene;
    protected _width: number;
    protected _height: number;
    protected _x: number;
    protected _y: number;
    protected _speedX: LimitedNumber;
    protected _speedY: LimitedNumber;
    protected velocityX: LimitedNumber;
    protected velocityY: LimitedNumber;
    protected angle: number;
    protected color: string;
    protected path: Path2D;

    constructor(scene: Scene, {
        width = 0,
        height = 0,
        size,
        x = 0,
        y = 0,
        speedX = new LimitedNumber({ min: -50, max: 50 }),
        speedY = new LimitedNumber({ min: -50, max: 50 }),
        velocityX = new LimitedNumber({ min: -8, max: 8 }),
        velocityY = new LimitedNumber({ min: -8, max: 8 }),
        angle = 0,
        color = "#5eff00",
    }: AbstractEntityParams) {
        this.scene = scene;
        this._width = size || width;
        this._height = size || height;
        this._x = x;
        this._y = y;
        this._speedX = speedX;
        this._speedY = speedY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.angle = angle;
        this.color = color;
        this.path = new Path2D();
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get x() {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get speedX() {
        return this._speedX;
    }

    get speedY() {
        return this._speedY;
    }

    abstract initPath(): this

    isOutOfBound(): { count: number, data: Partial<{ top: true, right: true, bottom: true, left: true }> } {
        const values = {
            top: this.y < -this.height || undefined,
            right: this.x > this.scene.width || undefined,
            bottom: this.y > this.scene.height || undefined,
            left: this.x < -this.width || undefined
        }
        return {
            count: Object.keys(values).length,
            data: values
        }
    }

    updatePosition() {
        const nextX = this.x + this.speedX.value / 10;
        const nextY = this.y + this.speedY.value / 10;
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        if (nextX > this.scene.width - halfWidth) {
            this.speedX.value = -this.speedX.value / 2;
        } else if (nextX < halfWidth) {
            this.speedX.value = Math.abs(this.speedX.value) / 2;
        }

        if (nextY > this.scene.height - halfHeight) {
            this.speedY.value = -this.speedY.value / 2;
        } else if (nextY < halfHeight) {
            this.speedY.value = Math.abs(this.speedY.value) / 2;
        }

        this._x += this._speedX.value / 10;
        this._y += this._speedY.value / 10;

        return this;
    }

    updateSpeed() {
        this._speedX.value += this.velocityX.value / 10;
        this.velocityX.value = 0;

        this._speedY.value += this.velocityY.value / 10;
        this.velocityY.value = 0;

        return this;
    }

    getRandomInsideX() {
        return random(0 + this.width, this.scene.width - this.width);
    }

    getRandomInsideY() {
        return random(0 + this.height, this.scene.height - this.height)
    }

    randomiseSize({ minWidth = 0, minHeight = 0, maxWidth, maxHeight }:
        { minWidth: number, minHeight: number, maxWidth: number, maxHeight: number }
    ) {
        this._width = random(minWidth, maxWidth);
        this._height = random(minHeight, maxHeight);

        return this;
    }

    randomisePosition() {
        this._x = this.getRandomInsideX();
        this._y = this.getRandomInsideY();

        return this;
    }

    randomiseOutOfBoundPosition() {
        if (random(0, 1)) {
            this._x = this.getRandomInsideX();
            this._y = random(0, 1) ? 0 - this.scene.height : this.scene.height + this.scene.height;
        }
        else {
            this._x = random(0, 1) ? 0 - this.scene.width : this.scene.width + this.scene.width;
            this._y = this.getRandomInsideY();
        }

        return this;
    }

    randomiseDirection() {
        const x = this.scene.width / 2 //this.getRandomInsideX();
        const y = this.scene.height / 2 //this.getRandomInsideY();
        const xDistance = Math.abs(this.x - x);
        const yDistance = Math.abs(this.y - y);
        const totalDistance = xDistance + yDistance
        const xRatio = ((xDistance * 100) / totalDistance) / 100;
        const yRatio = ((yDistance * 100) / totalDistance) / 100;
        const speedX = xRatio * this._speedX.max;
        const speedY = yRatio * this._speedY.max;

        this._speedX.value = x > this.x ? speedX : -speedX;
        this._speedY.value = y > this.y ? speedY : -speedY;

        return this;
    }

    getCorners(): [number, number][] {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        return [
            [this.x - halfWidth, this.y - halfHeight],
            [this.x + halfWidth, this.y - halfHeight],
            [this.x + halfWidth, this.y + halfHeight],
            [this.x - halfWidth, this.y + halfHeight],
        ].map(vector => {
            const cos = Math.cos(this.angle);
            const sin = Math.sin(this.angle);
            const dx = vector[0] - this.x;
            const dy = vector[1] - this.y;

            return [
                this.x + dx * cos - dy * sin,
                this.y + dx * sin + dy * cos,
            ];
        });
    }


    colide(entity: AbstractEntity) {
        let dx = entity.x - this.x;
        let dy = entity.y - this.y;
        let dist = Math.hypot(dx, dy);

        if (dist === 0) {
            return;
        }

        let nx = dx / dist;
        let ny = dy / dist;
        let dvx = this.speedX.value - entity.speedX.value;
        let dvy = this.speedY.value - entity.speedY.value;
        let impactSpeed = dvx * nx + dvy * ny;

        if (impactSpeed > 0) {
            const impulse = 2 * impactSpeed / 2;
            this.speedX.value -= impulse * nx;
            this.speedY.value -= impulse * ny;
            entity.speedX.value += impulse * nx;
            entity.speedY.value += impulse * ny;
            return;
        }
    }

    increaseAngle() {
        this.angle += 0.05;
    }

    decreaseAngle() {
        this.angle -= 0.05;
    }
}