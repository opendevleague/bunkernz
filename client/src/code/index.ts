import buildConfig from "../../../build/config.js";
import "../style/index.scss";
import * as PIXI from "pixi.js";
import { Game } from "../../../shared/Game";
import Renderer from "./systems/Renderer";
import PlayerSprite from "../media/assets/bunny.png";
import Sprite from "./components/Sprite";
import { Transform } from "../../../shared/components/Transform";

class Client extends Game {
    public constructor() {
        super();

        this.addSystem(
            new Renderer(document.getElementById("view") as HTMLCanvasElement),
        );

        this.createEntity([new Sprite(PlayerSprite), new Transform()]);
    }
}

const client = new Client();
