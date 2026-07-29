import type { Angle } from "../../units/Angle";

export class EulerRotation {
    public constructor(
        public x: Angle,
        public y: Angle,
        public z: Angle
    ) { }
}