import { lerp } from "../../interpolation/lerp";
import { Angle } from "../../units/Angle";
import { Matrix2 } from "../matrices/Matrix2";

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

    public transform(matrix: Matrix2, origin: Vector2 = Vector2.zero()): this {
        return this
            .subtract(origin)
            .applyMatrix(matrix)
            .add(origin);
    }

    public rotate(angle: Angle, origin: Vector2 = Vector2.zero()): this {
        return this.transform(Matrix2.rotation(angle), origin);
    }

    public scale(x: number, y: number, origin: Vector2 = Vector2.zero()) {
        return this.transform(Matrix2.scale(x, y), origin);
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

    public equals(vector: Vector2): boolean {
        return (
            vector.x === this.x &&
            vector.y === this.y
        );
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

    public applyMatrix(matrix: Matrix2): this {
        const x = this.x;
        const y = this.y;

        this.x = matrix.get(0, 0) * x + matrix.get(0, 1) * y;
        this.y = matrix.get(1, 0) * x + matrix.get(1, 1) * y;

        return this;
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

    public static lerp(a: Vector2, b: Vector2, t: number): Vector2 {
        return a.clone().lerp(b, t);
    }

    public static average(vectors: Vector2[]): Vector2 {
        const average: Vector2 = new Vector2(0, 0);
        if (vectors.length === 0)
            return average;

        for (const vector of vectors) {
            average.add(vector);
        }

        return average.divideScalar(vectors.length);
    }

    public static zero(): Vector2 {
        return new Vector2(0, 0);
    }
}