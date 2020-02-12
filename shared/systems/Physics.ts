import { System, Component } from "../ECS";
import { Components } from "../ECS/System";
import { Transform } from "../components/Transform";
import { Collider } from "../components/Collider";

export interface PhysicsComponents extends Components {
    transform: Transform,
    collider: Collider
}

export class Physics extends System<PhysicsComponents> {

    protected start(components: PhysicsComponents) {
        console.log('started physics system, components: ', components);
    }

    protected stop(components: PhysicsComponents) {
        console.log('stopped physics system');
    }

    protected update(components: PhysicsComponents, dt: number) {
        console.log('on physics update')
    }
}