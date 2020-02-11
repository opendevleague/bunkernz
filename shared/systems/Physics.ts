import { System } from "../ecs";

export class Physics extends System {
    public update(): void {
        console.log("on physics update");
    }
}
