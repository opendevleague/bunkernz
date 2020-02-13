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

    public async loop() {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const time: number = Date.now() / 1000;

            this.ecs.loop(this.deltaTime);

            this.deltaTime = Date.now() / 1000 - time;

            // Limit FPS to 60
            if (1 / this.deltaTime > 60)
                await new Promise(resolve =>
                    setTimeout(resolve, (1 / 60) * 1000),
                );
        }
    }
}
