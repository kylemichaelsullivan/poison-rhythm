import { describe, expect, test } from 'bun:test';
import {
	assessCrayonContrast,
	CRAYOLA_64,
	CRAYOLA_TRAY_SIZE,
	CRAYOLA_TRAYS,
	contrastRatio,
	isCrayonId,
	pairingPassesA11y,
	pickOnColor,
	relativeLuminance,
	suggestPairings,
	validateAccentAgainstSurfaces,
	validateColorPair,
	WCAG_AA_TEXT,
	WCAG_AA_UI,
} from '../colors';

describe('crayola-64', () => {
	test('includes exactly 64 crayons with unique ids', () => {
		expect(CRAYOLA_64).toHaveLength(64);
		const ids = new Set(CRAYOLA_64.map((crayon) => crayon.id));
		expect(ids.size).toBe(64);
	});

	test('groups crayons into four portrait-stacked trays of 16', () => {
		expect(CRAYOLA_TRAYS).toHaveLength(4);
		expect(CRAYOLA_TRAY_SIZE).toBe(16);
		for (const tray of CRAYOLA_TRAYS) {
			expect(tray.crayons).toHaveLength(16);
		}
		const trayIds = CRAYOLA_TRAYS.flatMap((tray) =>
			tray.crayons.map((crayon) => crayon.id),
		);
		expect(trayIds).toEqual(CRAYOLA_64.map((crayon) => crayon.id));
	});

	test('isCrayonId accepts palette members only', () => {
		expect(isCrayonId('plum')).toBe(true);
		expect(isCrayonId('not-a-crayon')).toBe(false);
	});
});

describe('contrast', () => {
	test('black and white meet WCAG AAA-scale contrast', () => {
		expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
	});

	test('relative luminance of white and black', () => {
		expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
		expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
	});

	test('pickOnColor chooses the higher-contrast ink', () => {
		expect(pickOnColor('#783b82')).toBe('#faf9fc');
		expect(pickOnColor('#fce883')).toBe('#0d090e');
	});

	test('brand purple passes accent surface checks', () => {
		const result = validateAccentAgainstSurfaces('#783b82');
		expect(result.level).toBe('pass');
		expect(result.textRatio).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
	});

	test('pale yellow warns against light surfaces', () => {
		const result = validateAccentAgainstSurfaces('#fce883');
		expect(result.level).toBe('warn');
		expect(
			result.issues.some((issue) => issue.against === 'light surface'),
		).toBe(true);
	});

	test('near-identical pair warns', () => {
		const result = validateColorPair('#783b82', '#7a3d84');
		expect(result.level).toBe('warn');
		expect(result.pairRatio).toBeLessThan(WCAG_AA_UI);
	});

	test('assessCrayonContrast warns on weak role fills, not pair separation', () => {
		const weak = assessCrayonContrast('#ffffff', 'dominant');
		expect(weak.level).toBe('warn');
		expect(weak.summary?.length).toBeGreaterThan(0);

		const brandAlone = assessCrayonContrast('#783b82', 'dominant');
		expect(brandAlone.level).toBe('pass');
	});
});

describe('pairings', () => {
	test('suggestPairings leads with Brand', () => {
		const suggestions = suggestPairings();
		expect(suggestions[0]?.id).toBe('brand');
		expect(suggestions.length).toBeGreaterThan(1);
	});

	test('Brand pairing always passes', () => {
		expect(
			pairingPassesA11y({
				id: 'brand',
				label: 'Poison Rhythm',
				caption: 'Brand',
				dominantId: null,
				secondaryId: null,
			}),
		).toBe(true);
	});
});
