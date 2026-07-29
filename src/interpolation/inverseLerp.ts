export function inverseLerp(start: number, end: number, value: number): number {
    return (value - start) / (end - start);
}