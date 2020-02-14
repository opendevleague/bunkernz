import Ecs, { Entity, System, Component } from "../../../shared/ecs";
import Sprite from "../components/Sprite";
import bunny from "../../assets/img/bunny.png";
import { Transform } from "../../../shared/components/Transform";
import NetworkedPlayer from "../../../shared/components/NetworkedPlayer";

export default class NetworkClient extends System {

    private socket: WebSocket;
    private sendQueue: string[] = [];
    private receiveQueue: string[] = [];
    private ecs: Ecs;
    private idToEntity: Map<number, Entity> = new Map();
    private entityToId: Map<Entity, number> = new Map();

    protected get requiredComponents(): typeof Component[] {
        return [
            Transform,
            NetworkedPlayer
        ];
    }

    public constructor(url: string, ecs: Ecs) {
        super();

        this.ecs = ecs;
        this.socket = new WebSocket(url);
        this.socket.onmessage = msg => this.receiveQueue.push(msg.data);
    }

    public start(entity: Entity): void {
        const player = this.getComponent(entity, NetworkedPlayer);

        if (!player.isLocal)
            return;

        this.join(player.entity);
        console.log("started local client");
    }

    public update(entity: Entity): void {
        const transform = this.getComponent(entity, Transform);

        this.send({
            type: "move",
            x: transform.position.x,
            y: transform.position.y,
        });

        if (this.receiveQueue.length > 0)
            this.receiveMessages();

        if (this.sendQueue.length > 0)
            this.sendMessages();
    }

    private join(entity: Entity): void {
        this.send({
            type: "join",
        });
    }

    private receiveMessages() {
        const queue = this.receiveQueue;
        this.receiveQueue = [];

        queue.forEach(msg => {
            const data = JSON.parse(msg);
            const netId: number = data.netId;
            let entity;
            let transform;

            switch (data.type) {
                // TODO: Implement "EntityCUD" return on start/stop/update.
                case "join": {
                    console.log("received join event");
                    const imposter = this.ecs.createEntity([
                        new Transform(),
                        new NetworkedPlayer(),
                        new Sprite(bunny),
                    ]);

                    this.entityToId.set(imposter, netId);
                    this.idToEntity.set(netId, imposter);
                    break;
                }
                case "exit":
                    console.log("received exit event");
                    if (!this.idToEntity.has(netId))
                        break;

                    entity = this.idToEntity.get(netId);

                    // if (entity)
                    // dispose(entity);
                    break;
                case "move":
                    console.log("received move event");
                    if (!this.idToEntity.has(netId))
                        break;

                    entity = this.idToEntity.get(netId);

                    if (entity == null)
                        break;

                    transform = this.getComponent(entity, Transform);
                    transform.position.x = data.x;
                    transform.position.y = data.y;
            }
        });
    }

    private sendMessages() {
        const queue = this.sendQueue;
        this.sendQueue = [];

        queue.forEach(msg => this.send(msg));
    }

    private send(data: Record<string, any> | string): void {
        const stringified = typeof data === "string" ? data : JSON.stringify(data);

        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(stringified);
        } else if (!this.sendQueue.includes(stringified)) {
            this.sendQueue.push(stringified);
        }
    }
}
