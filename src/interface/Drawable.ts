export default interface Drawable {
    draw: (ctx: CanvasRenderingContext2D) => void;
    updateSpeed: () => void;
    updatePosition: () => void;
}