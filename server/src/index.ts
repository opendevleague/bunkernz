import NetworkServer from "./systems/NetworkServer";
import { Game } from "../../shared/Game";

class Server extends Game {

    public constructor() {
        super();

        this.addSystem(new NetworkServer());
        this.start();
    }
}

const server = new Server();
