import { Component } from "../../../../shared/ecs";

export default class Sprite extends Component {
    constructor(public source = "") {
        super();
    }
}
