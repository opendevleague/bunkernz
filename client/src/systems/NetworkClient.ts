import Position from "../../../shared/components/Position";
import { Entity } from "../../../shared/ecs";
import Engine from "../../../shared/Engine";
import LocalPlayer from "../components/LocalPlayer";
import Sprite from "../components/Sprite";
import Texture from "../components/Texture";
import bunny from "../../assets/img/bunny.png";

export default class NetworkClient {
    private socket: WebSocket;
    private sendQueue: string[] = [];
    private receiveQueue: string[] = [];
    private idToEntity: Map<number, Entity> = new Map();
    private entityToId: Map<Entity, number> = new Map();

    public constructor(url: string) {
        this.socket = new WebSocket(url);
        this.socket.onmessage = msg => this.receiveQueue.push(msg.data);
    }

    public update(engine: Engine): void {
        engine.createdComponents().forEach(component => {
            if (component instanceof LocalPlayer && component.entity) {
                this.join(component.entity);
            }
        });

        engine.componentsOfType(LocalPlayer).forEach(component => {
            const entity = component.entity;
            const position = entity?.getComponent(Position);

            if (entity && position) {
                this.send({
                    type: "move",
                    x: position.x,
                    y: position.y,
                });
            }
        });

        if (this.receiveQueue.length) {
            const queue = this.receiveQueue;
            this.receiveQueue = [];

            queue.forEach(msg => {
                const data = JSON.parse(msg);
                const netId: number = data.netId;

                switch (data.type) {
                    case "join": {
                        const imposter = engine.createEntity([
                            new Position(),
                            new Sprite(),
                            new Texture(bunny),
                        ]);

                        this.entityToId.set(imposter, netId);
                        this.idToEntity.set(netId, imposter);
                        break;
                    }
                    case "exit":
                        if (this.idToEntity.has(netId)) {
                            const entity = this.idToEntity.get(netId);

                            if (entity) {
                                engine.dispose(entity);
                            }
                        }
                        break;
                    case "move":
                        if (this.idToEntity.has(netId)) {
                            const entity = this.idToEntity.get(netId);
                            const position = entity?.getComponent(Position);

                            if (entity && position) {
                                position.x = data.x;
                                position.y = data.y;
                            }
                        }
                        break;
                }
            });
        }

        if (this.sendQueue.length) {
            const queue = this.sendQueue;
            this.sendQueue = [];

            queue.forEach(msg => this.send(msg));
        }
    }

    private join(entity: Entity): void {
        this.send({
            type: "join",
        });
    }

    private send(data: Record<string, any> | string): void {
        const stringified =
            typeof data === "string" ? data : JSON.stringify(data);

        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(stringified);
        } else {
            this.sendQueue.push(stringified);
        }
    }
}
