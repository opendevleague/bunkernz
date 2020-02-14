import { Component } from "../ecs";
import { Vector2 } from "../types/Vector2";

export default class CharacterInput extends Component {

    public moveVector: Vector2 = Vector2.zero;
    public movePosition: Vector2 = Vector2.zero;
}
