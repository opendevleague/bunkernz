import path from "path";
import fs from "fs";
import util from "util";
import * as ws from "ws";
import { Entity, Component, System } from "../../shared/ECS";
import buildConfig from "../../build/config.json";
import { Collider } from "../../shared/components/Collider";
import { Physics } from "../../shared/systems/Physics";
import { Transform } from "../../shared/components/Transform";
import { Renderer } from "../../shared/systems/Renderer";
import { Sprite } from "pixi.js";

class Server {

    private readonly socket: ws.Server;

    public constructor() {
        this.socket = new ws.Server({
            host: buildConfig.server.listenHost,
            port: buildConfig.server.listenPort,
        });

        this.listen();
        this.example();
    }

    private listen() {
        this.socket.on("connection", () => {
            console.log("Client connected");
        });
    }

    private async example() {
        const components: Component[] = [];

        const systems = {
            physics: new Physics({
                collider: new Collider(),
                transform: new Transform()
            }, components),
        };

        const player = Entity.create([
            new Collider(),
            new Transform()
        ], components);

        systems.physics.addEntity(player);

        setTimeout(() => {
            systems.physics.removeEntity(player);
        }, 200);

        // simulate game loop
        const dt = 0.050; // 50ms
        while (true) {
            Object.keys(systems).forEach(key => {
                //@ts-ignore
                const system: System = systems[key];
                system.loop(dt);
            });

            await (new Promise(resolve => setTimeout(resolve, dt * 1000)));
        }
    }
}

const server = new Server();