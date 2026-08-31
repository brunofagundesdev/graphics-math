import { Vector4 } from "../vectors/Vector4.js";
import { Matrix } from "./Matrix.js";
import { Matrix3 } from "./Matrix3.js";

export class Matrix4 extends Matrix {
    constructor(
        values?: Iterable<number>
    ) {
        super(4, 4, values);
    }

    public determinant(): number {
        let determinant: number = 0;
        const row = 0;
        for (let column = 0; column < this.columns; column++) {
            determinant += this.cofactor(row, column) * this.get(row, column);
        }

        return determinant;
    }

    public clone() {
        return new Matrix4(this.values);
    }

    public invert(): Matrix4 {
        const determinant: number = this.determinant();

        if (determinant === 0) {
            throw new Error("Matrix is not invertible.");
        }

        return this.adjunct().divideScalar(this.determinant());
    }

    public adjunct(): Matrix4 {
        return this.cofactorMatrix().transpose();
    }

    public cofactorMatrix(): Matrix4 {
        const result = this.clone();
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                result.set(
                    row, column, this.cofactor(row, column)
                );
            }
        }

        return result;
    }

    public cofactor(row: number, column: number): number {
        const sign = 1 - (((row + column) % 2) * 2);

        return sign * this.minor(row, column).determinant();
    }

    public minor(rowToExclude: number, columnToExclude: number): Matrix3 {
        const values: number[] = [];

        for (let row = 0; row < this.rows; row++) {
            if (row === rowToExclude) continue;

            for (let column = 0; column < this.columns; column++) {
                if (column === columnToExclude) continue;
                values.push(this.get(row, column));
            }
        }

        return new Matrix3(values);
    }

    // static methods

    public static add(matrixA: Matrix4, matrixB: Matrix4): Matrix4 {
        return matrixA.clone().add(matrixB);
    }

    public static subtract(matrixA: Matrix4, matrixB: Matrix4): Matrix4 {
        return matrixA.clone().subtract(matrixB);
    }

    public static multiply(matrixA: Matrix4, matrixB: Matrix4): Matrix4 {
        return matrixA.clone().multiply(matrixB);
    }

    public static multiplyVector(matrix: Matrix4, vector: Vector4): Vector4 {
        return vector.clone().applyMatrix(matrix);
    }

    public static identity(): Matrix4 {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    public static scale(x: number, y: number = x, z: number = x, w: number = x): Matrix4 {
        return new Matrix4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, w
        ]);
    }

    public static zero(): Matrix4 {
        return new Matrix4();
    }
}