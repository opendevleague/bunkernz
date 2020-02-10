import { Component } from "../ECS";

export class Sprite extends Component {

    public source?: string;

    public constructor(source?: string) {
        super();

        this.source = source;
    }
}