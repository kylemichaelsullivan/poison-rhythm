import {
	ACCENT_BRIGHTEN_FOR_DARK,
	ensureContrastOn,
	mixToward,
	parseHexColor,
	pickOnColor,
	WCAG_AA_TEXT,
	WCAG_AA_UI,
} from './contrast';
import { type CrayonId, crayonByIdOrNull } from './crayola-64';

/**
 * Brand defaults when prefs are unset.
 * Dominant is favicon purple (`--color-brand-purple-deep`). Secondary is the
 * green complement (`--color-brand-mint-deep`), grade A on light and dark
 * surfaces. See `documentation/A11Y.md`.
 */
export const BRAND_DOMINANT_HEX = '#914893';
export const BRAND_SECONDARY_HEX = '#246028';

/** Explicit brand accents so swap can place mint on Dominant (null stays role-default). */
export const BRAND_ACCENT_IDS = ['poison-purple', 'poison-mint'] as const;
export type BrandAccentId = (typeof BRAND_ACCENT_IDS)[number];

const BRAND_ACCENTS: Record<BrandAccentId, { hex: string; name: string }> = {
	'poison-purple': { hex: BRAND_DOMINANT_HEX, name: 'Poison Purple' },
	'poison-mint': { hex: BRAND_SECONDARY_HEX, name: 'Poison Mint' },
};

/** Stored accent: crayon, explicit brand token, or null (role’s brand default). */
export type AccentColorId = CrayonId | BrandAccentId | null;

export function isBrandAccentId(
	value: string | null | undefined,
): value is BrandAccentId {
	return value === 'poison-purple' || value === 'poison-mint';
}

export function brandAccentHex(id: BrandAccentId): string {
	return BRAND_ACCENTS[id].hex;
}

export function brandAccentName(id: BrandAccentId): string {
	return BRAND_ACCENTS[id].name;
}

/** Turn a role’s unset default into an explicit brand token for swap. */
export function materializeAccentForSwap(
	id: AccentColorId,
	role: 'dominant' | 'secondary',
): CrayonId | BrandAccentId {
	if (id != null) {
		return id;
	}
	return role === 'dominant' ? 'poison-purple' : 'poison-mint';
}

/**
 * Exchange Dominant and Secondary. Unset role defaults become brand tokens so
 * brand purple/mint can swap; canonical brand order collapses back to null/null.
 */
export function swapAccentColors(
	dominantId: AccentColorId,
	secondaryId: AccentColorId,
): { dominantId: AccentColorId; secondaryId: AccentColorId } {
	const nextDominant = materializeAccentForSwap(secondaryId, 'secondary');
	const nextSecondary = materializeAccentForSwap(dominantId, 'dominant');
	if (nextDominant === 'poison-purple' && nextSecondary === 'poison-mint') {
		return { dominantId: null, secondaryId: null };
	}
	return { dominantId: nextDominant, secondaryId: nextSecondary };
}

const COLOR_VARS = [
	'--color-brand-purple',
	'--color-brand-purple-deep',
	'--color-brand-purple-bright',
	'--color-brand-mint',
	'--color-brand-mint-deep',
	'--color-brand-mint-bright',
	'--color-primary',
	'--color-on-primary',
	'--color-primary-border',
	'--color-secondary',
	'--color-on-secondary',
	'--color-secondary-border',
	'--color-accent',
	'--color-title-hover-on-primary',
	'--color-title-hover-on-secondary',
	'--page-wash-dominant',
	'--page-wash-secondary',
	'--shadow-accent-color',
] as const;

function rgba(hex: string, alpha: number): string {
	const { r, g, b } = parseHexColor(hex);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type AppliedColorPrefs = {
	dominantId: AccentColorId;
	secondaryId: AccentColorId;
};

function resolveAccentHex(id: AccentColorId, roleFallback: string): string {
	if (id == null) {
		return roleFallback;
	}
	if (isBrandAccentId(id)) {
		return brandAccentHex(id);
	}
	return crayonByIdOrNull(id)?.hex ?? roleFallback;
}

export function resolveDominantHex(dominantId: AccentColorId): string {
	return resolveAccentHex(dominantId, BRAND_DOMINANT_HEX);
}

export function resolveSecondaryHex(secondaryId: AccentColorId): string {
	return resolveAccentHex(secondaryId, BRAND_SECONDARY_HEX);
}

/** Hex + display name for a stored accent (null / brand token / crayon). */
export function resolveAccentDisplay(
	id: AccentColorId,
	role: 'dominant' | 'secondary',
): { hex: string; name: string } {
	const fallbackHex =
		role === 'dominant' ? BRAND_DOMINANT_HEX : BRAND_SECONDARY_HEX;
	const fallbackName = role === 'dominant' ? 'Poison Purple' : 'Poison Mint';
	if (id == null) {
		return { hex: fallbackHex, name: fallbackName };
	}
	if (isBrandAccentId(id)) {
		return { hex: brandAccentHex(id), name: brandAccentName(id) };
	}
	const crayon = crayonByIdOrNull(id);
	return {
		hex: crayon?.hex ?? fallbackHex,
		name: crayon?.name ?? fallbackName,
	};
}

export function clearColorPreferenceVars(
	root: HTMLElement = document.documentElement,
): void {
	for (const name of COLOR_VARS) {
		root.style.removeProperty(name);
	}
}

/**
 * Header/footer About-title hover: Secondary on Dominant bar, Dominant on
 * Secondary bar — lifted only when the raw role fails the contrast floor.
 * Header title is large text (UI floor); footer copyright is normal text.
 */
export function titleHoverColors(
	dominantHex: string,
	secondaryHex: string,
): {
	onPrimary: string;
	onSecondary: string;
} {
	const primaryFill = mixToward(dominantHex, 'black', 0.12);
	const secondaryFill = mixToward(secondaryHex, 'black', 0.12);
	return {
		onPrimary: ensureContrastOn(secondaryFill, primaryFill, WCAG_AA_UI),
		onSecondary: ensureContrastOn(primaryFill, secondaryFill, WCAG_AA_TEXT),
	};
}

function setTitleHoverVars(
	dominantHex: string,
	secondaryHex: string,
	root: HTMLElement,
): void {
	const { onPrimary, onSecondary } = titleHoverColors(
		dominantHex,
		secondaryHex,
	);
	root.style.setProperty('--color-title-hover-on-primary', onPrimary);
	root.style.setProperty('--color-title-hover-on-secondary', onSecondary);
}

/**
 * Apply crayon prefs as CSS custom properties.
 * When both ids are null, remove overrides so @theme brand defaults win
 * (including light/dark title-hover tokens in index.css).
 */
export function applyColorPreferenceVars(
	prefs: AppliedColorPrefs,
	root: HTMLElement = document.documentElement,
): void {
	if (prefs.dominantId == null && prefs.secondaryId == null) {
		clearColorPreferenceVars(root);
		return;
	}

	const dominantHex = resolveDominantHex(prefs.dominantId);
	const secondaryHex = resolveSecondaryHex(prefs.secondaryId);

	const purpleDeep = mixToward(dominantHex, 'black', 0.12);
	const purpleBright = mixToward(
		dominantHex,
		'white',
		ACCENT_BRIGHTEN_FOR_DARK,
	);
	const mintDeep = mixToward(secondaryHex, 'black', 0.12);
	const mintBright = mixToward(secondaryHex, 'white', ACCENT_BRIGHTEN_FOR_DARK);

	root.style.setProperty('--color-brand-purple', dominantHex);
	root.style.setProperty('--color-brand-purple-deep', purpleDeep);
	root.style.setProperty('--color-brand-purple-bright', purpleBright);
	root.style.setProperty('--color-brand-mint', secondaryHex);
	root.style.setProperty('--color-brand-mint-deep', mintDeep);
	root.style.setProperty('--color-brand-mint-bright', mintBright);

	root.style.setProperty('--color-primary', purpleDeep);
	root.style.setProperty('--color-on-primary', pickOnColor(purpleDeep));
	root.style.setProperty('--color-primary-border', secondaryHex);
	root.style.setProperty('--color-secondary', mintDeep);
	root.style.setProperty('--color-on-secondary', pickOnColor(mintDeep));
	root.style.setProperty('--color-secondary-border', dominantHex);
	root.style.setProperty('--color-accent', secondaryHex);
	root.style.setProperty('--page-wash-dominant', rgba(dominantHex, 0.16));
	root.style.setProperty('--page-wash-secondary', rgba(secondaryHex, 0.12));
	root.style.setProperty('--shadow-accent-color', rgba(dominantHex, 0.28));
	setTitleHoverVars(dominantHex, secondaryHex, root);
}
