import { BRAND_DOMINANT_HEX, BRAND_SECONDARY_HEX } from './apply-color-prefs';
import { rateColorPairContrast } from './contrast';
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
	caption: 'Brand purple + deep mint — WCAG AAA in light and dark.',
	dominantId: null,
	secondaryId: null,
	recommended: true,
};

/**
 * Curated tray pairs — only crayons that can earn AAA/AA.
 * Pastel yellows/greens wash out and are omitted on purpose.
 */
export const CURATED_PAIRINGS: readonly ColorPairing[] = [
	{
		id: 'plum-brick-red',
		label: 'Plum & Brick Red',
		caption: 'Deep purple fill with a warm red border.',
		dominantId: 'plum',
		secondaryId: 'brick-red',
	},
	{
		id: 'plum-blue-violet',
		label: 'Plum & Blue Violet',
		caption: 'Cool analogous pair with clear hue separation.',
		dominantId: 'plum',
		secondaryId: 'blue-violet',
	},
	{
		id: 'blue-violet-brick-red',
		label: 'Blue Violet & Brick Red',
		caption: 'Cool dominant with a warm border accent.',
		dominantId: 'blue-violet',
		secondaryId: 'brick-red',
	},
	{
		id: 'brick-red-plum',
		label: 'Brick Red & Plum',
		caption: 'Warm fill with a deep purple border.',
		dominantId: 'brick-red',
		secondaryId: 'plum',
	},
	{
		id: 'mahogany-blue-violet',
		label: 'Mahogany & Blue Violet',
		caption: 'Earth fill with a cool violet border.',
		dominantId: 'mahogany',
		secondaryId: 'blue-violet',
	},
	{
		id: 'red-violet-plum',
		label: 'Red Violet & Plum',
		caption: 'Jewel tones with clear separation.',
		dominantId: 'red-violet',
		secondaryId: 'plum',
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

function pairingHexes(pairing: ColorPairing): {
	dominantHex: string;
	secondaryHex: string;
} | null {
	if (pairing.dominantId == null && pairing.secondaryId == null) {
		return {
			dominantHex: BRAND_DOMINANT_HEX,
			secondaryHex: BRAND_SECONDARY_HEX,
		};
	}
	const { dominant, secondary } = resolvePairingColors(pairing);
	if (dominant == null || secondary == null) {
		return null;
	}
	return { dominantHex: dominant.hex, secondaryHex: secondary.hex };
}

/**
 * Only offer pairings that earn AAA or AA (WCAG AA+ classroom bar).
 * Brand is always included by {@link suggestPairings} and must itself be AAA.
 */
export function pairingPassesA11y(pairing: ColorPairing): boolean {
	const hexes = pairingHexes(pairing);
	if (hexes == null) {
		return false;
	}
	return (
		rateColorPairContrast(hexes.dominantHex, hexes.secondaryHex).level ===
		'pass'
	);
}

/**
 * Brand first, then curated pairs that pass AA+ grades.
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
