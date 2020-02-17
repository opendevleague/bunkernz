import { Component, Entity } from "../../../shared/ecs";
import { Grid } from "../../../shared/components/Grid";
import Vector2 from "../../../shared/types/Vector2";
import Transform from "../../../shared/components/Transform";

export interface ViewportTile {
    spriteId: number;
}

/**
 * The Viewport Grid is a client-side grid responsible for storing
 * renderable data related to the current viewport offset.
 */
export class ViewportGrid extends Component {

    public target: Transform | null;
    /**
     * Viewport offset from the top-left of the viewport to the top-left of the current level.
     */
    public position: Vector2 = Vector2.zero;
    /**
     * Offset from the current position, from the anchor (top-left).
     */
    public targetOffset: Vector2 = Vector2.zero;
    public verticalCount: number;
    public horizontalCount: number;
    // Defines the scaled tile size to be rendered.
    public tileSize: number = Grid.baseTileSize;
    public viewportTiles: ViewportTile[][] = []

    constructor(horizontalCount: number = Grid.baseTileSize, verticalCount: number = Grid.baseTileSize, target: Transform | null = null) {
        super();

        this.target = target;
        this.horizontalCount = horizontalCount;
        this.verticalCount = verticalCount;

        // Initialise all viewport tiles.
        for (let i = 0; i < this.horizontalCount; i++) {
            this.viewportTiles[i] = [];

            for (let j = 0; j < this.verticalCount; j++) {
                this.viewportTiles[i][j] = {
                    spriteId: 0
                };
            }
        }
    }
}
