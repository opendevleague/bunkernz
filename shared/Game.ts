import Ecs, { Entity, Component, System } from "./ecs";
import { Physics } from "./systems/Physics";
import Collider from "./components/Collider";
import Transform from "./components/Transform";
import Sprite from "./components/Sprite";
import CharacterController from "./systems/CharacterController";

export class Game extends Ecs {

    private readonly minDt = 0.025;

    // True delta time of time it took to render the last frame.
    private processingDeltaTime = 0;
    // Delta time limited to minDt to save processor resources.
    protected deltaTime = 0;

    public constructor() {
        super();

        this.addSystem(new CharacterController());
    }

    public start(): void {
        this.loop();
    }

    public loop() {
        const lastTime = Date.now();
        super.loop(this.deltaTime);
        this.processingDeltaTime = (Date.now() - lastTime) / 1000;
        this.deltaTime = Math.max(this.processingDeltaTime, this.minDt);
        setTimeout(this.loop.bind(this), this.deltaTime * 1000);
    }
}
