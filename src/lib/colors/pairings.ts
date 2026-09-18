import { validateAccentAgainstSurfaces, validateColorPair } from './contrast';
import {
	type CrayonColor,
	type CrayonId,
	crayonByIdOrNull,
} from './crayola-64';

export type ColorPairing = {
	id: string;
	label: string;
	caption: string;
	/** null = Poison Rhythm brand defaults (CSS tokens). */
	dominantId: CrayonId | null;
	secondaryId: CrayonId | null;
	recommended?: boolean;
};

export const BRAND_PAIRING: ColorPairing = {
	id: 'brand',
	label: 'Poison Rhythm',
	caption: 'Brand purple and mint — recommended for classrooms.',
	dominantId: null,
	secondaryId: null,
	recommended: true,
};

/** Curated complementary / analogous pairs from the 64 tray. */
export const CURATED_PAIRINGS: readonly ColorPairing[] = [
	{
		id: 'plum-sea-green',
		label: 'Plum & Sea Green',
		caption: 'Close to brand: cool purple with a soft green border.',
		dominantId: 'plum',
		secondaryId: 'sea-green',
	},
	{
		id: 'plum-goldenrod',
		label: 'Plum & Goldenrod',
		caption: 'Deep purple with a warm sunny secondary.',
		dominantId: 'plum',
		secondaryId: 'goldenrod',
	},
	{
		id: 'blue-violet-sea-green',
		label: 'Blue-Violet & Sea Green',
		caption: 'Cool complementary pair with clear separation.',
		dominantId: 'blue-violet',
		secondaryId: 'sea-green',
	},
	{
		id: 'indigo-goldenrod',
		label: 'Indigo & Goldenrod',
		caption: 'Deep dominant with a sunny border.',
		dominantId: 'indigo',
		secondaryId: 'goldenrod',
	},
	{
		id: 'brick-red-granny',
		label: 'Brick Red & Granny Smith',
		caption: 'Warm dominant with a fresh green secondary.',
		dominantId: 'brick-red',
		secondaryId: 'granny-smith-apple',
	},
	{
		id: 'blue-yellow',
		label: 'Blue & Yellow',
		caption: 'Classic high-energy complementary contrast.',
		dominantId: 'blue',
		secondaryId: 'yellow',
	},
];

export function resolvePairingColors(pairing: ColorPairing): {
	dominant: CrayonColor | null;
	secondary: CrayonColor | null;
} {
	return {
		dominant: crayonByIdOrNull(pairing.dominantId),
		secondary: crayonByIdOrNull(pairing.secondaryId),
	};
}

export function pairingPassesA11y(pairing: ColorPairing): boolean {
	if (pairing.dominantId == null && pairing.secondaryId == null) {
		return true;
	}

	const { dominant, secondary } = resolvePairingColors(pairing);
	if (dominant == null || secondary == null) {
		return false;
	}

	// Dominant must work as a primary fill; secondary mainly needs separation as a border.
	const dominantOk =
		validateAccentAgainstSurfaces(dominant.hex).level === 'pass';
	const pairOk =
		validateColorPair(dominant.hex, secondary.hex).level === 'pass';
	return dominantOk && pairOk;
}

/**
 * Brand first, then curated pairs that pass AA checks.
 * Always keeps Brand even if somehow flagged.
 */
export function suggestPairings(): ColorPairing[] {
	const curated = CURATED_PAIRINGS.filter(pairingPassesA11y);
	return [BRAND_PAIRING, ...curated];
}

export function pairingMatchesSelection(
	pairing: ColorPairing,
	dominantId: CrayonId | null,
	secondaryId: CrayonId | null,
): boolean {
	return (
		pairing.dominantId === dominantId && pairing.secondaryId === secondaryId
	);
}
