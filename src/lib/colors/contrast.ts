/** WCAG 2.1 relative luminance and contrast helpers. */

export const WCAG_AA_TEXT = 4.5;
export const WCAG_AA_UI = 3;

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
	const brightForDark = mixToward(hex, 'white', 0.28);
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
	const issues: ContrastIssue[] = [];

	if (pairRatio < WCAG_AA_UI) {
		issues.push({
			level: 'warn',
			ratio: pairRatio,
			threshold: WCAG_AA_UI,
			against: 'dominant vs secondary',
			message: `Dominant and secondary are hard to tell apart (${pairRatio.toFixed(1)}:1; aim for ${WCAG_AA_UI}:1).`,
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
 * Does not score dominant↔secondary pair separation — brand and many good pairs
 * sit under strict 3:1, and pair checks belong in curated pairing filters.
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
