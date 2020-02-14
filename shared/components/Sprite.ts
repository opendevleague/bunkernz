import { Component } from "../ecs";

/**
 * Used to render a sprite.
 */
export default class Sprite extends Component {

    constructor(public source: string) {
        super();
    }
}
