import Ecs, { Entity, Component, System } from "./ecs";
import { Physics } from "./systems/Physics";
import { Collider } from "./components/Collider";
import { Transform } from "./components/Transform";
import { Renderer } from "./systems/Renderer";
import { Sprite } from "./components/Sprite";

type GameSystems = {
    physics: Physics;
    renderer: Renderer;
};

export class Game {
    private ecs: Ecs;
    private deltaTime = 0;

    //public getSystem<TSystem extends System>(): System | undefined {
    //    return this.systems.find(x => typeof x == TSystem);
    //}

    public constructor() {
        this.ecs = new Ecs();

        this.ecs.addSystem(
            new Physics({
                collider: new Collider(),
                transform: new Transform(),
            }),
        );

        this.ecs.createEntity([
            new Collider(),
            new Transform(),
            new Sprite("./some/path"),
        ]);

        console.log("Game started");
    }

    public start(): void {
        let lastTime = performance.now(),
            currentTime;

        setInterval(
            () => {
                currentTime = performance.now();
                this.deltaTime = (currentTime - lastTime) / 1000;

                this.ecs.loop(this.deltaTime);

                lastTime = currentTime;
            },
            1000 / 60, // 60Hz
        );
    }
}
