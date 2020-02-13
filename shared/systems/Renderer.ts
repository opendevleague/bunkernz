import { System, Component } from "../ecs";
import { Components } from "../ecs/System";
import { Sprite } from "../components/Sprite";
import { Transform } from "../components/Transform";

export class Renderer extends System {
    public app: PIXI.Application;

    public constructor(components: Components, app: PIXI.Application) {
        super(components);
        this.app = app;
    }

    protected start(components: Components) {
        console.log("started renderer system, components: ", components);
        //this.app.stage.addChild()
    }

    protected stop(components: Components) {
        console.log("stopped renderer system");
    }
}
