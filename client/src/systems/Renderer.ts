import { System, Component, Entity } from "../../../shared/ecs";
import * as PIXI from "pixi.js";
import Sprite from "../components/Sprite";
import Position from "../../../shared/components/Position";
import Texture from "../components/Texture";
import Engine from "../../../shared/Engine";

const tileSize = 37;

interface Renderable {
    entity: Entity;
    position: Position;
    node: PIXI.Sprite;
}

export default class Renderer extends System {
    private pixiApp: PIXI.Application;
    private renderers: Renderable[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super();

        this.pixiApp = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x131313,
        });

        const text = new PIXI.Text("community game prototype!");
        text.style.fill = 0xf0f0f0;
        text.x = window.innerWidth / 2 - text.width / 2;
        text.y = window.innerHeight / 2 - text.height / 2;
        this.pixiApp.stage.addChild(text);
    }

    public update(engine: Engine): void {
        engine.createdComponents().forEach(component => {
            if (component instanceof Sprite) {
                const entity = component.entity;
                const position = entity?.getComponent(Position);
                const texture = entity?.getComponent(Texture);

                if (entity && position && texture) {
                    const sprite = new PIXI.Sprite(
                        PIXI.Texture.from(texture.src),
                    );
                    sprite.position.set(
                        position.x * tileSize,
                        position.y * tileSize,
                    );
                    this.pixiApp.stage.addChild(sprite);

                    this.renderers.push({ entity, position, node: sprite });
                } else {
                    console.warn("Renderer: Invalid components");
                }
            }
        });

        engine.disposedComponents().forEach(component => {
            if (component instanceof Sprite) {
                const index = this.renderers.findIndex(
                    r => r.entity === component.entity,
                );
                const renderer = this.renderers[index];

                renderer.node.destroy();

                this.renderers.splice(index, 1);
            }
        });

        this.renderers.forEach(renderer => {
            renderer.node.position.set(
                renderer.position.x * tileSize,
                renderer.position.y * tileSize,
            );
        });
    }
}
