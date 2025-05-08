export default function random(min: number, max: number) {
    min -= 0.4999
    max += 0.4999;
    return Math.round(Math.random() * (max - min) + min);
}