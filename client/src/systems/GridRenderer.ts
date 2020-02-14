import { System, Component, Entity } from "../../../shared/ecs";
import * as Pixi from "pixi.js";
import Sprite from "../components/Sprite";
import Transform from "../../../shared/components/Transform";
import Vector2 from "../../../shared/types/Vector2";
import { Grid } from "../../../shared/components/Grid";
import Line from "../types/Line";

/**
 * TODO: Account for camera position.
 */
export default class GridRenderer extends System {

    private lines: Line[] = [];
    private pixi: Pixi.Application;

    protected get requiredComponents(): typeof Component[] {
        return [
            Grid
        ];
    }

    constructor(pixi: Pixi.Application) {
        super();

        this.pixi = pixi;
    }

    public start(entity: Entity) {
        const grid = this.getComponent(entity, Grid);

        this.renderGrid(grid, window.innerWidth, window.innerHeight);

        window.addEventListener("resize", (event) => {
            this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
            this.renderGrid(grid, window.innerWidth, window.innerHeight);
        });
    }

    private renderGrid(grid: Grid, width: number, height: number) {
        this.lines.forEach(line => {
            this.pixi.stage.removeChild(line);
            line.destroy();
        });

        this.lines = [];

        const tileSize = Math.max(width / grid.horizontalCount, height / grid.verticalCount);
        grid.tileSize = new Vector2(tileSize);

        for (let i = 0; i < grid.horizontalCount; i++) {
            const vertical = new Line([
                new Vector2(i * grid.tileSize.x, 0),
                new Vector2(i * grid.tileSize.x, height),
            ], 1, 0x505050);

            this.pixi.stage.addChild(vertical);
            this.lines.push(vertical);

            for (let j = 0; j < grid.verticalCount; j++) {
                const horizontal = new Line([
                    new Vector2(0, i * grid.tileSize.y),
                    new Vector2(width, i * grid.tileSize.y),
                ], 1, 0x707070);

                this.pixi.stage.addChild(horizontal);
                this.lines.push(horizontal);
            }
        }
    }

    public update(entity: Entity): void {
        const grid = this.getComponent(entity, Grid);
    }
}
