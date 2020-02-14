import { System, Component, Entity } from "../../shared/ecs";
import CharacterInput from "../components/CharacterInput";
import Transform from "../components/Transform";
import Vector2 from "../types/Vector2";

export default class CharacterController extends System {

    private readonly speed = 200;

    protected get requiredComponents(): typeof Component[] {
        return [
            Transform,
            CharacterInput,
        ];
    }

    public update(entity: Entity, dt: number): void {
        const input = this.getComponent(entity, CharacterInput);
        const transform = this.getComponent(entity, Transform);

        // Override character position.
        if (input.movePosition != null) {
            transform.position.x = input.movePosition.x;
            transform.position.y = input.movePosition.y;
            input.movePosition = null;
        }

        // Normalize & scale input.
        input.moveVector.normalize();
        input.moveVector.scale(this.speed * dt);
        // Move charatcer.
        transform.position.x += input.moveVector.x;
        transform.position.y += input.moveVector.y;
    }
}
