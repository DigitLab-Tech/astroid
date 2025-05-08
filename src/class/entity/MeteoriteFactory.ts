import random from "../../utils/random";
import Scene from "../Scene";
import { AbstractEntityParams } from "./AbstactEntity";
import Meteorite from "./Meteorite";

const MeteoriteFactory = {
    create(params: AbstractEntityParams) {
        return new Meteorite(params);
    },

    createRandom({ scene, minSize, maxSize }: { scene: Scene, minSize: number, maxSize: number }) {
        const size = random(minSize, maxSize);

        return new Meteorite({
            scene,
            width: size,
            height: size,
        })
    }
} as const

export default MeteoriteFactory;