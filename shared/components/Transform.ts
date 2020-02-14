import { Component } from "../ecs";
import { Vector2 } from "../types/Vector2";

export class Transform extends Component {

    public position: Vector2 = Vector2.zero;
    public forward: Vector2 = Vector2.zero;
}
