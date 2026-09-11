import { Angle } from "../../units/Angle.js";
import { EulerRotation } from "../rotations/EulerRotation.js";
import { Vector3 } from "../vectors/Vector3.js";
import { Matrix } from "./Matrix.js";
import { Matrix2 } from "./Matrix2.js";

export class Matrix3 extends Matrix {
    public constructor(
        values?: Iterable<number>
    ) {
        super(3, 3, values);
    }

    public clone(): Matrix3 {
        return new Matrix3(this.values);
    }

    public determinant(): number {
        const values = this.values;

        const a = values[0]!,
            b = values[1]!,
            c = values[2]!,
            d = values[3]!,
            e = values[4]!,
            f = values[5]!,
            g = values[6]!,
            h = values[7]!,
            i = values[8]!;

        const principalTrace = (a * e * i) + (b * f * g) + (c * d * h);
        const secondaryTrace = (c * e * g) + (a * f * h) + (b * d * i);

        return principalTrace - secondaryTrace;
    }

    public trace(): number {
        const values = this.values;

        const a = values[0]!,
            b = values[1]!,
            c = values[2]!,
            d = values[3]!,
            e = values[4]!,
            f = values[5]!,
            g = values[6]!,
            h = values[7]!,
            i = values[8]!;

        return (a * e * i) + (b * f * g) + (c * d * h);
    }

    public invert(): Matrix3 {
        const determinant: number = this.determinant();

        if (determinant === 0) {
            throw new Error("Matrix is not invertible.");
        }

        return this.adjunct().divideScalar(this.determinant());
    }

    public adjunct(): Matrix3 {
        return this.cofactorMatrix().transpose();
    }

    public cofactorMatrix(): Matrix3 {
        const result = this.clone();
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                result.set(
                    row, column,
                    this.cofactor(row, column)
                );
            }
        }

        return result;
    }

    public cofactor(row: number, column: number): number {
        const sign = (row + column) % 2 === 0 ? 1 : -1;

        return sign * this.minor(row, column).determinant();
    }

    public minor(rowToExclude: number, columnToExclude: number): Matrix2 {
        const values: number[] = [];

        for (let row = 0; row < this.rows; row++) {
            if (row === rowToExclude) continue;

            for (let column = 0; column < this.columns; column++) {
                if (column === columnToExclude) continue;
                values.push(this.get(row, column));
            }
        }

        return new Matrix2(values);
    }

    // static methods

    public static add(matrixA: Matrix3, matrixB: Matrix3): Matrix3 {
        return matrixA.clone().add(matrixB);
    }

    public static subtract(matrixA: Matrix3, matrixB: Matrix3): Matrix3 {
        return matrixA.clone().subtract(matrixB);
    }

    public static multiply(matrixA: Matrix3, matrixB: Matrix3): Matrix3 {
        return matrixA.clone().multiply(matrixB);
    }

    static multiplyVector(matrix: Matrix3, vector: Vector3): Vector3 {
        return vector.clone().applyMatrix(matrix);
    }

    public static identity(): Matrix3 {
        return new Matrix3([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }

    public static rotation(rotation: EulerRotation) {
        return Matrix3
            .rotationZ(rotation.z)
            .multiply(Matrix3.rotationY(rotation.y))
            .multiply(Matrix3.rotationX(rotation.x));
    }

    public static rotationX(angle: Angle): Matrix3 {
        const cosine = Math.cos(angle.radians);
        const sine = Math.sin(angle.radians);

        return new Matrix3([
            1, 0, 0,
            0, cosine, -sine,
            0, sine, cosine
        ]);
    }

    public static rotationY(angle: Angle): Matrix3 {
        const cosine = Math.cos(angle.radians);
        const sine = Math.sin(angle.radians);

        return new Matrix3([
            cosine, 0, sine,
            0, 1, 0,
            -sine, 0, cosine
        ]);
    }

    public static rotationZ(angle: Angle): Matrix3 {
        const cosine = Math.cos(angle.radians);
        const sine = Math.sin(angle.radians);

        return new Matrix3([
            cosine, -sine, 0,
            sine, cosine, 0,
            0, 0, 1
        ]);
    }

    public static scale(x: number, y: number = x, z: number = x): Matrix3 {
        return new Matrix3([
            x, 0, 0,
            0, y, 0,
            0, 0, z
        ]);
    }

    public static zero(): Matrix3 {
        return new Matrix3();
    }
}