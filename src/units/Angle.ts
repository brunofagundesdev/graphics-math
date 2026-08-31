export class Angle {
    private constructor(
        public readonly radians: number
    ) { }

    public static radians(value: number): Angle {
        return new Angle(value);
    }

    public static degrees(value: number): Angle {
        return new Angle(value * Math.PI / 180);
    }

    public get degrees(): number {
        return this.radians * 180 / Math.PI;
    }

    public equals(angle: Angle): boolean {
        return this.radians === angle.radians;
    }

    public add(angle: Angle): Angle {
        return Angle.radians(this.radians + angle.radians);
    }

    public subtract(angle: Angle): Angle {
        return Angle.radians(this.radians - angle.radians);
    }

    public negate(): Angle {
        return Angle.radians(-this.radians);
    }

    public normalize(): Angle {
        let normalized: number = this.radians % (Math.PI * 2);

        if (normalized < 0) {
            normalized += (Math.PI * 2);
        }

        return new Angle(normalized);
    }

    // static methods
    
    public static zero(): Angle {
        return new Angle(0);
    }
}