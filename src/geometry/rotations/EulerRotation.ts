import { Angle } from "../../units/Angle.js";

export class EulerRotation {
    constructor(
        public x: Angle,
        public y: Angle,
        public z: Angle
    ) {}

    public set(x: Angle, y: Angle, z: Angle): this {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    public copy(rotation: EulerRotation): this {
        return this.set(
            rotation.x,
            rotation.y,
            rotation.z
        );
    }

    public clone(): EulerRotation {
        return new EulerRotation(
            this.x,
            this.y,
            this.z
        );
    }

    public equals(rotation: EulerRotation): boolean {
        return this.x.equals(rotation.x)
            && this.y.equals(rotation.y)
            && this.z.equals(rotation.z);
    }

    public add(rotation: EulerRotation): this {
        this.x = this.x.add(rotation.x);
        this.y = this.y.add(rotation.y);
        this.z = this.z.add(rotation.z);

        return this;
    }

    public subtract(rotation: EulerRotation): this {
        this.x = this.x.subtract(rotation.x);
        this.y = this.y.subtract(rotation.y);
        this.z = this.z.subtract(rotation.z);

        return this;
    }

    public negate(): this {
        this.x = this.x.negate();
        this.y = this.y.negate();
        this.z = this.z.negate();

        return this;
    }

    static zero(): EulerRotation {
        return new EulerRotation(
            Angle.radians(0),
            Angle.radians(0),
            Angle.radians(0)
        );
    }
}