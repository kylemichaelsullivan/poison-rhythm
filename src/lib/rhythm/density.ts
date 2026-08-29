import { hitRangeForLevel } from '@/lib/difficulty-levels';
import type { PRNG } from './prng';

export function computeHitCount(
	difficulty: number,
	rng: PRNG,
	allowedSlots = 16,
): number {
	const [minHits, maxHits] = hitRangeForLevel(difficulty, allowedSlots);
	return rng.nextInt(minHits, maxHits);
}
