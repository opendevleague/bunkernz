export default class Vector2 {

    public x: number;
    public y: number;

    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public static get one(): Vector2 {
        return new Vector2(1, 1);
    }

    public static get right(): Vector2 {
        return new Vector2(1, 0);
    }

    public static get left(): Vector2 {
        return new Vector2(-1, 0);
    }

    public static get up(): Vector2 {
        return new Vector2(0, -1);
    }

    public static get down(): Vector2 {
        return new Vector2(0, 1);
    }

    public static add(lhs: Vector2, rhs: Vector2): Vector2 {
        return new Vector2(lhs.x + rhs.x, lhs.y + rhs.y);
    }

    public static subtract(lhs: Vector2, rhs: Vector2): Vector2 {
        return new Vector2(lhs.x - rhs.x, lhs.y - rhs.y);
    }

    public static scale(lhs: Vector2, scalar: number): Vector2 {
        const vector = new Vector2(lhs);
        vector.scale(scalar);
        return vector;
    }

    public static multiply(lhs: Vector2, rhs: Vector2): Vector2 {
        const vector = new Vector2(lhs);
        vector.multiply(rhs);
        return vector;
    }

    public static div(lhs: Vector2, rhs: Vector2): Vector2 {
        return new Vector2(lhs.x / rhs.x, lhs.y / rhs.y);
    }

    public static dot(lhs: Vector2, rhs: Vector2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }

    public static equals(lhs: Vector2, rhs: Vector2): boolean {
        return lhs.x === rhs.x && lhs.y == rhs.y;
    }

    public constructor(other: Vector2);
    public constructor(x: number, y?: number);
    public constructor(a: number | Vector2, b?: number) {
        if (a instanceof Vector2) {
            this.x = a.x;
            this.y = a.y;
        } else if (typeof b === "number") {
            this.x = a;
            this.y = b;
        } else {
            this.x = a;
            this.y = a;
        }
    }

    public toPoint(): { x: number; y: number } {
        return {
            x: this.x,
            y: this.y
        };
    }

    public add(rhs: Vector2): void {
        this.x += rhs.x;
        this.y += rhs.y;
    }

    public subtract(rhs: Vector2): void {
        this.x -= rhs.x;
        this.y -= rhs.y;
    }

    public scale(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }

    public multiply(rhs: Vector2): void {
        this.x *= rhs.x;
        this.y *= rhs.y;
    }

    /**
     * Limit the elements of this Vector to a minimum.
     */
    public min(x: number, y?: number) {
        y = y ?? x;
        this.x = Math.max(0, x);
        this.y = Math.max(0, y);
        return this;
    }

    public magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public normalize(): void {
        const magnitude = this.magnitude();

        if (magnitude == 0) {
            this.x = 0;
            this.y = 0;
            return;
        }

        this.x /= magnitude;
        this.y /= magnitude;
    }
}
