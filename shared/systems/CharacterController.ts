import { System, Component, Entity } from "../../shared/ecs";
import CharacterInput from "../components/CharacterInput";
import { Transform } from "../components/Transform";
import { Vector2 } from "../types/Vector2";

export default class ChracterController extends System {

    protected get requiredComponents(): typeof Component[] {
        return [
            Transform,
            CharacterInput,
        ];
    }

    public update(entity: Entity): void {
        const input = this.getComponent(entity, CharacterInput);
        const transform = this.getComponent(entity, Transform);

        // Move charatcer.
        transform.position.x += input.moveVector.x;
        transform.position.y += input.moveVector.y;

        // Override character position.
        if (!Vector2.equals(input.movePosition, Vector2.zero)) {
            transform.position.x = input.movePosition.x;
            transform.position.y = input.movePosition.y;
        }
    }
}
