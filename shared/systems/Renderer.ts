import { System, Component } from "../ecs";
import { Components } from "../ECS/System";

export class Renderer extends System {

    public app: PIXI.Application;

    public constructor(components: Component[], globalComponents: Component[], app: PIXI.Application) {
        super(components, globalComponents);
        this.app = app;
    }

    protected start(components: Components) {
        console.log('started renderer system, components: ', components);
        //this.app.stage.addChild()
    }

    protected stop(components: Components) {
        console.log('stopped renderer system');
    }

    protected update(components: Components, dt: number) {

    }
}