import buildConfig from "../../../build/config.json";
import "../style/index.scss";
import * as PIXI from "pixi.js";
import { Game } from "../../../shared/Game";
import { Canvas } from "./Canvas";
import { Renderer } from "../../../shared/systems/Renderer";
import * as PlayerSprite from "../media/assets/bunny.png";

class Client {
    private canvas: Canvas;
    private game: Game;

    public constructor() {
        this.game = new Game();
        this.canvas = new Canvas(this.game);
    }
}

const client = new Client();

new WebSocket(buildConfig.client.server);
