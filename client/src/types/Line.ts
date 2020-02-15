import Vector2 from "../../../shared/types/Vector2";
import * as Pixi from "pixi.js";

export default class Line extends Pixi.Graphics {

    public points: Vector2[];
    public size: number;
    public color: number;

    constructor(points: Vector2[], size = 1, color = 0xffffff) {
        super();

        this.points = points;
        this.size = size;
        this.color = color;

        this.setPoints(points);
    }

    public setPoints(points: Vector2[]) {
        this.clear();
        this.points = points;
        this.renderLine();
    }

    private renderLine() {
        this.lineStyle(this.size, this.color);

        this.points.forEach((point, i) => {
            if (i == 0) {
                this.moveTo(point.x, point.y);
                return;
            }

            this.lineTo(point.x, point.y);
        });
    }
}