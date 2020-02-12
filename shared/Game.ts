import { Entity, Component, System } from "./ECS";
import { Physics } from "./systems/Physics";
import { Collider } from "./components/Collider";
import { Transform } from "./components/Transform";
import { Renderer } from "./systems/Renderer";
import { Sprite } from "./components/Sprite";

type GameSystems = {
    physics: Physics,
    renderer: Renderer
}

export class Game {

    public readonly systems: GameSystems = {} as GameSystems;
    public readonly components: Component[] = [];

    private deltaTime: number = 0;

    //public getSystem<TSystem extends System>(): System | undefined {
    //    return this.systems.find(x => typeof x == TSystem);
    //}

    public constructor() {
        this.systems.physics = new Physics({
            collider: new Collider(),
            transform: new Transform()
        }, this.components)
    }

    public addPlayer(spriteSource: string): number {
        const player: number = Entity.create([
            new Collider(),
            new Transform(),
            <Sprite>{ source: spriteSource }
        ], this.components);

        this.systems.physics?.addEntity(player);
        this.systems.renderer?.addEntity(player);
        return player;
    }

    public async loop() {
        while (true) {
            const time: number = Date.now() / 1000;

            Object.keys(this.systems).forEach(key => {
                const system = this.systems[key as keyof GameSystems];
                system.loop(time)
            });

            this.deltaTime = (Date.now() / 1000) - time;

            // Limit FPS to 60
            if (1 / this.deltaTime > 60)
                await new Promise(resolve => setTimeout(resolve, (1 / 60) * 1000))
        }
    }
}