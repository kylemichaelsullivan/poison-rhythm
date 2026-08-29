export type PRNG = {
	next: () => number;
	nextInt: (min: number, max: number) => number;
	pick: <T>(arr: readonly T[]) => T;
	pickMany: <T>(arr: readonly T[], count: number) => T[];
	shuffle: <T>(arr: readonly T[]) => T[];
};

function mulberry32(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function createPRNG(seed: number): PRNG {
	const next = mulberry32(seed);

	const nextInt = (min: number, max: number): number => {
		return Math.floor(next() * (max - min + 1)) + min;
	};

	const pick = <T>(arr: readonly T[]): T => {
		if (arr.length === 0) {
			throw new Error('Cannot pick from empty array');
		}
		return arr[nextInt(0, arr.length - 1)];
	};

	const pickMany = <T>(arr: readonly T[], count: number): T[] => {
		const copy = shuffle([...arr]);
		return copy.slice(0, Math.min(count, copy.length));
	};

	const shuffle = <T>(arr: readonly T[]): T[] => {
		const copy = [...arr];
		for (let i = copy.length - 1; i > 0; i -= 1) {
			const j = nextInt(0, i);
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	};

	return { next, nextInt, pick, pickMany, shuffle };
}

export function randomSeed(): number {
	return Math.floor(Math.random() * 2 ** 31);
}
