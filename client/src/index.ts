import buildConfig from "../../build/config";
import "../style/index.scss";
import bunny from "../assets/img/bunny.png";
import Sprite from "./components/Sprite";
import NetworkClient from "./systems/NetworkClient";
import NetworkedPlayer from "../../shared/components/NetworkedPlayer";
import { Game } from "../../shared/Game";
import Transform from "../../shared/components/Transform";
import Input from "./systems/Input";
import Keyboard from "./components/Keyboard";
import CharacterInput from "../../shared/components/CharacterInput";
import CharacterTranslator from "./systems/input translators/CharacterTranslator";
import { Grid } from "../../shared/components/Grid";
import SpriteRenderer from "./systems/SpriteRenderer";
import GridRenderer from "./systems/LevelRenderer";
import * as Pixi from "pixi.js";
import { ViewportGrid } from "./components/ViewportGrid";

export class Client extends Game {

    private canvas!: HTMLCanvasElement;
    private pixi!: Pixi.Application;
    private debugFps!: Pixi.Text;

    public static createDebugText(row: number, pixi: Pixi.Application): Pixi.Text {
        const text = new Pixi.Text("");
        text.scale.set(0.75);
        text.style.fill = 0xf0f0f0;
        text.x = 10;
        text.y = 5 + ((row - 1) * 25);
        pixi.stage.addChild(text);
        return text;
    }

    public constructor() {
        super();

        // Initialise DOM and Pixi.
        this.initialiseCanvas();
        this.initialisePixi();

        // Create entities.
        const localPlayer = this.createEntity([
            new NetworkedPlayer(true),
            new Transform(),
            new Keyboard(),
            new CharacterInput(),
            new Sprite(bunny)
        ]);
        const viewport = this.createEntity([
            new Grid(50, 50),
            new ViewportGrid(16, 10, this.getComponent(localPlayer, Transform)),
        ]);

        // Add systems.
        this.addSystem(new GridRenderer(this.pixi));
        this.addSystem(new SpriteRenderer(this.pixi, this.getComponent(viewport, ViewportGrid)));
        this.addSystem(new NetworkClient(buildConfig.client.server, this));
        this.addSystem(new CharacterTranslator());
        // The input system needs to be the last registered as it clears the Keyboard component on every frame.
        this.addSystem(new Input());

        this.start();
    }

    private initialiseCanvas() {
        this.canvas = document.getElementById("view") as HTMLCanvasElement;
        this.canvas.oncontextmenu = event => {
            event.preventDefault();
            event.stopPropagation();
        };
    }

    private initialisePixi() {
        this.pixi = new Pixi.Application({
            view: this.canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x131313,
        });

        this.debugFps = Client.createDebugText(1, this.pixi);
    }

    private updateDebug() {
        this.debugFps.text = `FPS ${(1 / this.deltaTime).toFixed(0)}`;
    }

    public loop() {
        super.loop();
        this.updateDebug();
    }
}

const client = new Client();