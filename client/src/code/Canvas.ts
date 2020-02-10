import { Game } from "../../../shared/Game";
import { Renderer } from "../../../shared/systems/Renderer";
import { Transform } from "../../../shared/components/Transform";
import { Sprite } from "../../../shared/components/Sprite";
import { EventEmitter } from "events";

/**
 * Responsible for managing PIXI
 */
export class Canvas extends EventEmitter {

    private root: HTMLDivElement = document.getElementById("root") as HTMLDivElement;
    private canvas: HTMLCanvasElement = document.getElementById("view") as HTMLCanvasElement;
    private game: Game;
    public app: PIXI.Application;

    public constructor(game: Game) {
        super();

        this.app = new PIXI.Application({
            view: this.canvas,
            width: window.innerWidth,
            height: window.innerHeight,

            backgroundColor: 0x131313,
        });

        this.windowEvents();

        const text = new PIXI.Text("community game prototype!");
        text.style.fill = 0xf0f0f0;
        text.x = window.innerWidth / 2 - text.width / 2;
        text.y = window.innerHeight / 2 - text.height / 2;
        this.app.stage.addChild(text);

        this.game = game;
        this.addRendererSystem();
    }

    /**
     * Adds the renderer system to the game.
     */
    private addRendererSystem() {
        this.game.systems.push(new Renderer([
            new Transform(),
            new Sprite()
        ], this.game.components, this.app));
    }

    private windowEvents() {
        window.addEventListener("resize", () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }
}