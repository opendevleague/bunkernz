import { System, Component, Entity } from "../../../shared/ecs";
import ActionMap, { KeyEvent } from "../components/Keyboard";
import Keyboard from "../components/Keyboard";

export default class Input extends System {

    private listeners: Record<string, Array<() => void>> = {};

    protected get requiredComponents(): typeof Component[] {
        return [
            Keyboard,
        ];
    }

    public start(entity: Entity) {
        const keyboard = this.getComponent(entity, Keyboard);

        document.addEventListener("keydown", e => {
            const event = e as KeyEvent;
            event.isDown = true;
            keyboard.keys.push(event);
        })

        document.addEventListener("keyup", e => {
            const event = e as KeyEvent;
            event.isDown = false;
            keyboard.keys.push(event);
        });
    }

    public update(entity: Entity): void {
        const keyboard = this.getComponent(entity, Keyboard);
        // Clear array.
        keyboard.keys = [];
    }
}
