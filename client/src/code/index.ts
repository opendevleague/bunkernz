import buildConfig from "../../../build/config.json";
import "../style/index.scss";
import * as PIXI from "pixi.js";
import { Game } from "../../../shared/Game.js";
import { Canvas } from "./Canvas.js";
import { Renderer } from "../../../shared/systems/Renderer.js";
import * as PlayerSprite from "../media/assets/bunny.png";

class Client {

    private canvas: Canvas;
    private game: Game;
    private player: number;

    public constructor() {
        this.game = new Game();
        this.canvas = new Canvas(this.game);

        this.player = this.game.addPlayer(PlayerSprite);
    }
}

const client = new Client();

new WebSocket(buildConfig.client.server);
