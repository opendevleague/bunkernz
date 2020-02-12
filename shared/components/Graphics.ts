import { Component } from "../ECS";
import { Vector2 } from "../types/Vector2";

/**
 * Graphics represents a polygon.
 */
export class Graphics extends Component {

    public points!: Vector2[];
    public color!: number;
}