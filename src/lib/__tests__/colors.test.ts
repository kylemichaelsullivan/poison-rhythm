import { describe, expect, test } from 'bun:test';
import {
	assessCrayonContrast,
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
	CRAYOLA_64,
	CRAYOLA_TRAY_SIZE,
	CRAYOLA_TRAYS,
	contrastRatio,
	deltaE76,
	gradeFromRatio,
	isCrayonId,
	pairingPassesA11y,
	pickOnColor,
	rateColorPairContrast,
	rateCrayonContrast,
	ratePairIfRolePicked,
	ratePairSeparation,
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

	test('near-identical pair warns via ΔE even when luminance is close', () => {
		const result = validateColorPair('#783b82', '#7a3d84');
		expect(result.level).toBe('warn');
		expect(deltaE76('#783b82', '#7a3d84')).toBeLessThan(12);
	});

	test('brand pair passes validateColorPair despite ~1:1 luminance', () => {
		const result = validateColorPair(BRAND_DOMINANT_HEX, BRAND_SECONDARY_HEX);
		expect(result.level).toBe('pass');
		expect(result.pairRatio).toBeLessThan(WCAG_AA_UI);
		expect(deltaE76(BRAND_DOMINANT_HEX, BRAND_SECONDARY_HEX)).toBeGreaterThan(
			50,
		);
	});

	test('assessCrayonContrast warns on weak role fills, not pair separation', () => {
		const weak = assessCrayonContrast('#ffffff', 'dominant');
		expect(weak.level).toBe('warn');
		expect(weak.summary?.length).toBeGreaterThan(0);

		const brandAlone = assessCrayonContrast('#783b82', 'dominant');
		expect(brandAlone.level).toBe('pass');
	});

	test('gradeFromRatio follows WCAG 2.2 thresholds', () => {
		expect(gradeFromRatio(WCAG_AAA_TEXT)).toBe('AAA');
		expect(gradeFromRatio(WCAG_AA_TEXT)).toBe('AA');
		expect(gradeFromRatio(WCAG_AA_UI)).toBe('UI');
		expect(gradeFromRatio(2.9)).toBe('Fail');
	});

	test('rateColorPairContrast grades brand high and pale pairs low', () => {
		const brand = rateColorPairContrast('#783b82', '#246028');
		expect(brand.grade).toBe('AAA');
		expect(brand.level).toBe('pass');

		const pale = rateColorPairContrast('#fce883', '#ffffff');
		expect(pale.grade === 'UI' || pale.grade === 'Fail').toBe(true);
		expect(pale.level).toBe('warn');
	});

	test('identical crayons fail the pair meter even when each alone is AAA', () => {
		const plum = '#843179';
		expect(rateCrayonContrast(plum, 'dominant').grade).toBe('AAA');
		expect(rateCrayonContrast(plum, 'secondary').grade).toBe('AAA');

		const same = rateColorPairContrast(plum, plum);
		expect(same.grade).toBe('Fail');
		expect(same.level).toBe('warn');
		expect(same.ratio).toBeCloseTo(1, 5);
	});

	test('ratePairSeparation only fails near-identical pairs', () => {
		const brand = ratePairSeparation(BRAND_DOMINANT_HEX, BRAND_SECONDARY_HEX);
		expect(brand.grade).toBe('AAA');
		expect(brand.level).toBe('pass');

		const same = ratePairSeparation('#843179', '#843179');
		expect(same.grade).toBe('Fail');
		expect(same.ratio).toBeCloseTo(1, 5);
	});

	test('rateCrayonContrast scores role vs surfaces; pair meter adds separation', () => {
		const whiteDominant = rateCrayonContrast('#ffffff', 'dominant');
		expect(whiteDominant.grade).toBe('Fail');

		const brandDominant = rateCrayonContrast('#783b82', 'dominant');
		expect(brandDominant.grade).toBe('AAA');

		const mintSecondary = rateCrayonContrast('#246028', 'secondary');
		expect(mintSecondary.grade).toBe('AAA');
		expect(mintSecondary.level).toBe('pass');

		// Brand is ~1:1 luminance but hue-far — pair meter stays AAA from surfaces.
		const brandPair = rateColorPairContrast('#783b82', '#246028');
		expect(brandPair.grade).toBe('AAA');
		expect(contrastRatio('#783b82', '#246028')).toBeLessThan(WCAG_AA_UI);
	});

	test('ratePairIfRolePicked previews the pair meter after a pick', () => {
		const mint = '#246028';
		const brand = '#783b82';
		const pale = '#fce883';
		const plum = '#843179';

		const keepMintPickBrand = ratePairIfRolePicked(brand, 'dominant', mint);
		expect(keepMintPickBrand).toEqual(rateColorPairContrast(brand, mint));
		expect(keepMintPickBrand.grade).toBe('AAA');

		const keepMintPickPale = ratePairIfRolePicked(pale, 'dominant', mint);
		expect(keepMintPickPale).toEqual(rateColorPairContrast(pale, mint));
		expect(keepMintPickPale.grade).toBe('Fail');

		const keepBrandPickMint = ratePairIfRolePicked(mint, 'secondary', brand);
		expect(keepBrandPickMint).toEqual(rateColorPairContrast(brand, mint));

		const sameAsPartner = ratePairIfRolePicked(plum, 'secondary', plum);
		expect(sameAsPartner.grade).toBe('Fail');
		expect(sameAsPartner.ratio).toBeCloseTo(1, 5);
	});
});

describe('pairings', () => {
	test('suggestPairings leads with Brand', () => {
		const suggestions = suggestPairings();
		expect(suggestions[0]?.id).toBe('brand');
		expect(suggestions.length).toBeGreaterThan(1);
	});

	test('Brand pairing always passes and is WCAG AAA', () => {
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
		expect(brand.grade).toBe('AAA');
	});

	test('curated suggestions only include AA+ grades', () => {
		for (const pairing of suggestPairings().slice(1)) {
			expect(pairingPassesA11y(pairing)).toBe(true);
		}
	});
});
