import { Component } from "../../../shared/ecs";
import * as Pixi from "pixi.js";

export default class Sprite extends Component {

    public source: string;
    public element!: Pixi.Sprite;

    constructor(source = "") {
        super();

        this.source = source;
    }
}