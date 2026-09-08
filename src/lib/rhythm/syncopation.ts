import { DOWN_BEATS, WEAK_BEATS } from './grid';
import type { PRNG } from './prng';

/** Placement bias driven by difficulty only. */
export function pickHitIndices(
	allowed: number[],
	hits: number,
	difficulty: number,
	rng: PRNG,
): number[] {
	if (hits <= 0) return [];
	if (hits >= allowed.length) return [...allowed];

	const downInAllowed = DOWN_BEATS.filter((i) => allowed.includes(i));
	const weakInAllowed = WEAK_BEATS.filter((i) => allowed.includes(i));

	if (difficulty === 1) {
		return rng.pickMany(downInAllowed, Math.min(hits, downInAllowed.length));
	}

	if (difficulty >= 4) {
		return rng.pickMany(allowed, hits);
	}

	const strongCount =
		difficulty === 2
			? Math.max(1, hits - rng.nextInt(0, 2))
			: rng.nextInt(Math.floor(hits / 2), Math.min(hits, 4));
	const weakCount = hits - strongCount;

	const selected = new Set<number>();
	for (const idx of rng.pickMany(
		downInAllowed,
		Math.min(strongCount, downInAllowed.length),
	)) {
		selected.add(idx);
	}

	const weakPool = weakInAllowed.filter((i) => !selected.has(i));
	for (const idx of rng.pickMany(
		weakPool,
		Math.min(weakCount, weakPool.length),
	)) {
		selected.add(idx);
	}

	while (selected.size < hits) {
		const pool = allowed.filter((i) => !selected.has(i));
		if (pool.length === 0) break;
		selected.add(rng.pick(pool));
	}

	return [...selected].sort((a, b) => a - b);
}
