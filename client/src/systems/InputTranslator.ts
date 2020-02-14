import { System, Component, Entity, Entities } from "../../../shared/ecs";
import Keyboard, { KeyEvent } from "../components/Keyboard";
import CharacterInput from "../../../shared/components/CharacterInput";
import { Vector2 } from "../../../shared/types/Vector2";
import NetworkedPlayer from "../../../shared/components/NetworkedPlayer";

/**
 * InputTranslators convert raw keyboard events to a higher level state object.
 */
export default abstract class InputTranslator extends System {

    private keyboard!: Keyboard;

    protected abstract get requiredInputs(): typeof Component[];

    protected get requiredComponents(): typeof Component[] {
        return Array.prototype.concat(
            Keyboard,
            this.requiredInputs
        );
    }

    protected getKey(keyCode: string): KeyEvent {
        return this.keyboard.keys.filter(x => x.code == keyCode)[0];
    }

    /**
     * Only allow entities with a local NetworkedPlayer component.
     */
    public registerEntity(entity: Entity, components: Component[]): void {
        if (this.entities[entity] != null)
            return;

        const networkedPlayer = components.find(x => x instanceof NetworkedPlayer) as NetworkedPlayer;

        if (!networkedPlayer.isLocal)
            return;

        super.registerEntity(entity, components);
    }

    protected start(entity: Entity) {
        if (this.keyboard != null)
            throw new Error(`Attempted to register multiple entities in an InputTranslator system (${this.constructor.name}).`);

        this.keyboard = this.getComponent(entity, Keyboard);
    }
}
