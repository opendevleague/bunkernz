import WebSocket, { Server } from "ws";
import buildConfig from "../../../build/config";
import { System, Component } from "../../../shared/ecs";
import { IncomingMessage } from "http";
import { Transform } from "../../../shared/components/Transform";

type OutgoingMessage = Record<string, any> | string;

export default class NetworkServer extends System {

    private readonly server: Server;
    private userCount = 0;
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
        const userId = this.userCount++;
        console.log("New connection. Total connections: " + this.users.entries.length);
        this.users.set(socket, userId);

        socket.on("message", raw => {
            const data = JSON.parse(raw as string);
            this.onMessage(socket, data);
        });

        socket.on("close", () => {
            this.broadcast(socket, {
                type: "exit",
                userId,
            });
        });
    }


    private onMessage(socket: WebSocket, data: any): void {
        const userId = this.users.get(socket);

        if (userId == null) {
            console.log("User from the following socket could not be retrieved:", socket);
            return;
        }

        switch (data.type) {
            case "join":
                this.broadcast(socket, {
                    type: "join",
                    userId,
                });

                this.server.clients.forEach(client => {
                    if (client === socket || !this.users.has(client))
                        return;

                    this.send(socket, {
                        type: "join",
                        userId: this.users.get(client),
                    });
                });
                break;
            case "move":
                this.broadcast(socket, {
                    type: "move",
                    userId,
                    x: data.x,
                    y: data.y,
                });
                break;
        }
    }
}
