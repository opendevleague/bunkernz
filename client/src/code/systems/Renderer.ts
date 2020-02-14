import * as Pixi from "pixi.js";
import { System, Entity } from "../../../../shared/ecs";
import Sprite from "../components/Sprite";
import { Transform } from "../../../../shared/components/Transform";

export default class Renderer extends System {
    private pixiApp: Pixi.Application;

    protected requiredComponents = [Sprite, Transform];

    constructor(canvas: HTMLCanvasElement) {
        super();

        this.pixiApp = new Pixi.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x131313,
        });

        const text = new Pixi.Text("community game prototype!");
        text.style.fill = 0xf0f0f0;
        text.x = window.innerWidth / 2 - text.width / 2;
        text.y = window.innerHeight / 2 - text.height / 2;
        this.pixiApp.stage.addChild(text);
    }

    public start(entity: Entity) {
        const transform = this.getComponent(entity, Transform);
        const sprite = this.getComponent(entity, Sprite);

        sprite.element = new Pixi.Sprite(Pixi.Texture.from(sprite.source));
        this.pixiApp.stage.addChild(sprite.element);
    }

    public update(entity: Entity): void {
        const transform = this.getComponent(entity, Transform);
        const sprite = this.getComponent(entity, Sprite);

        sprite.element.position.set(transform.position.x, transform.position.y);
    }
}
