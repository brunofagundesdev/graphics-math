import { isBetween } from "../../utils/isBetween.js";

export abstract class Matrix {
    protected values: Float32Array;

    constructor(
        public readonly rows: number,
        public readonly columns: number,
        values?: Iterable<number>
    ) {
        this.values = values ? Float32Array.from(values) : new Float32Array(rows * columns);

        if (this.values.length !== rows * columns) {
            throw new Error(
                `Invalid matrix size. Expected ${rows * columns} values, received ${this.values.length}.`
            );
        }
    }

    protected index(row: number, column: number): number {
        return row * this.columns + column;
    }

    public get(row: number, column: number): number {
        this.checkBounds(row, column);

        return this.values[this.index(row, column)]!;
    }

    public set(row: number, column: number, value: number): this {
        this.checkBounds(row, column);

        this.values[this.index(row, column)] = value;

        return this;
    }

    public abstract determinant(): number;

    public transpose(): this {

        return this;
    }

    public add(matrix: this): this {
        for (let i = 0; i < this.values.length; i++) {
            this.values[i]! += matrix.values[i]!;
        }

        return this;
    }

    public subtract(matrix: this): this {
        for (let i = 0; i < this.values.length; i++) {
            this.values[i]! -= matrix.values[i]!;
        }

        return this;
    }

    public multiplyScalar(scalar: number): this {
        for (let i = 0; i < this.values.length; i++) {
            this.values[i]! *= scalar;
        }

        return this;
    }

    public divideScalar(scalar: number): this {
        for (let i = 0; i < this.values.length; i++) {
            this.values[i]! /= scalar;
        }

        return this;
    }

    public multiply(matrix: this): this {
        const result = new Float32Array(this.values.length);

        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                let sum = 0;

                for (let i = 0; i < this.columns; i++) {
                    sum += this.values[this.index(row, i)]! * matrix.values[matrix.index(i, column)]!;
                }

                result[this.index(row, column)] = sum;
            }
        }

        this.values = result;

        return this;
    }

    public equals(matrix: Matrix): boolean {
        if (!this.isSameSize(matrix)) {
            return false;
        }

        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] !== matrix.values[i]) {
                return false;
            }
        }

        return true;
    }

    public copy(matrix: this): this {
        this.values.set(matrix.values);

        return this;
    }


    public fill(value: number): this {
        this.values.fill(value);

        return this;
    }

    public isSameSize(matrix: Matrix): boolean {
        return (
            this.rows === matrix.rows &&
            this.columns === matrix.columns
        );
    }

    protected checkBounds(row: number, column: number): void {
        if (
            !isBetween(row, 0, this.rows, { inclusiveMax: false }) ||
            !isBetween(column, 0, this.columns, { inclusiveMax: false })
        ) {
            throw new Error(
                `Matrix index out of bounds (${row}, ${column}). Matrix size is ${this.rows}x${this.columns}.`
            );
        }
    }

}