import path from "path";
import fs from "fs";
import util from "util";
import * as ws from "ws";
import Ecs, { Entity, Component, System } from "../../shared/ecs";
import buildConfig from "../../build/config.json";
import { Collider } from "../../shared/components/Collider";
import { Physics } from "../../shared/systems/Physics";
import { Transform } from "../../shared/components/Transform";
import { Renderer } from "../../shared/systems/Renderer";
import { Sprite } from "pixi.js";
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
