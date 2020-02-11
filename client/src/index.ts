import buildConfig from "../../build/config";
import "../style/index.scss";
import Engine from "../../shared/Engine";
import Renderer from "./systems/Renderer";
import Texture from "./components/Texture";
import bunny from "../assets/img/bunny.png";
import Position from "../../shared/components/Position";
import Sprite from "./components/Sprite";
import Input from "./systems/Input";
import ActionMap from "./components/ActionMap";
import NetworkClient from "./systems/NetworkClient";
import LocalPlayer from "./components/LocalPlayer";

const engine = new Engine();

engine.addSystem(
    new Renderer(document.getElementById("view") as HTMLCanvasElement),
);

engine.addSystem(
    new Input({
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
    }),
);

engine.addSystem(new NetworkClient(buildConfig.client.server));

engine.createEntity([
    new LocalPlayer(),
    new Position(),
    new Sprite(),
    new Texture(bunny),
    new ActionMap({
        up: (entity): void => {
            const position = entity.getComponent(Position);
            if (!position) return;

            position.y--;
        },
        down: (entity): void => {
            const position = entity.getComponent(Position);
            if (!position) return;

            position.y++;
        },
        left: (entity): void => {
            const position = entity.getComponent(Position);
            if (!position) return;

            position.x--;
        },
        right: (entity): void => {
            const position = entity.getComponent(Position);
            if (!position) return;

            position.x++;
        },
    }),
]);

engine.run();
