import { Component, Entity } from "../ecs";
import Vector2 from "../types/Vector2";

export interface Tile {
    occupants: Entity[]
}

export class Grid extends Component {

    public tileSize?: Vector2; // Client only.
    public verticalCount: number = 25;
    public horizontalCount: number = 40;
    public tiles: Tile[][] = [];

    constructor(horizontalCount: number = 40, verticalCount: number = 25) {
        super();

        this.horizontalCount = horizontalCount;
        this.verticalCount = verticalCount;

        // Initialise all tiles.
        for (let i = 0; i < this.horizontalCount; i++) {
            this.tiles[i] = [];

            for (let j = 0; j < this.verticalCount; j++) {
                this.tiles[i][j] = {
                    occupants: []
                };
            }
        }
    }
}
