import { Component } from "../ecs";

/**
 * Used to render a sprite.
 */
export class Sprite extends Component {
    constructor(public source: string) {
        super();
    }
}
