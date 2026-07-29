import { lerp } from "../interpolation/lerp";
import { Angle } from "../units/Angle";

export class Vector2 {
    public constructor(
        public x: number,
        public y: number
    ) { }

    public set(x: number, y: number): this {
        this.x = x;
        this.y = y;

        return this;
    }

    public add(vector: Vector2): this {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    public subtract(vector: Vector2): this {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    public multiplyScalar(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    public divideScalar(scalar: number): this {
        this.x /= scalar;
        this.y /= scalar;

        return this;
    }

    public rotate(angle: Angle, origin: Vector2 = new Vector2(0, 0)): this {
        const x: number = this.x - origin.x;
        const y: number = this.y - origin.y;

        const radians: number = angle.radians;

        this.x = Math.cos(radians) * x - Math.sin(radians) * y + origin.x;
        this.y = Math.sin(radians) * x + Math.cos(radians) * y + origin.y;

        return this;
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public lengthSquared(): number {
        return (
            this.x * this.x +
            this.y * this.y
        );
    }

    public distanceTo(vector: Vector2): number {
        return Math.sqrt(this.distanceToSquared(vector));
    }

    public distanceToSquared(vector: Vector2): number {
        const deltaX: number = this.x - vector.x;
        const deltaY: number = this.y - vector.y;

        return (
            deltaX * deltaX +
            deltaY * deltaY
        );
    }

    public normalize(): this {
        const length: number = this.length();

        if (length === 0)
            return this;

        this.divideScalar(length);

        return this;
    }

    public negate(): this {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    public lerp(target: Vector2, t: number): this {
        this.x = lerp(this.x, target.x, t);
        this.y = lerp(this.y, target.y, t);

        return this;
    }

    public dot(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public copy(vector: Vector2): this {
        return this.set(vector.x, vector.y);
    }

    public angleTo(vector: Vector2): Angle {
        const deltaX: number = this.x - vector.x;
        const deltaY: number = this.y - vector.y;

        const arcTangent: number = Math.abs(Math.atan2(deltaY, deltaX));

        return Angle.radians(arcTangent);
    }

    // static methods
    public static add(vectorA: Vector2, vectorB: Vector2): Vector2 {
        return vectorA.clone().add(vectorB);
    }

    public static subtract(vectorA: Vector2, vectorB: Vector2): Vector2 {
        return vectorA.clone().subtract(vectorB);
    }

    public static negate(vector: Vector2): Vector2 {
        return vector.clone().negate();
    }

    static lerp(a: Vector2, b: Vector2, t: number): Vector2 {
        return a.clone().lerp(b, t);
    }
}