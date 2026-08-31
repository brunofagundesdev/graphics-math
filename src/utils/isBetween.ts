interface BetweenOptions {
    inclusiveMin?: boolean;
    inclusiveMax?: boolean;
}

export function isBetween(
    value: number, a: number, b: number,
    { inclusiveMin = true, inclusiveMax = true }: BetweenOptions = {}
): Boolean {
    const min: number = Math.min(a, b);
    const max: number = Math.max(a, b);

    const isAboveMin: boolean = inclusiveMin ? value >= min : value > min;
    const isBelowMax: boolean = inclusiveMax ? value <= max : value < max;

    return isAboveMin && isBelowMax;
}
