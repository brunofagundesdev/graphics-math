import { lerp } from "../../interpolation/lerp.js";
import { Angle } from "../../units/Angle.js";
import { clamp } from "../../utils/clamp.js";
import { Matrix4 } from "../matrices/Matrix4.js";

export class Vector4 {
    public constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number,
    ) { }

    public set(x: number, y: number, z: number, w: number): this {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    }

    public add(vector: Vector4): this {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        this.w += vector.w;

        return this;
    }

    public subtract(vector: Vector4): this {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        this.w -= vector.w;

        return this;
    }

    public multiplyScalar(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;

        return this;
    }

    public divideScalar(scalar: number): this {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        this.w /= scalar;

        return this;
    }

    public perspectiveDivide(): this {
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;

        this.w = 1;

        return this;
    }

    public transform(matrix: Matrix4, origin: Vector4 = Vector4.zero()): this {
        return this.subtract(origin).applyMatrix(matrix).add(origin);
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    public distanceTo(vector: Vector4): number {
        return Math.sqrt(this.distanceToSquared(vector));
    }

    public distanceToSquared(vector: Vector4): number {
        const deltaX: number = this.x - vector.x;
        const deltaY: number = this.y - vector.y;
        const deltaZ: number = this.z - vector.z;
        const deltaW: number = this.w - vector.w;

        return deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ + deltaW * deltaW;
    }

    public normalize(): this {
        const length: number = this.length();

        if (length === 0) return this;

        this.divideScalar(length);

        return this;
    }

    public dot(vector: Vector4): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
    }

    public negate(): this {
        return this.multiplyScalar(-1);
    }

    public equals(vector: Vector4): boolean {
        return (
            vector.x === this.x && vector.y === this.y && vector.z === this.z && vector.w === this.w
        );
    }

    public lerp(target: Vector4, t: number): this {
        this.x = lerp(this.x, target.x, t);
        this.y = lerp(this.y, target.y, t);
        this.z = lerp(this.z, target.z, t);
        this.w = lerp(this.w, target.w, t);

        return this;
    }

    public clone(): Vector4 {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    public copy(vector: Vector4): this {
        return this.set(vector.x, vector.y, vector.z, vector.w);
    }

    public angleTo(vector: Vector4): Angle {
        const denominator: number = this.length() * vector.length();
        if (denominator === 0) return Angle.radians(0);

        const cosineAlpha: number = clamp(this.dot(vector) / denominator, -1, 1);
        const arcCosine: number = Math.acos(cosineAlpha);

        return Angle.radians(arcCosine);
    }

    public applyMatrix(matrix: Matrix4): this {
        const x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;

        this.x =
            matrix.get(0, 0) * x +
            matrix.get(0, 1) * y +
            matrix.get(0, 2) * z +
            matrix.get(0, 3) * w;
        this.y =
            matrix.get(1, 0) * x +
            matrix.get(1, 1) * y +
            matrix.get(1, 2) * z +
            matrix.get(1, 3) * w;
        this.z =
            matrix.get(2, 0) * x +
            matrix.get(2, 1) * y +
            matrix.get(2, 2) * z +
            matrix.get(2, 3) * w;
        this.w =
            matrix.get(3, 0) * x +
            matrix.get(3, 1) * y +
            matrix.get(3, 2) * z +
            matrix.get(3, 3) * w;

        return this;
    }

    // static methods

    public static point(x: number, y: number, z: number) {
        return new Vector4(x, y, z, 1);
    }

    public static direction(x: number, y: number, z: number) {
        return new Vector4(x, y, z, 0);
    }

    public static add(vectorA: Vector4, vectorB: Vector4): Vector4 {
        return vectorA.clone().add(vectorB);
    }

    public static subtract(vectorA: Vector4, vectorB: Vector4): Vector4 {
        return vectorA.clone().subtract(vectorB);
    }

    public static negate(vector: Vector4): Vector4 {
        return vector.clone().negate();
    }

    public static lerp(a: Vector4, b: Vector4, t: number): Vector4 {
        return a.clone().lerp(b, t);
    }

    public static average(vectors: Vector4[]): Vector4 {
        const average: Vector4 = new Vector4(0, 0, 0, 0);
        if (vectors.length === 0) return average;

        for (const vector of vectors) {
            average.add(vector);
        }

        return average.divideScalar(vectors.length);
    }

    public static zero(): Vector4 {
        return new Vector4(0, 0, 0, 0);
    }
}
