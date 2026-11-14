/** Percent along the thumb travel path for a value in `[min, max]`. */
export function rangeTickOffsetPercent(
	value: number,
	min: number,
	max: number,
): number {
	const span = max - min;
	if (span <= 0) {
		return 0;
	}
	return ((value - min) / span) * 100;
}

/** Every integer from `min` through `max` inclusive. */
export function inclusiveRangeTicks(min: number, max: number): number[] {
	if (max < min) {
		return [];
	}
	return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}
