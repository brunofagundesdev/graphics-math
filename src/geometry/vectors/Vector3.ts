import { lerp } from "../../interpolation/lerp.js";
import { Angle } from "../../units/Angle.js";
import { clamp } from "../../utils/clamp.js";
import { Matrix3 } from "../matrices/Matrix3.js";
import { EulerRotation } from "../rotations/EulerRotation.js";

export class Vector3 {
    public constructor(
        public x: number,
        public y: number,
        public z: number
    ) { }

    public set(x: number, y: number, z: number): this {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    public add(vector: Vector3): this {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;

        return this;
    }

    public subtract(vector: Vector3): this {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;

        return this;
    }

    public multiplyScalar(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    }

    public divideScalar(scalar: number): this {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;

        return this;
    }

    public transform(matrix: Matrix3, origin: Vector3 = Vector3.zero()): this {
        return this
            .subtract(origin)
            .applyMatrix(matrix)
            .add(origin);
    }

    public rotate(rotation: EulerRotation, origin: Vector3 = Vector3.zero()): this {
        return this.transform(Matrix3.rotation(rotation), origin);
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public lengthSquared(): number {
        return (
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );
    }

    public distanceTo(vector: Vector3): number {
        return Math.sqrt(this.distanceToSquared(vector));
    }

    public distanceToSquared(vector: Vector3): number {
        const deltaX: number = this.x - vector.x;
        const deltaY: number = this.y - vector.y;
        const deltaZ: number = this.z - vector.z;

        return (
            deltaX * deltaX +
            deltaY * deltaY +
            deltaZ * deltaZ
        );
    }

    public normalize(): this {
        const length: number = this.length();

        if (length === 0)
            return this;

        this.divideScalar(length);

        return this;
    }

    public dot(vector: Vector3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    public cross(vector: Vector3): Vector3 {
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        )
    }

    public negate(): this {
        return this.multiplyScalar(-1);
    }

    public equals(vector: Vector3): boolean {
        return (
            vector.x === this.x &&
            vector.y === this.y &&
            vector.z === this.z
        );
    }

    public lerp(target: Vector3, t: number): this {
        this.x = lerp(this.x, target.x, t);
        this.y = lerp(this.y, target.y, t);
        this.z = lerp(this.z, target.z, t);

        return this;
    }

    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    public copy(vector: Vector3): this {
        return this.set(vector.x, vector.y, vector.z);
    }

    public angleTo(vector: Vector3): Angle {
        const denominator: number = this.length() * vector.length();
        if (denominator === 0) return Angle.radians(0);

        const cosineAlpha: number = clamp(this.dot(vector) / denominator, -1, 1);
        const arcCosine: number = Math.acos(cosineAlpha);

        return Angle.radians(arcCosine);
    }

    public applyMatrix(matrix: Matrix3): this {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        this.x =
            matrix.get(0, 0) * x +
            matrix.get(0, 1) * y +
            matrix.get(0, 2) * z;
        this.y =
            matrix.get(1, 0) * x +
            matrix.get(1, 1) * y +
            matrix.get(1, 2) * z;
        this.z =
            matrix.get(2, 0) * x +
            matrix.get(2, 1) * y +
            matrix.get(2, 2) * z;

        return this;
    }

    // static methods
    public static add(vectorA: Vector3, vectorB: Vector3): Vector3 {
        return vectorA.clone().add(vectorB);
    }

    public static subtract(vectorA: Vector3, vectorB: Vector3): Vector3 {
        return vectorA.clone().subtract(vectorB);
    }

    public static negate(vector: Vector3): Vector3 {
        return vector.clone().negate();
    }

    public static lerp(a: Vector3, b: Vector3, t: number): Vector3 {
        return a.clone().lerp(b, t);
    }

    public static average(vectors: Vector3[]): Vector3 {
        const average: Vector3 = new Vector3(0, 0, 0);
        if (vectors.length === 0)
            return average;
        
        for (const vector of vectors) {
            average.add(vector);
        }

        return average.divideScalar(vectors.length);
    }

    public static zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }
}