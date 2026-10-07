/** WCAG 2.2 relative luminance and contrast helpers. */

/** WCAG 2.2 §1.4.6 Contrast (Enhanced) AAA — normal text. */
export const WCAG_AAA_TEXT = 7;
/** WCAG 2.2 §1.4.3 Contrast (Minimum) AA — normal text. */
export const WCAG_AA_TEXT = 4.5;
/** WCAG 2.2 §1.4.11 Non-text Contrast AA (also large-text AA floor). */
export const WCAG_AA_UI = 3;

/**
 * How far toward white we lighten accents for dark-theme UI (matches
 * `applyColorPreferenceVars` + `@theme` bright tokens). Tuned so brand
 * purple-deep clears AAA (≥7:1) on dark surfaces.
 */
export const ACCENT_BRIGHTEN_FOR_DARK = 0.45;

/** Brand ink tokens used for on-color picks (see index.css). */
export const INK_50 = '#faf9fc';
export const INK_950 = '#0d090e';

/** Representative page surfaces for contrast checks. */
export const SURFACE_LIGHT = '#faf9fc';
export const SURFACE_DARK = '#0d090e';

export type ContrastLevel = 'pass' | 'warn';

export type ContrastIssue = {
	level: ContrastLevel;
	ratio: number;
	threshold: number;
	against: string;
	message: string;
};

export type AccentAssessment = {
	level: ContrastLevel;
	issues: ContrastIssue[];
	onColor: string;
	textRatio: number;
	uiRatioLight: number;
	uiRatioDark: number;
};

function clamp01(value: number): number {
	return Math.min(1, Math.max(0, value));
}

export function parseHexColor(hex: string): {
	r: number;
	g: number;
	b: number;
} {
	const normalized = hex.trim().replace(/^#/, '');
	if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
		throw new Error(`Invalid hex color: ${hex}`);
	}
	return {
		r: Number.parseInt(normalized.slice(0, 2), 16),
		g: Number.parseInt(normalized.slice(2, 4), 16),
		b: Number.parseInt(normalized.slice(4, 6), 16),
	};
}

function channelToLinear(channel: number): number {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
	const { r, g, b } = parseHexColor(hex);
	return (
		0.2126 * channelToLinear(r) +
		0.7152 * channelToLinear(g) +
		0.0722 * channelToLinear(b)
	);
}

export function contrastRatio(foreground: string, background: string): number {
	const l1 = relativeLuminance(foreground);
	const l2 = relativeLuminance(background);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

/** D65 reference white for sRGB → Lab. */
const LAB_XN = 0.95047;
const LAB_YN = 1;
const LAB_ZN = 1.08883;

function hexToLab(hex: string): { L: number; a: number; b: number } {
	const { r, g, b } = parseHexColor(hex);
	const R = channelToLinear(r);
	const G = channelToLinear(g);
	const B = channelToLinear(b);
	// sRGB D65 → XYZ (IEC 61966-2-1)
	const x = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
	const y = R * 0.2126729 + G * 0.7151522 + B * 0.072175;
	const z = R * 0.0193339 + G * 0.119192 + B * 0.9503041;
	const f = (t: number) =>
		t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29;
	const fx = f(x / LAB_XN);
	const fy = f(y / LAB_YN);
	const fz = f(z / LAB_ZN);
	return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/**
 * CIE76 ΔE — perceptual distance. Brand purple/mint is hue-far (~89) despite
 * ~1:1 WCAG luminance; identical crayons are 0.
 */
export function deltaE76(hexA: string, hexB: string): number {
	const a = hexToLab(hexA);
	const b = hexToLab(hexB);
	return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b);
}

/**
 * Minimum CIE76 ΔE before Dominant/Secondary are treated as indistinct.
 * Below this, the pair meter fails (identical crayons). Hue-far Brand pairs
 * stay above this despite ~1:1 WCAG luminance — grades themselves still come
 * only from WCAG contrast ratios vs surfaces.
 */
export const PAIR_SEPARATION_MIN = 12;

export function pickOnColor(
	background: string,
	light: string = INK_50,
	dark: string = INK_950,
): string {
	const lightRatio = contrastRatio(light, background);
	const darkRatio = contrastRatio(dark, background);
	return lightRatio >= darkRatio ? light : dark;
}

export function validateAccentAgainstSurfaces(
	hex: string,
	surfaces: { light: string; dark: string } = {
		light: SURFACE_LIGHT,
		dark: SURFACE_DARK,
	},
): AccentAssessment {
	const onColor = pickOnColor(hex);
	const textRatio = contrastRatio(onColor, hex);
	const uiRatioLight = contrastRatio(hex, surfaces.light);
	// Dark UI uses a lightened brand variant in CSS; score the brightened form.
	const brightForDark = mixToward(hex, 'white', ACCENT_BRIGHTEN_FOR_DARK);
	const uiRatioDark = contrastRatio(brightForDark, surfaces.dark);
	const issues: ContrastIssue[] = [];

	if (textRatio < WCAG_AA_TEXT) {
		issues.push({
			level: 'warn',
			ratio: textRatio,
			threshold: WCAG_AA_TEXT,
			against: 'label on fill',
			message: `Low contrast for text on this fill (${textRatio.toFixed(1)}:1; aim for ${WCAG_AA_TEXT}:1).`,
		});
	}

	if (uiRatioLight < WCAG_AA_UI) {
		issues.push({
			level: 'warn',
			ratio: uiRatioLight,
			threshold: WCAG_AA_UI,
			against: 'light surface',
			message: `Low contrast on light backgrounds (${uiRatioLight.toFixed(1)}:1; aim for ${WCAG_AA_UI}:1).`,
		});
	}
	if (uiRatioDark < WCAG_AA_UI) {
		issues.push({
			level: 'warn',
			ratio: uiRatioDark,
			threshold: WCAG_AA_UI,
			against: 'dark surface',
			message: `Low contrast on dark backgrounds (${uiRatioDark.toFixed(1)}:1; aim for ${WCAG_AA_UI}:1).`,
		});
	}

	return {
		level: issues.length > 0 ? 'warn' : 'pass',
		issues,
		onColor,
		textRatio,
		uiRatioLight,
		uiRatioDark,
	};
}

export type PairAssessment = {
	level: ContrastLevel;
	issues: ContrastIssue[];
	pairRatio: number;
};

export function validateColorPair(
	dominant: string,
	secondary: string,
): PairAssessment {
	const pairRatio = contrastRatio(dominant, secondary);
	const separation = deltaE76(dominant, secondary);
	const issues: ContrastIssue[] = [];

	// Luminance-only WCAG fails Brand (purple/mint ≈ 1:1). Use ΔE so hue-distinct
	// pairs pass while identical / near-identical crayons still warn.
	if (separation < PAIR_SEPARATION_MIN) {
		issues.push({
			level: 'warn',
			ratio: pairRatio,
			threshold: PAIR_SEPARATION_MIN,
			against: 'dominant vs secondary',
			message: `Dominant and secondary are hard to tell apart (ΔE ${separation.toFixed(0)}; aim for ${PAIR_SEPARATION_MIN}+).`,
		});
	}

	return {
		level: issues.length > 0 ? 'warn' : 'pass',
		issues,
		pairRatio,
	};
}

export type ColorRole = 'dominant' | 'secondary';

export type CrayonContrastAssessment = {
	level: ContrastLevel;
	issues: ContrastIssue[];
	summary: string | null;
};

/**
 * Role suitability for a crayon being selected (fill/border vs page surfaces).
 * Pair separation (identical / near-identical Dominant↔Secondary) is scored in
 * {@link rateColorPairContrast}, not here.
 */
export function assessCrayonContrast(
	hex: string,
	role: ColorRole,
): CrayonContrastAssessment {
	const issues: ContrastIssue[] = [];

	if (role === 'dominant') {
		issues.push(...validateAccentAgainstSurfaces(hex).issues);
	} else {
		// Secondary is mostly borders/accents — flag washout on light pages, skip dark fill checks.
		const { uiRatioLight } = validateAccentAgainstSurfaces(hex);
		if (uiRatioLight < WCAG_AA_UI) {
			issues.push({
				level: 'warn',
				ratio: uiRatioLight,
				threshold: WCAG_AA_UI,
				against: 'light surface',
				message: `Secondary may look faint as a border on light backgrounds (${uiRatioLight.toFixed(1)}:1; aim for ${WCAG_AA_UI}:1).`,
			});
		}
	}

	const level: ContrastLevel = issues.length > 0 ? 'warn' : 'pass';
	const summary =
		issues.length === 0 ? null : issues.map((issue) => issue.message).join(' ');

	return { level, issues, summary };
}

/** Unused helper retained for mix math clarity in apply layer. */
export function mixToward(
	hex: string,
	toward: 'black' | 'white',
	amount: number,
): string {
	const { r, g, b } = parseHexColor(hex);
	const t = toward === 'black' ? 0 : 255;
	const a = clamp01(amount);
	const mix = (channel: number) => Math.round(channel * (1 - a) + t * a);
	const toHex = (channel: number) => mix(channel).toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** WCAG 2.2 conformance label from a contrast ratio (classroom meter + badges). */
export type ContrastGrade = 'AAA' | 'AA' | 'UI' | 'Fail';

export type ContrastRating = {
	/** Limiting (worst) contrast ratio for the scoped checks. */
	ratio: number;
	/** WCAG 2.2 label from {@link gradeFromRatio}. */
	grade: ContrastGrade;
	/** `pass` when grade is AAA or AA; otherwise `warn`. */
	level: ContrastLevel;
};

/**
 * Map a single contrast ratio to a WCAG 2.2 label:
 * AAA ≥ 7:1, AA ≥ 4.5:1, UI ≥ 3:1 (§1.4.11 / large text), Fail below.
 */
export function gradeFromRatio(ratio: number): ContrastGrade {
	if (ratio >= WCAG_AAA_TEXT) {
		return 'AAA';
	}
	if (ratio >= WCAG_AA_TEXT) {
		return 'AA';
	}
	if (ratio >= WCAG_AA_UI) {
		return 'UI';
	}
	return 'Fail';
}

export function ratingFromRatio(ratio: number): ContrastRating {
	const grade = gradeFromRatio(ratio);
	return {
		ratio,
		grade,
		level: grade === 'AAA' || grade === 'AA' ? 'pass' : 'warn',
	};
}

/** True when AAA or AA (classroom “good enough” bar). */
export function contrastGradePasses(grade: ContrastGrade): boolean {
	return grade === 'AAA' || grade === 'AA';
}

const GRADE_RANK: Record<ContrastGrade, number> = {
	AAA: 3,
	AA: 2,
	UI: 1,
	Fail: 0,
};

/**
 * Single-ratio WCAG rating for a crayon in a color role vs page surfaces.
 *
 * Role checks alone do not score Dominant↔Secondary separation (Brand purple +
 * mint is ~1:1 luminance but hue-far). Pair meter uses {@link rateColorPairContrast}.
 *
 * - **Dominant** (fills / badges): worst of text-on-fill + UI vs light/dark
 *   (AAA≥7, AA≥4.5, UI≥3, Fail&lt;3).
 * - **Secondary** (borders / chrome): worst of UI vs light/dark; meeting
 *   §1.4.11 (3:1) counts as **AA** (borders are not normal text). AAA still ≥7;
 *   Fail below 3 (no separate UI band).
 */
export function rateCrayonContrast(
	hex: string,
	role: ColorRole,
): ContrastRating {
	const assessment = validateAccentAgainstSurfaces(hex);
	if (role === 'dominant') {
		const ratio = Math.min(
			assessment.textRatio,
			assessment.uiRatioLight,
			assessment.uiRatioDark,
		);
		return ratingFromRatio(ratio);
	}

	const ratio = Math.min(assessment.uiRatioLight, assessment.uiRatioDark);
	if (ratio >= WCAG_AAA_TEXT) {
		return { ratio, grade: 'AAA', level: 'pass' };
	}
	if (ratio >= WCAG_AA_UI) {
		return { ratio, grade: 'AA', level: 'pass' };
	}
	return { ratio, grade: 'Fail', level: 'warn' };
}

/**
 * Fail gate for near-identical Dominant/Secondary (ΔE). Does not invent AAA/AA
 * from hue distance — only fails when crayons are indistinct. Otherwise returns
 * a non-limiting AAA so surface WCAG ratios stay in charge.
 */
export function ratePairSeparation(
	dominantHex: string,
	secondaryHex: string,
): ContrastRating {
	const ratio = contrastRatio(dominantHex, secondaryHex);
	const separation = deltaE76(dominantHex, secondaryHex);
	if (separation < PAIR_SEPARATION_MIN) {
		return { ratio, grade: 'Fail', level: 'warn' };
	}
	return { ratio, grade: 'AAA', level: 'pass' };
}

/**
 * Pair meter + Suggested Pairings: worse of role-vs-surface WCAG grades.
 * Near-identical crayons fail via ΔE even when each alone clears AAA.
 */
export function rateColorPairContrast(
	dominantHex: string,
	secondaryHex: string,
): ContrastRating {
	const dominant = rateCrayonContrast(dominantHex, 'dominant');
	const secondary = rateCrayonContrast(secondaryHex, 'secondary');
	const surfaceGrade =
		GRADE_RANK[dominant.grade] <= GRADE_RANK[secondary.grade]
			? dominant.grade
			: secondary.grade;
	const surfaceRatio = Math.min(dominant.ratio, secondary.ratio);
	const separation = ratePairSeparation(dominantHex, secondaryHex);

	if (separation.grade === 'Fail') {
		return separation;
	}

	return {
		ratio: surfaceRatio,
		grade: surfaceGrade,
		level: contrastGradePasses(surfaceGrade) ? 'pass' : 'warn',
	};
}

/**
 * What the pair meter would show if `candidateHex` were picked for `role`,
 * keeping the other role at `partnerHex`. Tray swatch badges use this so the
 * WCAG label previews the resulting classroom grade.
 */
export function ratePairIfRolePicked(
	candidateHex: string,
	role: ColorRole,
	partnerHex: string,
): ContrastRating {
	if (role === 'dominant') {
		return rateColorPairContrast(candidateHex, partnerHex);
	}
	return rateColorPairContrast(partnerHex, candidateHex);
}
