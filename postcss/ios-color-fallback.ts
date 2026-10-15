import type { Declaration, Plugin } from 'postcss';
import {
	colorMixFallbackValue,
	webkitGradientValue,
} from '../src/lib/css/color-mix-fallback';

function alreadyHas(decl: Declaration, value: string): boolean {
	const prev = decl.prev();
	return (
		prev?.type === 'decl' && prev.prop === decl.prop && prev.value === value
	);
}

/**
 * Insert parse-safe fallbacks ahead of color-mix() and unprefixed gradients.
 * iOS Safari and Chrome share WebKit: color-mix() starts at 16.2, and there
 * is no prefixed color-mix. An earlier plain color still applies when the
 * modern declaration is dropped or invalid at computed-value time.
 */
const plugin = (): Plugin => ({
	postcssPlugin: 'ios-color-fallback',
	Once(root) {
		root.walkDecls((decl) => {
			const fallback = colorMixFallbackValue(decl.value);
			const prefixed = webkitGradientValue(decl.value);
			if (prefixed && !alreadyHas(decl, prefixed)) {
				decl.cloneBefore({ value: prefixed });
			}
			if (fallback && !alreadyHas(decl, fallback)) {
				decl.cloneBefore({ value: fallback });
			}
		});
	},
});

plugin.postcss = true;

export default plugin;
