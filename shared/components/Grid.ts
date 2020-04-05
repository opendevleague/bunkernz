import { Component, Entity } from "../ecs";
import Vector2 from "../types/Vector2";

export interface Tile {
    occupants: Entity[];
}

export class Grid extends Component {

    public verticalCount: number;
    public horizontalCount: number;
    public tiles: Tile[][] = [];

    public static readonly baseTileSize: number = 1;

    constructor(horizontalCount: number = Grid.baseTileSize, verticalCount: number = Grid.baseTileSize) {
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
