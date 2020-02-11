import WebSocket, { Server } from "ws";
import buildConfig from "../../../build/config";
import { System } from "../../../shared/ecs";
import { IncomingMessage } from "http";

type OutgoingMessage = Record<string, any> | string;

export default class NetworkServer extends System {
    private readonly server: Server;
    private baseId = 0;
    private netId: Map<WebSocket, number> = new Map();

    public constructor() {
        super();

        this.server = new Server({
            host: buildConfig.server.listenHost,
            port: buildConfig.server.listenPort,
        });

        this.server.on("connection", (socket, request) => {
            this.onNewClient(socket, request);
        });
    }

    private send(socket: WebSocket, data: OutgoingMessage): void {
        if (socket.readyState === WebSocket.OPEN) {
            const stringified =
                typeof data === "string" ? data : JSON.stringify(data);

            socket.send(stringified);
        }
    }

    private broadcast(socket: WebSocket, data: OutgoingMessage): void {
        this.server.clients.forEach(client => {
            if (client !== socket) {
                this.send(client, data);
            }
        });
    }

    private onNewClient(socket: WebSocket, request: IncomingMessage): void {
        const netId = this.baseId++;
        this.netId.set(socket, netId);

        socket.on("message", raw => {
            const data = JSON.parse(raw as string);

            switch (data.type) {
                case "join":
                    this.broadcast(socket, {
                        type: "join",
                        netId,
                    });

                    this.server.clients.forEach(client => {
                        if (client !== socket && this.netId.has(client)) {
                            this.send(socket, {
                                type: "join",
                                netId: this.netId.get(client),
                            });
                        }
                    });
                    break;
                case "move":
                    this.broadcast(socket, {
                        type: "move",
                        netId,
                        x: data.x,
                        y: data.y,
                    });
                    break;
            }
        });

        socket.on("close", () => {
            this.broadcast(socket, {
                type: "exit",
                netId,
            });
        });
    }
}
