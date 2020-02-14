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
            let key = keyboard.keys.find(key => key.code == e.code);

            if (key == null) {
                key = e as KeyEvent;
                keyboard.keys.push(key);
            }

            key.isDown = true;
            key.isHeld = true;
        })

        document.addEventListener("keyup", e => {
            let key = keyboard.keys.find(key => key.code == e.code);

            if (key == null) {
                key = e as KeyEvent;
                keyboard.keys.push(key);
            }

            key.isUp = true;
            key.isHeld = false;
        });
    }

    public update(entity: Entity): void {
        const keyboard = this.getComponent(entity, Keyboard);
        keyboard.keys.forEach(key => {
            key.isUp = false;
            key.isDown = false;
        });
    }
}
