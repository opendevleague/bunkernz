import { System, Component } from "../ECS";
import { Components } from "../ECS/System";
import { Transform } from "../components/Transform";

export class Physics extends System {

    protected start(components: Components) {
        console.log('started physics system, components: ', components);
    }

    protected stop(components: Components) {
        console.log('stopped physics system, components: ', components);
    }

    protected update(components: Components, dt: number) {
        console.log('on physics update')
    }
}