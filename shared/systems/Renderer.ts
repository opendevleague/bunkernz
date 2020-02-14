import { System, Component, Entity } from "../ecs";
import { Components } from "../ecs/System";
import { Sprite } from "../components/Sprite";
import { Transform } from "../components/Transform";
import * as PIXI from "pixi.js";

export class Renderer extends System {
    public app?: PIXI.Application;

    protected start(entity: Entity) {
        console.log("started renderer system, components: ", entity);
        //this.app.stage.addChild()
    }

    protected stop(entity: Entity) {
        console.log("stopped renderer system");
    }
}
