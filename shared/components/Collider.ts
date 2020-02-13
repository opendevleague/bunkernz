import { Component } from "../ecs";

export class Collider extends Component {
    public top_left!: number;
    public bottom_right!: number;
}
