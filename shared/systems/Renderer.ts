import { System, Component } from "../ecs";
import { Components } from "../ECS/System";
import { Sprite } from "../components/Sprite";
import { Transform } from "../components/Transform";

export interface RendererComponents extends Components {
    sprite: Sprite,
    transform: Transform
}

export class Renderer extends System<RendererComponents> {

    public app: PIXI.Application;

    public constructor(components: RendererComponents, globalComponents: Component[], app: PIXI.Application) {
        super(components, globalComponents);
        this.app = app;
    }

    protected start(components: RendererComponents) {
        console.log('started renderer system, components: ', components);
        //this.app.stage.addChild()
    }

    protected stop(components: RendererComponents) {
        console.log('stopped renderer system');
    }

    protected update(components: RendererComponents, dt: number) {

    }
}