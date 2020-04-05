import Vector2 from "../../../shared/types/Vector2";
import * as Pixi from "pixi.js";

export default class Line extends Pixi.Graphics {

    public size: number;
    public color: number;

    constructor(points: Vector2[], size = 1, color = 0xffffff) {
        super();

        this.size = size;
        this.color = color;
    }

    public renderLine(points: Vector2[], renderer: Pixi.Renderer) {
        this.clear();
        this.lineStyle(this.size, this.color);

        points.forEach((point, i) => {
            if (i == 0) {
                this.moveTo(point.x, point.y);
                return;
            }

            this.lineTo(point.x, point.y);
        });

        this.render(renderer);
    }
}