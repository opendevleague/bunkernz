import WebSocket, { Server } from "ws";
import buildConfig from "../../../build/config";
import { System, Component } from "../../../shared/ecs";
import { IncomingMessage } from "http";
import Transform from "../../../shared/components/Transform";

type OutgoingMessage = Record<string, any> | string;

export default class NetworkServer extends System {

    private readonly server: Server;
    private baseId = 0;
    private users: Map<WebSocket, number> = new Map();

    protected get requiredComponents(): typeof Component[] {
        return [
            Transform
        ];
    }

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
            const stringified = typeof data === "string" ? data : JSON.stringify(data);

            socket.send(stringified);
        }
    }

    private broadcast(broadcaster: WebSocket, data: OutgoingMessage): void {
        this.server.clients.forEach(client => {
            if (client === broadcaster)
                return;

            this.send(client, data);
        });
    }

    private onNewClient(socket: WebSocket, request: IncomingMessage): void {
        if (this.users.has(socket))
            return;

        const netId = this.baseId++;
        this.users.set(socket, netId);
        // Print message in green.
        console.log("\x1b[32m", "Connection opened. Total connections: " + this.users.size, "\x1b[0m");

        socket.on("message", raw => {
            const data = JSON.parse(raw as string);
            this.onMessage(socket, data);
        });

        socket.on("close", () => {
            this.users.delete(socket);
            // Print message in red.
            console.log("\x1b[31m", "Connection closed. Total connections: " + this.users.size, "\x1b[0m");

            this.broadcast(socket, {
                type: "exit",
                netId,
            });
        });
    }

    private onMessage(socket: WebSocket, data: any): void {
        const netId = this.users.get(socket);

        if (netId == null) {
            console.log("User from the following socket could not be retrieved:", socket);
            return;
        }

        switch (data.type) {
            case "join":
                this.broadcast(socket, {
                    type: "join",
                    position: data.position,
                    netId,
                });

                this.send(socket, {
                    type: "handshake",
                    netId
                });

                this.server.clients.forEach(client => {
                    if (client === socket || !this.users.has(client))
                        return;

                    this.send(socket, {
                        type: "join",
                        position: data.position,
                        netId: this.users.get(client),
                    });
                });
                break;
            case "move":
                // TODO: Validate data.input & data.position.

                this.broadcast(socket, {
                    type: "move",
                    netId,
                    position: data.position
                });
                break;
        }
    }
}
