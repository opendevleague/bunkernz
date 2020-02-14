import Ecs, { Entity, System, Component, Entities } from "../../../shared/ecs";
import Sprite from "../components/Sprite";
import bunny from "../../assets/img/bunny.png";
import { Transform } from "../../../shared/components/Transform";
import NetworkedPlayer from "../../../shared/components/NetworkedPlayer";
import CharacterInput from "../../../shared/components/CharacterInput";
import { Vector2 } from "../../../shared/types/Vector2";
import { SystemEntities } from "../../../shared/ecs/System";

export default class NetworkClient extends System {

    private socket: WebSocket;
    private sendQueue: string[] = [];
    private receiveQueue: string[] = [];
    private ecs: Ecs;
    private localPlayer: Entity = -1;
    private localId = -1;
    private idToEntity: Map<number, Entity> = new Map();
    private entityToId: Map<Entity, number> = new Map();

    protected get requiredComponents(): typeof Component[] {
        return [
            Transform,
            NetworkedPlayer,
            CharacterInput
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

        this.localPlayer = player.entity;
        this.join(player.entity);
        this.log("Started local client");
    }

    public update(entity: Entity): void {
        if (entity == this.localPlayer)
            this.localUpdate();
    }

    private localUpdate() {
        const input = this.getComponent(this.localPlayer, CharacterInput);
        const transform = this.getComponent(this.localPlayer, Transform);

        this.send({
            type: "move",
            position: transform.position.toPoint(),
            input: input.moveVector.toPoint()
        });

        if (this.receiveQueue.length > 0)
            this.receiveMessages();

        if (this.sendQueue.length > 0)
            this.sendMessages();
    }

    private join(entity: Entity): void {
        const transform = this.getComponent(entity, Transform);

        this.send({
            type: "join",
            position: transform.position.toPoint()
        });
    }

    /**
     * TODO: Refactor this. A lot.
     */
    private receiveMessages() {
        const queue = this.receiveQueue;
        this.receiveQueue = [];

        queue.forEach(msg => {
            const data = JSON.parse(msg);
            const netId: number = data.netId;

            let entity: Entity;
            let transform: Transform;
            let input: CharacterInput;
            let position: Vector2;

            // TODO: Implement "EntityCUD" return on start/stop/update.
            switch (data.type) {
                case "handshake":
                    // Receive local ID.
                    this.localId = netId;

                    this.log(`Received net ID ${this.localId} for local entity ${this.localPlayer}`);
                    this.entityToId.set(this.localPlayer, this.localId);
                    this.entityToId.set(this.localId, this.localPlayer);
                    break;
                case "join": {
                    // Create new player.
                    const imposter = this.ecs.createEntity([
                        new Transform(new Vector2(data.position.x, data.position.y)),
                        new NetworkedPlayer(),
                        new CharacterInput(),
                        new Sprite(bunny),
                    ]);

                    this.entityToId.set(imposter, netId);
                    this.idToEntity.set(netId, imposter);
                    break;
                }
                case "exit":
                    this.log("Received exit event");
                    if (!this.idToEntity.has(netId))
                        break;

                    entity = this.idToEntity.get(netId) as Entity;

                    // if (entity)
                    // dispose(entity);
                    break;
                case "move":
                    if (!this.idToEntity.has(netId))
                        break;

                    entity = this.idToEntity.get(netId) as Entity;

                    if (entity == null)
                        break;

                    // Do not move locally again.
                    if (entity == this.localId)
                        break;

                    transform = this.getComponent(entity, Transform);
                    input = this.getComponent(entity, CharacterInput);

                    position = new Vector2(data.position.x, data.position.y);

                    if (Vector2.equals(position, transform.position))
                        break;

                    input.movePosition = position;
                //this.log(`Received move event from net ID ${netId}, from pos ${JSON.stringify(transform.position.toPoint())} to pos ${JSON.stringify(position.toPoint())}`);
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
