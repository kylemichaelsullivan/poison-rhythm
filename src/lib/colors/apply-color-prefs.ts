import { mixToward, pickOnColor } from './contrast';
import { type CrayonId, crayonByIdOrNull } from './crayola-64';

/** Exact brand fallbacks when prefs are unset (match index.css). */
export const BRAND_DOMINANT_HEX = '#783b82';
export const BRAND_SECONDARY_HEX = '#509a51';

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
] as const;

export type AppliedColorPrefs = {
	dominantId: CrayonId | null;
	secondaryId: CrayonId | null;
};

export function resolveDominantHex(dominantId: CrayonId | null): string {
	return crayonByIdOrNull(dominantId)?.hex ?? BRAND_DOMINANT_HEX;
}

export function resolveSecondaryHex(secondaryId: CrayonId | null): string {
	return crayonByIdOrNull(secondaryId)?.hex ?? BRAND_SECONDARY_HEX;
}

export function clearColorPreferenceVars(
	root: HTMLElement = document.documentElement,
): void {
	for (const name of COLOR_VARS) {
		root.style.removeProperty(name);
	}
}

/**
 * Apply crayon prefs as CSS custom properties.
 * When both ids are null, remove overrides so @theme brand defaults win.
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
	const purpleBright = mixToward(dominantHex, 'white', 0.28);
	const mintDeep = mixToward(secondaryHex, 'black', 0.12);
	const mintBright = mixToward(secondaryHex, 'white', 0.22);

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
}
