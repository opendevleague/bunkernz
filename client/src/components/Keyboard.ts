import { Component } from "../../../shared/ecs";

export interface KeyEvent extends KeyboardEvent {
    isDown: boolean;
}

export default class Keyboard extends Component {

    public keys: KeyEvent[] = [];
}
