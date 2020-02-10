import { System, Component } from "../ECS";

export class Physics extends System {

    protected start(components: Component[]) {
        console.log('started physics system, components: ', components);
    }

    protected stop(components: Component[]) {
        console.log('stopped physics system');
    }

    protected update(components: Component[], dt: number) {
        console.log('on physics update')
    }
}