
export class Vector2 {

    public x: number;
    public y: number;

    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}