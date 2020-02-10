import { System, Component } from "../ecs";

export class Renderer extends System {

    public app: PIXI.Application;

    public constructor(components: Component[], globalComponents: Component[], app: PIXI.Application) {
        super(components, globalComponents);
        this.app = app;
    }

    protected start(components: Component[]) {
        console.log('started renderer system, components: ', components);
        //this.app.stage.addChild()
    }

    protected stop(components: Component[]) {
        console.log('stopped renderer system');
    }

    protected update(components: Component[], dt: number) {

    }
}