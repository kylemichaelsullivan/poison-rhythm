import { describe, expect, test } from 'bun:test';
import {
	assessCrayonContrast,
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
	CRAYOLA_64,
	CRAYOLA_TRAY_SIZE,
	CRAYOLA_TRAYS,
	contrastRatio,
	gradeFromRatio,
	isCrayonId,
	pairingPassesA11y,
	pickOnColor,
	rateAccentAgainstPartner,
	rateColorPairContrast,
	rateCrayonContrast,
	relativeLuminance,
	suggestPairings,
	validateAccentAgainstSurfaces,
	validateColorPair,
	WCAG_AA_TEXT,
	WCAG_AA_UI,
	WCAG_AAA_TEXT,
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

	test('gradeFromRatio follows WCAG 2.2 thresholds', () => {
		expect(gradeFromRatio(WCAG_AAA_TEXT)).toBe('A');
		expect(gradeFromRatio(WCAG_AA_TEXT)).toBe('B');
		expect(gradeFromRatio(WCAG_AA_UI)).toBe('C');
		expect(gradeFromRatio(2.9)).toBe('F');
	});

	test('rateColorPairContrast grades brand high and pale pairs low', () => {
		const brand = rateColorPairContrast('#783b82', '#246028');
		expect(brand.grade).toBe('A');
		expect(brand.level).toBe('pass');

		const pale = rateColorPairContrast('#fce883', '#ffffff');
		expect(pale.grade === 'C' || pale.grade === 'F').toBe(true);
		expect(pale.level).toBe('warn');
	});

	test('rateAccentAgainstPartner grades candidate vs partner color', () => {
		const strong = rateAccentAgainstPartner('#783b82', '#faf9fc');
		expect(strong.grade).toBe('A');

		const weak = rateAccentAgainstPartner('#783b82', '#7a3d84');
		expect(weak.grade).toBe('F');
	});

	test('rateCrayonContrast scores dominant vs secondary differently', () => {
		const whiteDominant = rateCrayonContrast('#ffffff', 'dominant');
		expect(whiteDominant.grade).toBe('F');

		const brandDominant = rateCrayonContrast('#783b82', 'dominant');
		expect(brandDominant.grade).toBe('A');

		const mintSecondary = rateCrayonContrast('#246028', 'secondary');
		expect(mintSecondary.grade).toBe('A');
		expect(mintSecondary.level).toBe('pass');
	});
});

describe('pairings', () => {
	test('suggestPairings leads with Brand', () => {
		const suggestions = suggestPairings();
		expect(suggestions[0]?.id).toBe('brand');
		expect(suggestions.length).toBeGreaterThan(1);
	});

	test('Brand pairing always passes and is grade A', () => {
		expect(
			pairingPassesA11y({
				id: 'brand',
				label: 'Poison Rhythm',
				caption: 'Brand',
				dominantId: null,
				secondaryId: null,
			}),
		).toBe(true);
		const brand = rateColorPairContrast(
			BRAND_DOMINANT_HEX,
			BRAND_SECONDARY_HEX,
		);
		expect(brand.grade).toBe('A');
	});

	test('curated suggestions only include AA+ grades', () => {
		for (const pairing of suggestPairings().slice(1)) {
			expect(pairingPassesA11y(pairing)).toBe(true);
		}
	});
});
