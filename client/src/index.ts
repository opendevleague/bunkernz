import buildConfig from "../../build/config";
import "../style/index.scss";
import Renderer from "./systems/Renderer";
import bunny from "../assets/img/bunny.png";
import Sprite from "./components/Sprite";
// import Input from "./systems/Input";
import NetworkClient from "./systems/NetworkClient";
import NetworkedPlayer from "../../shared/components/NetworkedPlayer";
import { Game } from "../../shared/Game";
import { Transform } from "../../shared/components/Transform";
import Input from "./systems/Input";
import Keyboard from "./components/Keyboard";
import CharacterInput from "../../shared/components/CharacterInput";
import CharacterController from "../../shared/systems/CharacterController";
import CharacterTranslator from "./systems/input translators/CharacterTranslator";

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
        this.addSystem(new NetworkClient(buildConfig.client.server, this));
        this.addSystem(new CharacterController());
        this.addSystem(new CharacterTranslator());
        // The input system needs to be the last registered as it clears the Keyboard component on every frame.
        this.addSystem(new Input());

        const localPlayer = this.createEntity([
            new NetworkedPlayer(true),
            new Transform(),
            new Keyboard(),
            new CharacterInput(),
            new Sprite(bunny)
        ]);

        this.start();
    }
}

const client = new Client();