import { System, Component, Entity } from "../../../shared/ecs";
import * as Pixi from "pixi.js";
import Sprite from "../components/Sprite";
import { Transform } from "../../../shared/components/Transform";
import { Vector2 } from "../../../shared/types/Vector2";

const tileSize = 37;

export default class Renderer extends System {

    private pixi: Pixi.Application;

    protected get requiredComponents(): typeof Component[] {
        return [
            Sprite,
            Transform
        ];
    }

    constructor(canvas: HTMLCanvasElement) {
        super();

        this.pixi = new Pixi.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x131313,
        });

        const text = new Pixi.Text("community game prototype!");
        text.style.fill = 0xf0f0f0;
        text.x = window.innerWidth / 2 - text.width / 2;
        text.y = window.innerHeight / 2 - text.height / 2;
        this.pixi.stage.addChild(text);
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

        const tilePosition = Vector2.scale(transform.position, tileSize);
        sprite.element.position.set(tilePosition.x, tilePosition.y);
    }
}
