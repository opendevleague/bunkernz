import * as ws from "ws";
import buildConfig from "../../build/config";
import { Game } from "../../shared/Game";

class Server {
    private readonly socket: ws.Server;
    private readonly game: Game;

    public constructor() {
        this.socket = new ws.Server({
            host: buildConfig.server.listenHost,
            port: buildConfig.server.listenPort,
        });

        this.listen();

        this.game = new Game();
    }

    private listen() {
        this.socket.on("connection", () => {
            console.log("Client connected");
        });
    }
}

const server = new Server();
