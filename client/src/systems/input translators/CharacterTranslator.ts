import { System, Component, Entity } from "../../../../shared/ecs";
import ActionMap, { KeyEvent } from "../../components/Keyboard";
import Keyboard from "../../components/Keyboard";
import CharacterInput from "../../../../shared/components/CharacterInput";
import Vector2 from "../../../../shared/types/Vector2";
import InputTranslator from "../InputTranslator";

/**
 * InputTranslators convert raw keyboard events to a higher level state object.
 */
export default class CharacterTranslator extends InputTranslator {

    protected get requiredInputs(): typeof Component[] {
        return [
            CharacterInput
        ];
    }

    public update(entity: Entity): void {
        const input = this.getComponent(entity, CharacterInput);

        const moveUp = this.getKey("KeyW")?.isHeld;
        const moveDown = this.getKey("KeyS")?.isHeld;
        const moveLeft = this.getKey("KeyA")?.isHeld;
        const moveRight = this.getKey("KeyD")?.isHeld;

        input.moveVector = Vector2.zero;

        if (moveUp) {
            input.moveVector.y = -1;
        } else if (moveDown) {
            input.moveVector.y = 1;
        }

        if (moveRight) {
            input.moveVector.x = 1;
        } else if (moveLeft) {
            input.moveVector.x = -1;
        }
    }
}
