import { System, Component, Entity } from "../ecs";
import { Components } from "../ecs/System";
import { Transform } from "../components/Transform";
import { Collider } from "../components/Collider";

export class Physics extends System {
    protected start(entity: Entity): void {
        console.log("started physics system, components: ", entity);
    }

    protected stop(entity: Entity): void {
        console.log("stopped physics system");
    }

    protected update(entity: Entity, dt: number): void {
        console.log("on physics update");
    }
}
