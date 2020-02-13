import { System, Component } from "../ecs";
import { Components } from "../ecs/System";
import { Transform } from "../components/Transform";
import { Collider } from "../components/Collider";

export class Physics extends System {
    protected start(components: Components): void {
        console.log("started physics system, components: ", components);
    }

    protected stop(components: Components): void {
        console.log("stopped physics system");
    }

    protected update(components: Components, dt: number): void {
        console.log("on physics update");
    }
}
