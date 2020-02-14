import { Component } from "../../../shared/ecs";

export interface KeyEvent extends KeyboardEvent {
    isHeld: boolean;
    isDown: boolean;
    isUp: boolean;
}

export default class Keyboard extends Component {

    public keys: KeyEvent[] = [];
}
