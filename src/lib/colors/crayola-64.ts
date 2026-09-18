/**
 * Classic Crayola 64-box palette (modern retail lineup).
 * Hex values follow commonly published Crayola website / Wikipedia depictions.
 */

export type CrayonId =
	| 'forest-green'
	| 'granny-smith-apple'
	| 'olive-green'
	| 'spring-green'
	| 'green-yellow'
	| 'yellow-green'
	| 'yellow'
	| 'goldenrod'
	| 'dandelion'
	| 'apricot'
	| 'peach'
	| 'yellow-orange'
	| 'orange'
	| 'red-orange'
	| 'scarlet'
	| 'melon'
	| 'brick-red'
	| 'red'
	| 'violet-red'
	| 'wild-strawberry'
	| 'magenta'
	| 'red-violet'
	| 'salmon'
	| 'tickle-me-pink'
	| 'carnation-pink'
	| 'mauvelous'
	| 'lavender'
	| 'orchid'
	| 'plum'
	| 'violet-purple'
	| 'wisteria'
	| 'purple-mountains-majesty'
	| 'white'
	| 'silver'
	| 'timberwolf'
	| 'gray'
	| 'black'
	| 'gold'
	| 'macaroni-and-cheese'
	| 'tan'
	| 'burnt-orange'
	| 'mahogany'
	| 'bittersweet'
	| 'chestnut'
	| 'burnt-sienna'
	| 'brown'
	| 'sepia'
	| 'raw-sienna'
	| 'tumbleweed'
	| 'blue-violet'
	| 'indigo'
	| 'blue'
	| 'cerulean'
	| 'cornflower'
	| 'pacific-blue'
	| 'cadet-blue'
	| 'blue-green'
	| 'periwinkle'
	| 'sky-blue'
	| 'turquoise-blue'
	| 'robins-egg-blue'
	| 'asparagus'
	| 'green'
	| 'sea-green';

export type CrayonColor = {
	id: CrayonId;
	name: string;
	hex: string;
};

/** Flat palette; tray grouping is `CRAYOLA_TRAYS` (four sleeves of 16). */
export const CRAYOLA_64: readonly CrayonColor[] = [
	// Tray 1 — greens & yellows
	{ id: 'forest-green', name: 'Forest Green', hex: '#5FA777' },
	{ id: 'granny-smith-apple', name: 'Granny Smith Apple', hex: '#9DE093' },
	{ id: 'olive-green', name: 'Olive Green', hex: '#B5B35C' },
	{ id: 'asparagus', name: 'Asparagus', hex: '#87A96B' },
	{ id: 'green', name: 'Green', hex: '#1CAC78' },
	{ id: 'sea-green', name: 'Sea Green', hex: '#9FE2BF' },
	{ id: 'spring-green', name: 'Spring Green', hex: '#ECEBBD' },
	{ id: 'green-yellow', name: 'Green-Yellow', hex: '#F1E788' },
	{ id: 'yellow-green', name: 'Yellow-Green', hex: '#C5E17A' },
	{ id: 'yellow', name: 'Yellow', hex: '#FCE883' },
	{ id: 'goldenrod', name: 'Goldenrod', hex: '#FCD667' },
	{ id: 'dandelion', name: 'Dandelion', hex: '#FDDB6D' },
	{ id: 'apricot', name: 'Apricot', hex: '#FDD9B5' },
	{ id: 'peach', name: 'Peach', hex: '#FFCBA4' },
	{ id: 'yellow-orange', name: 'Yellow-Orange', hex: '#FFAE42' },
	{ id: 'gold', name: 'Gold', hex: '#E7C697' },
	// Tray 2 — oranges, reds & pinks
	{ id: 'orange', name: 'Orange', hex: '#FF7538' },
	{ id: 'red-orange', name: 'Red-Orange', hex: '#FF5349' },
	{ id: 'scarlet', name: 'Scarlet', hex: '#FC2847' },
	{ id: 'melon', name: 'Melon', hex: '#FEBAAD' },
	{ id: 'brick-red', name: 'Brick Red', hex: '#C62D42' },
	{ id: 'red', name: 'Red', hex: '#EE204D' },
	{ id: 'mahogany', name: 'Mahogany', hex: '#CA3435' },
	{ id: 'chestnut', name: 'Chestnut', hex: '#B94E48' },
	{ id: 'violet-red', name: 'Violet-Red', hex: '#F7468A' },
	{ id: 'wild-strawberry', name: 'Wild Strawberry', hex: '#FF3399' },
	{ id: 'magenta', name: 'Magenta', hex: '#F653A6' },
	{ id: 'red-violet', name: 'Red-Violet', hex: '#BB3385' },
	{ id: 'salmon', name: 'Salmon', hex: '#FF91A4' },
	{ id: 'tickle-me-pink', name: 'Tickle Me Pink', hex: '#FC80A5' },
	{ id: 'carnation-pink', name: 'Carnation Pink', hex: '#FFAACC' },
	{ id: 'mauvelous', name: 'Mauvelous', hex: '#F091A9' },
	// Tray 3 — purples & blues
	{ id: 'lavender', name: 'Lavender', hex: '#FCB4D5' },
	{ id: 'orchid', name: 'Orchid', hex: '#E29CD2' },
	{ id: 'plum', name: 'Plum', hex: '#843179' },
	{ id: 'violet-purple', name: 'Violet (Purple)', hex: '#926EAE' },
	{ id: 'wisteria', name: 'Wisteria', hex: '#C9A0DC' },
	{
		id: 'purple-mountains-majesty',
		name: 'Purple Mountains’ Majesty',
		hex: '#8071B4',
	},
	{ id: 'blue-violet', name: 'Blue-Violet', hex: '#6456B7' },
	{ id: 'indigo', name: 'Indigo', hex: '#5D76CB' },
	{ id: 'blue', name: 'Blue', hex: '#1F75FE' },
	{ id: 'cerulean', name: 'Cerulean', hex: '#1DACD6' },
	{ id: 'pacific-blue', name: 'Pacific Blue', hex: '#009DC4' },
	{ id: 'blue-green', name: 'Blue-Green', hex: '#0D98BA' },
	{ id: 'cornflower', name: 'Cornflower', hex: '#93CCEA' },
	{ id: 'periwinkle', name: 'Periwinkle', hex: '#C5D0E6' },
	{ id: 'sky-blue', name: 'Sky Blue', hex: '#80DAEB' },
	{ id: 'turquoise-blue', name: 'Turquoise Blue', hex: '#77DDE7' },
	// Tray 4 — neutrals & earth
	{ id: 'robins-egg-blue', name: 'Robin’s Egg Blue', hex: '#00CCCC' },
	{ id: 'cadet-blue', name: 'Cadet Blue', hex: '#A9B2C3' },
	{ id: 'burnt-orange', name: 'Burnt Orange', hex: '#FF7034' },
	{ id: 'bittersweet', name: 'Bittersweet', hex: '#FE6F5E' },
	{ id: 'burnt-sienna', name: 'Burnt Sienna', hex: '#E97451' },
	{ id: 'raw-sienna', name: 'Raw Sienna', hex: '#D27D46' },
	{ id: 'tumbleweed', name: 'Tumbleweed', hex: '#DEA681' },
	{ id: 'tan', name: 'Tan', hex: '#D99A6C' },
	{ id: 'macaroni-and-cheese', name: 'Macaroni and Cheese', hex: '#FFB97B' },
	{ id: 'brown', name: 'Brown', hex: '#B4674D' },
	{ id: 'sepia', name: 'Sepia', hex: '#9E5B40' },
	{ id: 'white', name: 'White', hex: '#FFFFFF' },
	{ id: 'silver', name: 'Silver', hex: '#C9C0BB' },
	{ id: 'timberwolf', name: 'Timberwolf', hex: '#D9D6CF' },
	{ id: 'gray', name: 'Gray', hex: '#95918C' },
	{ id: 'black', name: 'Black', hex: '#000000' },
] as const;

export const CRAYOLA_TRAY_SIZE = 16;

export type CrayonTrayGroup = {
	id: string;
	label: string;
	crayons: readonly CrayonColor[];
};

/**
 * Four Crayola sleeves of 16. Physical box trays sit side-by-side (landscape);
 * UI stacks them in portrait. Each sleeve keeps a 2×8 face of squares.
 */
export const CRAYOLA_TRAYS: readonly CrayonTrayGroup[] = [
	{
		id: 'greens-yellows',
		label: 'Greens & Yellows',
		crayons: CRAYOLA_64.slice(0, 16),
	},
	{
		id: 'oranges-reds-pinks',
		label: 'Oranges, Reds & Pinks',
		crayons: CRAYOLA_64.slice(16, 32),
	},
	{
		id: 'purples-blues',
		label: 'Purples & Blues',
		crayons: CRAYOLA_64.slice(32, 48),
	},
	{
		id: 'neutrals-earth',
		label: 'Neutrals & Earth',
		crayons: CRAYOLA_64.slice(48, 64),
	},
] as const;

const crayonById = new Map(
	CRAYOLA_64.map((crayon) => [crayon.id, crayon] as const),
);

export const CRAYON_IDS = CRAYOLA_64.map((crayon) => crayon.id);

export function crayonByIdOrNull(
	id: string | null | undefined,
): CrayonColor | null {
	if (id == null) {
		return null;
	}
	return crayonById.get(id as CrayonId) ?? null;
}

export function isCrayonId(value: string): value is CrayonId {
	return crayonById.has(value as CrayonId);
}
