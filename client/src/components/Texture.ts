import { Component } from "../../../shared/ecs";

export default class Texture extends Component {
    public constructor(public src = "") {
        super();
    }
}
