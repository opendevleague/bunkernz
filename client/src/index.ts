import buildConfig from "../../build/config";
import "../style/index.scss";
import Renderer from "./systems/Renderer";
import bunny from "../assets/img/bunny.png";
import Sprite from "./components/Sprite";
// import Input from "./systems/Input";
import ActionMap from "./components/ActionMap";
import NetworkClient from "./systems/NetworkClient";
import NetworkedPlayer from "../../shared/components/NetworkedPlayer";
import * as PIXI from "pixi.js";
import { Game } from "../../shared/Game";
import PlayerSprite from "../media/assets/bunny.png";
import { Transform } from "../../shared/components/Transform";

class Client extends Game {

    private canvas: HTMLCanvasElement;

    public constructor() {
        super();

        this.canvas = document.getElementById("view") as HTMLCanvasElement;
        this.canvas.oncontextmenu = event => {
            event.preventDefault();
            event.stopPropagation();
        };

        this.addSystem(new Renderer(this.canvas));
        // this.addSystem(new Input({
        //     up: "ArrowUp",
        //     down: "ArrowDown",
        //     left: "ArrowLeft",
        //     right: "ArrowRight",
        // }));
        this.addSystem(new NetworkClient(buildConfig.client.server, this));

        const localPlayer = this.createEntity([
            new NetworkedPlayer(true),
            new Transform(),
            new Sprite(bunny),
            // new ActionMap({
            //     up: (entity): void => {
            //         const position = entity.getComponent(Position);
            //         if (!position) return;

            //         position.y--;
            //     },
            //     down: (entity): void => {
            //         const position = entity.getComponent(Position);
            //         if (!position) return;

            //         position.y++;
            //     },
            //     left: (entity): void => {
            //         const position = entity.getComponent(Position);
            //         if (!position) return;

            //         position.x--;
            //     },
            //     right: (entity): void => {
            //         const position = entity.getComponent(Position);
            //         if (!position) return;

            //         position.x++;
            //     },
            // }),
        ]);

        this.start();
    }
}

const client = new Client();