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
}