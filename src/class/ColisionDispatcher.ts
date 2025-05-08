import throttle from "../utils/throttle";
import AbstractEntity from "./entity/AbstactEntity";

type Vector = [number, number];

const registrations: [[AbstractEntity, AbstractEntity], () => void][] = [];

const ColisionDispatcher = {
    subscribe(entities: [AbstractEntity, AbstractEntity], callback: () => void) {
        registrations.push([entities, callback])
    },

    dispatchColision() {
        for (const [[entityA, entityB], callback] of registrations) {
            const cornersA = entityA.getCorners();
            const cornersB = entityB.getCorners();
            const axes = [...this.getAxes(cornersA), ...this.getAxes(cornersB)];
            let overlaping = true;

            for (const axis of axes) {
                const projA = this.project(cornersA, axis);
                const projB = this.project(cornersB, axis);

                if (!this.overlap(projA, projB)) {
                    overlaping = false;
                }
            }

            if (overlaping) {
                throttle(() => {
                    callback();
                });
            }
        }
    },

    elasticRebound(entityA: AbstractEntity, entityB: AbstractEntity) {
        let dx = entityB.x - entityA.x;
        let dy = entityB.y - entityA.y;
        let dist = Math.hypot(dx, dy);

        if (dist === 0) {
            return;
        }

        let nx = dx / dist;
        let ny = dy / dist;
        let dvx = entityA.speedX.value - entityB.speedX.value;
        let dvy = entityA.speedY.value - entityB.speedY.value;
        let impactSpeed = dvx * nx + dvy * ny;

        if (impactSpeed < 0) {
            return
        }

        const impulse = 2 * impactSpeed / 2;
        entityA.speedX.value -= impulse * nx;
        entityA.speedY.value -= impulse * ny;
        entityB.speedX.value += impulse * nx;
        entityB.speedY.value += impulse * ny;
    },

    project(polygon: Vector[], axis: Vector) {
        const normalize = (v: Vector) => {
            const len = Math.hypot(v[0], v[1]);
            return [v[1] / len, v[0] / len];
        };

        const norm = normalize(axis);
        const dots = polygon.map(p => p[0] * norm[0] + p[1] * norm[1]);

        return { min: Math.min(...dots), max: Math.max(...dots) };
    },

    getAxes(points: Vector[]): Vector[] {
        const axes: Vector[] = [];

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const edge = [p2[0] - p1[0], p2[1] - p1[1]];
            axes.push([-edge[1], edge[0]]);
        }

        return axes;
    },

    overlap(a: { min: number; max: number }, b: { min: number; max: number }): boolean {
        return !(a.max < b.min || b.max < a.min);
    }
}

export default ColisionDispatcher;