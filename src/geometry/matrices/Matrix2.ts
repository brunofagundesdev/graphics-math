import { Angle } from "../../units/Angle.js";
import { Vector2 } from "../vectors/Vector2.js";
import { Matrix } from "./Matrix.js";

export class Matrix2 extends Matrix {
    public constructor(
        values?: Iterable<number>
    ) {
        super(2, 2, values);
    }

    public determinant(): number {
        const a = this.values[0]!,
            b = this.values[1]!,
            c = this.values[2]!,
            d = this.values[3]!;

        return (a * d) - (b * c);
    }

    public trace() {
        const a = this.values[0]!,
            d = this.values[3]!;

        return a * d;
    }

    public invert(): this {
        const determinant: number = this.determinant();

        if (determinant === 0) {
            throw new Error("Matrix is not invertible.");
        }

        const a = this.values[0]!,
            b = this.values[1]!,
            c = this.values[2]!,
            d = this.values[3]!;

        this.values[0] = d;
        this.values[1] = -b;
        this.values[2] = -c;
        this.values[3] = a;

        this.divideScalar(determinant);

        return this;
    }

    public clone(): Matrix2 {
        return new Matrix2(this.values);
    }

    public override multiply(matrix: Matrix2): this {
        const a = this.values;
        const b = matrix.values;

        const a11 = a[0]!,
            a12 = a[1]!,
            a21 = a[2]!,
            a22 = a[3]!;

        const b11 = b[0]!,
            b12 = b[1]!,
            b21 = b[2]!,
            b22 = b[3]!;

        a[0] = a11 * b11 + a12 * b21;
        a[1] = a11 * b12 + a12 * b22;
        a[2] = a21 * b11 + a22 * b21;
        a[3] = a21 * b12 + a22 * b22;

        return this;
    }

    public multiplyVector(vector: Vector2): Vector2 {
        const a = this.values[0]!,
            b = this.values[1]!,
            c = this.values[2]!,
            d = this.values[3]!;

        return new Vector2(
            a * vector.x + b * vector.y,
            c * vector.x + d * vector.y
        );
    }

    public static add(matrixA: Matrix2, matrixB: Matrix2): Matrix2 {
        return matrixA.clone().add(matrixB);
    }

    public static subtract(matrixA: Matrix2, matrixB: Matrix2): Matrix2 {
        return matrixA.clone().subtract(matrixB);
    }

    public static multiply(matrixA: Matrix2, matrixB: Matrix2): Matrix2 {
        return matrixA.clone().multiply(matrixB);
    }

    static multiplyVector(matrix: Matrix2, vector: Vector2): Vector2 {
        return vector.clone().applyMatrix(matrix);
    }

    public static identity(): Matrix2 {
        return new Matrix2([
            1, 0,
            0, 1
        ]);
    }

    public static rotation(angle: Angle): Matrix2 {
        const cosine = Math.cos(angle.radians);
        const sine = Math.sin(angle.radians);

        return new Matrix2([
            cosine, -sine,
            sine, cosine
        ]);
    }

    public static scale(x: number, y: number = x): Matrix2 {
        return new Matrix2([
            x, 0,
            0, y
        ]);
    }

    public static zero(): Matrix2 {
        return new Matrix2();
    }
}