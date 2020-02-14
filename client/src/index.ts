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
import GridRenderer from "./systems/GridRenderer";
import * as Pixi from "pixi.js";

class Client extends Game {

    private canvas!: HTMLCanvasElement;
    private pixi!: Pixi.Application;
    private debugFps!: Pixi.Text;

    public constructor() {
        super();

        // Initialise DOM and Pixi.
        this.initialiseCanvas();
        this.initialisePixi();

        // Add systems.
        this.addSystem(new SpriteRenderer(this.pixi));
        this.addSystem(new GridRenderer(this.pixi));
        this.addSystem(new NetworkClient(buildConfig.client.server, this));
        this.addSystem(new CharacterTranslator());
        // The input system needs to be the last registered as it clears the Keyboard component on every frame.
        this.addSystem(new Input());

        // Create entities.
        const grid = this.createEntity([
            new Grid(40, 25)
        ]);
        const localPlayer = this.createEntity([
            new NetworkedPlayer(true),
            new Transform(),
            new Keyboard(),
            new CharacterInput(),
            new Sprite(bunny)
        ]);

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

        this.debugFps = new Pixi.Text("");
        this.debugFps.scale.set(0.75);
        this.debugFps.style.fill = 0xf0f0f0;
        this.debugFps.x = 10;
        this.debugFps.y = 5;
        this.pixi.stage.addChild(this.debugFps);
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