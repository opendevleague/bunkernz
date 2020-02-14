import { Component } from "../ecs";

export default class NetworkedPlayer extends Component {

    public isLocal: boolean;

    public constructor(isLocal = false) {
        super();

        this.isLocal = isLocal;
    }
}