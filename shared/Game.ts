import Ecs, { Entity, Component, System } from "./ecs";
import { Physics } from "./systems/Physics";
import { Collider } from "./components/Collider";
import { Transform } from "./components/Transform";
import { Sprite } from "./components/Sprite";

export class Game extends Ecs {

    private deltaTime = 0;

    public start(): void {
        let lastTime = performance.now(),
            currentTime;

        setInterval(
            () => {
                currentTime = performance.now();
                this.deltaTime = (currentTime - lastTime) / 1000;

                this.loop(this.deltaTime);

                lastTime = currentTime;
            },
            1000 / 60, // 60Hz
        );
    }
}
