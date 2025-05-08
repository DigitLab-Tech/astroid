import Drawable from "../interface/Drawable";

export default class Scene {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        const canvas = document.querySelector<HTMLCanvasElement>('canvas#scene');
        if (!canvas) {
            throw new Error("Missing canvas with id scene");
        }
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Canvas 2d context is null");
        }
        this.ctx = ctx;

        this.init
    }

    private init() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    reset() {
        this.ctx.reset();
        this.init();
    }

    sizes() {
        return {
            w: this.canvas.width,
            h: this.canvas.height
        }
    }

    draw(entities: Drawable | Drawable[]) {
        if (!Array.isArray(entities)) {
            entities = [entities];
        }

        this.reset();

        for (const entity of entities) {
            entity.draw(this.ctx);
        }
    }
}