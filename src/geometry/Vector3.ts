import { lerp } from "../interpolation/lerp";
import { Angle } from "../units/Angle";
import { clamp } from "../utils/clamp";
import { EulerRotation } from "./rotations/EulerRotation";

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

    public rotate(rotation: EulerRotation, pivot: Vector3 = new Vector3(0, 0, 0)): this {
        const x: number = this.x - pivot.x;
        const y: number = this.y - pivot.y;
        const z: number = this.z - pivot.z;

        const cosineX: number = Math.cos(rotation.x.radians);
        const sineX: number = Math.sin(rotation.x.radians);

        const cosineY: number = Math.cos(rotation.y.radians);
        const sineY: number = Math.sin(rotation.y.radians);

        const cosineZ: number = Math.cos(rotation.z.radians);
        const sineZ: number = Math.sin(rotation.z.radians);

        const x1: number = cosineZ * x - sineZ * y;
        const y1: number = sineZ * x + cosineZ * y;
        const z1: number = z;

        const x2: number = cosineY * x1 - sineY * z1;
        const y2: number = y1;
        const z2: number = sineY * x1 + cosineY * z1;

        const x3: number = x2;
        const z3: number = cosineX * z2 - sineX * y2;
        const y3: number = sineX * z2 + cosineX * y2;

        this.x = x3 + pivot.x;
        this.y = y3 + pivot.y;
        this.z = z3 + pivot.z;

        return this;
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

    static lerp(a: Vector3, b: Vector3, t: number): Vector3 {
        return a.clone().lerp(b, t);
    }
}