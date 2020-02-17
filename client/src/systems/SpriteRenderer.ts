import { System, Component, Entity } from "../../../shared/ecs";
import * as Pixi from "pixi.js";
import Sprite from "../components/Sprite";
import Transform from "../../../shared/components/Transform";
import Vector2 from "../../../shared/types/Vector2";
import { Grid } from "../../../shared/components/Grid";
import { ViewportGrid } from "../components/ViewportGrid";

/**
 * TODO: Account for camera position.
 */
export default class SpriteRenderer extends System {

    private readonly baseSpriteSize = 20;
    private viewport: ViewportGrid;
    private pixi: Pixi.Application;

    protected get requiredComponents(): typeof Component[] {
        return [
            Sprite,
            Transform
        ];
    }

    constructor(pixi: Pixi.Application, viewport: ViewportGrid) {
        super();

        this.pixi = pixi;
        this.viewport = viewport;
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

        const scaleFactor = (this.viewport.tileSize ?? Grid.baseTileSize) * (this.baseSpriteSize / 1000) / Grid.baseTileSize;
        // World position is the offset of the current position and the viewport position...
        const worldPosition = Vector2.subtract(transform.position, this.viewport.position);
        // ... scaled to the current tile size...
        worldPosition.scale(scaleFactor);
        // ... positioned at the current viewport offset (screen centre).
        worldPosition.add(Vector2.scale(this.viewport.targetOffset, this.viewport.tileSize));

        sprite.element.scale.set(scaleFactor);
        sprite.element.position.set(worldPosition.x, worldPosition.y);
    }
}
