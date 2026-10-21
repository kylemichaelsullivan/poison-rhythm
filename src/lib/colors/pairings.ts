import {
	type AccentColorId,
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
} from './apply-color-prefs';
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
	caption: 'Purple and a green complement.',
	dominantId: null,
	secondaryId: null,
	recommended: true,
};

/**
 * Curated pairs at 7:1 or better (grade A) across hue families.
 * Only Black against a light crayon clears that bar in this tray.
 */
export const CURATED_PAIRINGS: readonly ColorPairing[] = [
	{
		id: 'yellow-black',
		label: 'Yellow & Black',
		caption: 'Yellow fill, black border.',
		dominantId: 'yellow',
		secondaryId: 'black',
	},
	{
		id: 'black-sea-green',
		label: 'Black & Sea Green',
		caption: 'Black fill, green border.',
		dominantId: 'black',
		secondaryId: 'sea-green',
	},
	{
		id: 'sky-blue-black',
		label: 'Sky Blue & Black',
		caption: 'Sky blue fill, black border.',
		dominantId: 'sky-blue',
		secondaryId: 'black',
	},
	{
		id: 'black-orange',
		label: 'Black & Orange',
		caption: 'Black fill, orange border.',
		dominantId: 'black',
		secondaryId: 'orange',
	},
	{
		id: 'carnation-pink-black',
		label: 'Carnation Pink & Black',
		caption: 'Pink fill, black border.',
		dominantId: 'carnation-pink',
		secondaryId: 'black',
	},
	{
		id: 'black-cerulean',
		label: 'Black & Cerulean',
		caption: 'Black fill, cerulean border.',
		dominantId: 'black',
		secondaryId: 'cerulean',
	},
	{
		id: 'wisteria-black',
		label: 'Wisteria & Black',
		caption: 'Violet fill, black border.',
		dominantId: 'wisteria',
		secondaryId: 'black',
	},
	{
		id: 'black-burnt-sienna',
		label: 'Black & Burnt Sienna',
		caption: 'Black fill, earth border.',
		dominantId: 'black',
		secondaryId: 'burnt-sienna',
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
 * Curated pairs must be grade A (7:1 between Dominant and Secondary).
 * Brand is listed first by {@link suggestPairings} as the product default.
 */
export function pairingPassesA11y(pairing: ColorPairing): boolean {
	const hexes = pairingHexes(pairing);
	if (hexes == null) {
		return false;
	}
	return (
		rateColorPairContrast(hexes.dominantHex, hexes.secondaryHex).grade === 'A'
	);
}

/**
 * Brand first, then curated pairs at 7:1 or better.
 */
export function suggestPairings(): ColorPairing[] {
	const curated = CURATED_PAIRINGS.filter(pairingPassesA11y);
	return [BRAND_PAIRING, ...curated];
}

/** Static curated list — safe to reuse across mounts (no runtime prefs). */
export const SUGGESTED_PAIRINGS: readonly ColorPairing[] = suggestPairings();

export function pairingMatchesSelection(
	pairing: ColorPairing,
	dominantId: AccentColorId,
	secondaryId: AccentColorId,
): boolean {
	return (
		pairing.dominantId === dominantId && pairing.secondaryId === secondaryId
	);
}
