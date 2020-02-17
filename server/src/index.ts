import NetworkServer from "./systems/NetworkServer";
import { Game } from "../../shared/Game";
import { Grid } from "../../shared/components/Grid";

class Server extends Game {

    public constructor() {
        super();

        // Create entities.
        const level = this.createEntity([
            new Grid()
        ]);

        // Add systems.
        this.addSystem(new NetworkServer());

        this.start();
    }
}

const server = new Server();
