import { System, Component, Entity } from "../../../shared/ecs";
import * as Pixi from "pixi.js";
import Sprite from "../components/Sprite";
import Transform from "../../../shared/components/Transform";
import Vector2 from "../../../shared/types/Vector2";

/**
 * TODO: Account for camera position.
 */
export default class SpriteRenderer extends System {

    private pixi: Pixi.Application;

    protected get requiredComponents(): typeof Component[] {
        return [
            Sprite,
            Transform
        ];
    }

    constructor(pixi: Pixi.Application) {
        super();

        this.pixi = pixi;
    }

    public start(entity: Entity): void {
        const sprite = this.getComponent(entity, Sprite);

        sprite.element = new Pixi.Sprite(Pixi.Texture.from(sprite.source));
        this.pixi.stage.addChild(sprite.element);
    }

    public stop(entity: Entity): void {
        const sprite = this.getComponent(entity, Sprite);

        this.pixi.stage.removeChild(sprite.element);
        sprite.element.destroy();
    }

    public update(entity: Entity): void {
        const sprite = this.getComponent(entity, Sprite);
        const transform = this.getComponent(entity, Transform);

        // TODO: Account for grid size/aspect ratio/camera offset.
        sprite.element.position.set(transform.position.x, transform.position.y);
    }
}
