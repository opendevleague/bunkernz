import { System, Component, Entity } from "../../../shared/ecs";
import * as Pixi from "pixi.js";
import Sprite from "../components/Sprite";
import Transform from "../../../shared/components/Transform";
import Vector2 from "../../../shared/types/Vector2";
import { Grid } from "../../../shared/components/Grid";
import { ViewportGrid, ViewportTile } from "../components/ViewportGrid";
import Line from "../types/Line";
import { Client } from "../index";

// Testing tiles.
import grass from '../../assets/public/tiles/category0/0.png';
import grass1 from '../../assets/public/tiles/category0/1.png';
import grass2 from '../../assets/public/tiles/category0/2.png';
import dirt1 from '../../assets/public/tiles/category0/4.png';
import dirt2 from '../../assets/public/tiles/category0/5.png';

/**
 * TODO: Account for camera position.
 * The LevelRenderer is responsible for rendering level tiles.
 */
export default class LevelRenderer extends System {

    private positionDebug: Pixi.Text;
    private verticalLines: Line[] = [];
    private horizontalLines: Line[] = [];
    private tileIds: Pixi.Text[][] = [];
    private pixi: Pixi.Application;

    protected get requiredComponents(): typeof Component[] {
        return [
            Grid,
            ViewportGrid
        ];
    }

    constructor(pixi: Pixi.Application) {
        super();

        this.pixi = pixi;
        // Enable Z-index.
        this.pixi.stage.sortableChildren = true;
        this.positionDebug = Client.createDebugText(2, this.pixi);
    }

    public start(entity: Entity): void {
        const viewport = this.getComponent(entity, ViewportGrid);

        this.updateViewportScale(viewport);
        this.renderGrid(entity);

        // TODO: Only invoke callback if resize hasn't been called within the last 500ms.
        window.addEventListener("resize", (event) => {
            this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
            this.updateViewportScale(viewport);
            this.renderGrid(entity);
        });
    }

    private initialiseTileIds(viewport: ViewportGrid): void {
        // Destroy existing tiles.
        this.tileIds.forEach(tileRow => {
            tileRow.forEach(tile => {
                this.pixi.stage.removeChild(tile);
                //tile.destroy();
            });
        });

        // Initialise all tile ids.
        for (let i = 0; i < viewport.horizontalCount; i++) {
            this.tileIds[i] = [];

            for (let j = 0; j < viewport.verticalCount; j++) {
                const text = new Pixi.Text(`${i} , ${j}`);
                text.scale.set(0.4);
                text.style.fill = 0x000;
                this.pixi.stage.addChild(text);
                this.tileIds[i][j] = text;
            }
        }
    }

    private initialiseGridLines(viewport: ViewportGrid): void {
        // Destroy existing lines.
        this.horizontalLines.forEach(line => {
            line.clear();
            //line.destroy();
        });
        this.verticalLines.forEach(line => {
            line.clear();
            //line.destroy();
        });

        const lineWidth = 1;
        const color = 0x505050;
        this.horizontalLines = [];
        this.verticalLines = [];

        // Initialise all grid lines.
        for (let i = 0; i < viewport.horizontalCount; i++) {
            this.verticalLines[i] = new Line([Vector2.zero, Vector2.zero], lineWidth, color);

            for (let j = 0; j < viewport.verticalCount; j++) {
                this.horizontalLines[j] = new Line([Vector2.zero, Vector2.zero], lineWidth, color);
            }
        }
    }

    private updateViewportScale(viewport: ViewportGrid) {
        viewport.tileSize = this.pixi.screen.height / viewport.verticalCount;
        viewport.horizontalCount = Math.ceil(this.pixi.screen.width / viewport.tileSize);

        this.initialiseGridLines(viewport);
        this.initialiseTileIds(viewport);
    }

    /**
     * Precedurally render environment through a viewport grid.
     */
    private renderGrid(entity: Entity) {
        const grid = this.getComponent(entity, Grid);
        const viewport = this.getComponent(entity, ViewportGrid);

        // Viewport (target) tile origin - target-anchored.
        viewport.origin = Vector2.scale(viewport.position, 1 /*/ viewport.tileSize*/);
        // The scaled viewport (target) origin of the viewport within the grid - target-anchored.
        const scaledOrigin = Vector2.scale(Vector2.subtract(viewport.position, viewport.targetOffset), viewport.tileSize);
        // Define a vector the size half of the viewport.
        const halfViewport = new Vector2(
            Math.ceil(viewport.horizontalCount / 2),
            Math.ceil(viewport.verticalCount / 2)
        );
        // Initialise viewport bounds.
        const bounds = {
            // The lower viewport boundary, anchored on the top-left tile (viewport(0,0)).
            min: Vector2.subtract(
                viewport.origin,
                // Restrain the lower boundary to a min value of (0,0).
                halfViewport.min(0)
            ),
            max: Vector2.add(
                viewport.origin,
                halfViewport
            )
        };

        // The scaled upper grid boundaries.
        const gridRightBoundary: number = (grid.horizontalCount + bounds.min.x) * viewport.tileSize
        const gridBottomBoundary: number = (grid.verticalCount + bounds.min.y) * viewport.tileSize;

        // Debug Position.
        this.positionDebug.text = `POSITION ${viewport.origin.x.toFixed(0)},${viewport.origin.y.toFixed(0)}`;

        for (let i = 0; i < viewport.horizontalCount; i++) {
            const tilePositionX = this.getTilePosition(
                i,
                viewport.origin.x,
                viewport.horizontalCount
            );

            const scaledTilePositionX = (tilePositionX * viewport.tileSize) - scaledOrigin.x;

            // Clear if out of bounds.
            if (tilePositionX < 0 || tilePositionX > grid.horizontalCount) {
                this.tileIds[i].forEach(row => {
                    row.text = "";
                });
                continue;
            }

            // Update vertical line.
            this.verticalLines[i].renderLine([
                new Vector2(scaledTilePositionX, -scaledOrigin.y),
                new Vector2(scaledTilePositionX, gridBottomBoundary > this.pixi.screen.height ? this.pixi.screen.height : gridBottomBoundary),
            ], this.pixi.renderer);

            for (let j = 0; j < viewport.verticalCount; j++) {
                const tilePositionY = this.getTilePosition(
                    j,
                    viewport.origin.y,
                    viewport.verticalCount
                );

                const scaledTilePositionY = (tilePositionY * viewport.tileSize) - scaledOrigin.y;

                // Clear if out of bounds.
                if (tilePositionY < 0 || tilePositionY > grid.verticalCount) {
                    this.tileIds[i][j].text = "";
                    continue;
                }

                // Update horizontal line.
                this.horizontalLines[j].renderLine([
                    new Vector2(-scaledOrigin.x, scaledTilePositionY),
                    new Vector2(gridRightBoundary > this.pixi.screen.width ? this.pixi.screen.width : gridRightBoundary, scaledTilePositionY),
                ], this.pixi.renderer);

                // Set ID according to viewport offset.
                this.tileIds[i][j].text = `${tilePositionX.toFixed(0)} , ${tilePositionY.toFixed(0)}`;
                // Set text location.
                this.tileIds[i][j].x = scaledTilePositionX + 7;
                this.tileIds[i][j].y = scaledTilePositionY + 3;

                if (viewport.viewportTiles[i] == null)
                    viewport.viewportTiles[i] = [];

                if (viewport.viewportTiles[i][j] == null)
                    viewport.viewportTiles[i][j] = {
                        category: 0,
                        tile: 0,
                        sprite: null
                    };

                const tile = viewport.viewportTiles[i][j];

                if (tile.sprite == null) {
                    // tile.sprite = new Pixi.Sprite(Pixi.Texture.from(`/assets/tiles/category${tile.category}/${tile.tile}.png`));
                    tile.sprite = new Pixi.Sprite(Pixi.Texture.from(dirt1));
                    this.pixi.stage.addChild(tile.sprite);
                    tile.sprite.width = viewport.tileSize;
                    tile.sprite.height = viewport.tileSize;
                    tile.sprite.zIndex = -10;
                    tile.sprite.updateTransform();
                }

                // tile.sprite.visible = tilePositionX >= viewport.origin.x && tilePositionY >= viewport.origin.y;
                tile.sprite.position.set(scaledTilePositionX, scaledTilePositionY);
            }
        }
    }

    /**
     * Gets a tile position one-dimensionally from a viewport.
     * @param i Viewport tile index.
     * @param o Viewport origin tile.
     * @param c Viewport tile count.
     */
    private getTilePosition(i: number, o: number, c: number): number {
        // Convert origin to tile integer.
        o = Math.ceil(o);
        // Half of viewport count.
        const h = Math.floor(c / 2);
        // Minimum boundary.
        const min = o - h

        return i + min;
    }

    public update(entity: Entity): void {
        const viewport = this.getComponent(entity, ViewportGrid);
        const targetPosition = viewport.target?.position ?? Vector2.zero;
        viewport.position = targetPosition;
        viewport.targetOffset = new Vector2(
            Math.floor(viewport.horizontalCount / 2),
            Math.floor(viewport.verticalCount / 2)
        );

        this.renderGrid(entity);
    }
}
