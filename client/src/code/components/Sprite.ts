import { Component } from "../../../../shared/ecs";

export default class Sprite extends Component {
    public source: string;
    public element!: PIXI.Sprite;

    constructor(source = "") {
        super();

        this.source = source;
    }
}
