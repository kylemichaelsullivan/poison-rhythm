import { describe, expect, test } from 'bun:test';
import {
	assessCrayonContrast,
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
	CRAYOLA_64,
	CRAYOLA_TRAY_SIZE,
	CRAYOLA_TRAYS,
	contrastGradePasses,
	contrastRatio,
	deltaE76,
	ensureContrastOn,
	gradeFromRatio,
	isCrayonId,
	mixToward,
	pairingPassesA11y,
	pickOnColor,
	rateColorPairContrast,
	rateCrayonContrast,
	ratePairIfRolePicked,
	ratePairSeparation,
	ratePaletteIfRolePicked,
	ratePaletteThemes,
	relativeLuminance,
	resolveDominantHex,
	resolveSecondaryHex,
	suggestPairings,
	swapAccentColors,
	titleHoverColors,
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

	test('ensureContrastOn keeps a passing foreground', () => {
		expect(ensureContrastOn('#000000', '#fce883')).toBe('#000000');
	});

	test('ensureContrastOn lifts a failing role just enough', () => {
		const lifted = ensureContrastOn(
			BRAND_SECONDARY_HEX,
			BRAND_DOMINANT_HEX,
			WCAG_AA_UI,
		);
		expect(lifted).not.toBe(BRAND_SECONDARY_HEX);
		expect(contrastRatio(lifted, BRAND_DOMINANT_HEX)).toBeGreaterThanOrEqual(
			WCAG_AA_UI,
		);
	});

	test('titleHoverColors keeps Black on gold; lifts brand mint on purple', () => {
		const goldBlack = titleHoverColors('#fce883', '#000000');
		expect(goldBlack.onPrimary.toLowerCase()).toBe('#000000');
		expect(
			contrastRatio(goldBlack.onSecondary, mixToward('#000000', 'black', 0.12)),
		).toBeGreaterThanOrEqual(WCAG_AA_TEXT);

		const brand = titleHoverColors(BRAND_DOMINANT_HEX, BRAND_SECONDARY_HEX);
		const primaryFill = mixToward(BRAND_DOMINANT_HEX, 'black', 0.12);
		const secondaryFill = mixToward(BRAND_SECONDARY_HEX, 'black', 0.12);
		expect(contrastRatio(brand.onPrimary, primaryFill)).toBeGreaterThanOrEqual(
			WCAG_AA_UI,
		);
		expect(
			contrastRatio(brand.onSecondary, secondaryFill),
		).toBeGreaterThanOrEqual(WCAG_AA_TEXT);
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

	test('gradeFromRatio follows A through F thresholds', () => {
		expect(gradeFromRatio(WCAG_AAA_TEXT)).toBe('A');
		expect(gradeFromRatio(WCAG_AA_TEXT)).toBe('B');
		expect(gradeFromRatio(WCAG_AA_UI)).toBe('C');
		expect(gradeFromRatio(2.9)).toBe('D');
		expect(gradeFromRatio(1.9)).toBe('F');
	});

	test('rateColorPairContrast is the ratio between the two colors', () => {
		const brand = rateColorPairContrast('#783b82', '#246028');
		expect(brand.ratio).toBeCloseTo(contrastRatio('#783b82', '#246028'), 5);
		expect(brand.grade).toBe('F');
		expect(brand.level).toBe('warn');

		const split = rateColorPairContrast('#000000', '#ffff00');
		expect(split.grade).toBe('A');
		expect(split.ratio).toBeGreaterThanOrEqual(WCAG_AAA_TEXT);
	});

	test('identical crayons fail the pair meter even when each alone is A', () => {
		const plum = '#843179';
		expect(rateCrayonContrast(plum, 'dominant').grade).toBe('A');
		expect(rateCrayonContrast(plum, 'secondary').grade).toBe('A');

		const same = rateColorPairContrast(plum, plum);
		expect(same.grade).toBe('F');
		expect(same.level).toBe('warn');
		expect(same.ratio).toBeCloseTo(1, 5);
	});

	test('ratePairSeparation only fails near-identical pairs', () => {
		const brand = ratePairSeparation(BRAND_DOMINANT_HEX, BRAND_SECONDARY_HEX);
		expect(brand.grade).toBe('A');
		expect(brand.level).toBe('pass');

		const same = ratePairSeparation('#843179', '#843179');
		expect(same.grade).toBe('F');
		expect(same.ratio).toBeCloseTo(1, 5);
	});

	test('rateCrayonContrast scores role vs surfaces; pair meter adds separation', () => {
		const whiteDominant = rateCrayonContrast('#ffffff', 'dominant');
		expect(whiteDominant.grade).toBe('F');

		const brandDominant = rateCrayonContrast('#783b82', 'dominant');
		expect(brandDominant.grade).toBe('A');

		const mintSecondary = rateCrayonContrast('#246028', 'secondary');
		expect(mintSecondary.grade).toBe('A');
		expect(mintSecondary.level).toBe('pass');

		const brandPair = rateColorPairContrast('#783b82', '#246028');
		expect(brandPair.grade).toBe('F');
		expect(brandPair.ratio).toBeLessThan(WCAG_AA_UI);
	});

	test('ratePairIfRolePicked previews the pair meter after a pick', () => {
		const mint = '#246028';
		const brand = '#783b82';
		const pale = '#fce883';
		const plum = '#843179';

		const keepMintPickBrand = ratePairIfRolePicked(brand, 'dominant', mint);
		expect(keepMintPickBrand).toEqual(rateColorPairContrast(brand, mint));
		expect(keepMintPickBrand.grade).toBe('F');

		const keepMintPickPale = ratePairIfRolePicked(pale, 'dominant', mint);
		expect(keepMintPickPale).toEqual(rateColorPairContrast(pale, mint));
		expect(keepMintPickPale.grade).toBe('B');

		const keepBrandPickMint = ratePairIfRolePicked(mint, 'secondary', brand);
		expect(keepBrandPickMint).toEqual(rateColorPairContrast(brand, mint));

		const sameAsPartner = ratePairIfRolePicked(plum, 'secondary', plum);
		expect(sameAsPartner.grade).toBe('F');
		expect(sameAsPartner.ratio).toBeCloseTo(1, 5);
	});
});

describe('pairings', () => {
	test('suggestPairings leads with Brand', () => {
		const suggestions = suggestPairings();
		expect(suggestions[0]?.id).toBe('brand');
		expect(suggestions.length).toBeGreaterThan(1);
	});

	test('Brand purple and mint pass in both themes and stay first', () => {
		expect(BRAND_DOMINANT_HEX).toBe('#914893');
		expect(suggestPairings()[0]?.id).toBe('brand');
		const scores = ratePaletteThemes(BRAND_DOMINANT_HEX, BRAND_SECONDARY_HEX);
		expect(contrastGradePasses(scores.light.grade)).toBe(true);
		expect(contrastGradePasses(scores.dark.grade)).toBe(true);
		expect(scores.light.grade).toBe('B');
		expect(scores.dark.grade).toBe('A');
	});

	test('ratePaletteIfRolePicked previews both themes', () => {
		const preview = ratePaletteIfRolePicked(
			'#ffffff',
			'dominant',
			BRAND_SECONDARY_HEX,
		);
		expect(preview.light.grade).toBe('F');
		const same = ratePaletteThemes('#843179', '#843179');
		expect(same.light.grade).toBe('F');
		expect(same.dark.grade).toBe('F');
	});

	test('curated suggestions are grade A and span several hues', () => {
		const suggestions = suggestPairings().slice(1);
		expect(suggestions.length).toBeGreaterThan(4);
		for (const pairing of suggestions) {
			expect(pairingPassesA11y(pairing)).toBe(true);
		}
		const ids = suggestions.map((pairing) => pairing.id);
		expect(ids).toContain('yellow-black');
		expect(ids).toContain('black-sea-green');
		expect(ids).toContain('sky-blue-black');
		expect(ids).toContain('black-orange');
	});
});

describe('swapAccentColors', () => {
	test('swaps brand defaults onto explicit tokens', () => {
		const swapped = swapAccentColors(null, null);
		expect(swapped).toEqual({
			dominantId: 'poison-mint',
			secondaryId: 'poison-purple',
		});
		expect(resolveDominantHex(swapped.dominantId)).toBe(BRAND_SECONDARY_HEX);
		expect(resolveSecondaryHex(swapped.secondaryId)).toBe(BRAND_DOMINANT_HEX);
	});

	test('swapping brand tokens back collapses to unset defaults', () => {
		expect(swapAccentColors('poison-mint', 'poison-purple')).toEqual({
			dominantId: null,
			secondaryId: null,
		});
	});

	test('swaps crayon ids and materializes a null partner', () => {
		expect(swapAccentColors('yellow', 'black')).toEqual({
			dominantId: 'black',
			secondaryId: 'yellow',
		});
		expect(swapAccentColors('yellow', null)).toEqual({
			dominantId: 'poison-mint',
			secondaryId: 'yellow',
		});
	});
});
