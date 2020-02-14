import buildConfig from "../../../build/config.js";
import "../style/index.scss";
import * as PIXI from "pixi.js";
import { Game } from "../../../shared/Game";
import Renderer from "./systems/Renderer";
import PlayerSprite from "../media/assets/bunny.png";
import Sprite from "./components/Sprite";
import { Transform } from "../../../shared/components/Transform";

class Client extends Game {

    private canvas: HTMLCanvasElement;

    public constructor() {
        super();

        this.canvas = document.getElementById("view") as HTMLCanvasElement;
        this.canvas.oncontextmenu = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        this.addSystem(
            new Renderer(this.canvas),
        );

        const player = this.createEntity([new Sprite(PlayerSprite), new Transform()]);
    }
}

const client = new Client();
