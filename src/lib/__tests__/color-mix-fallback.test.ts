import { describe, expect, test } from 'bun:test';
import {
	colorMixFallbackValue,
	firstSafeMixColor,
	webkitGradientValue,
} from '../css/color-mix-fallback';

describe('color-mix fallbacks', () => {
	test('keeps a hex when the mix percentage is dropped', () => {
		expect(firstSafeMixColor('in srgb, #783b82 25%, transparent')).toBe(
			'#783b82',
		);
		expect(
			colorMixFallbackValue('color-mix(in srgb, #783b82 25%, transparent)'),
		).toBe('#783b82');
	});

	test('keeps var() so theme overrides still apply', () => {
		expect(
			colorMixFallbackValue(
				'color-mix(in oklab, var(--color-primary) 10%, transparent)',
			),
		).toBe('var(--color-primary)');
	});

	test('keeps rgba() commas inside the first color', () => {
		expect(
			colorMixFallbackValue(
				'0 0 0 1px color-mix(in srgb, rgba(159, 157, 165, 0.4) 40%, transparent)',
			),
		).toBe('0 0 0 1px rgba(159, 157, 165, 0.4)');
	});

	test('refuses oklch and light-dark arguments', () => {
		expect(
			colorMixFallbackValue(
				'color-mix(in srgb, oklch(52% 0.14 326) 14%, transparent)',
			),
		).toBeNull();
		expect(
			colorMixFallbackValue(
				'color-mix(in srgb, light-dark(#fff, #000) 10%, transparent)',
			),
		).toBeNull();
	});

	test('prefixes gradients without touching an existing prefix', () => {
		expect(
			webkitGradientValue(
				'radial-gradient(110% 75% at 100% 0%, #fff, transparent)',
			),
		).toBe('-webkit-radial-gradient(110% 75% at 100% 0%, #fff, transparent)');
		expect(webkitGradientValue('-webkit-linear-gradient(#fff, #000)')).toBe(
			null,
		);
	});
});
