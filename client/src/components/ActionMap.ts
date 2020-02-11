import { Component, Entity } from "../../../shared/ecs";

export default class ActionMap extends Component {
    public constructor(public map: Record<string, (entity: Entity) => void>) {
        super();
    }
}
