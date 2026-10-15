import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import iosColorFallback from '../../../postcss/ios-color-fallback';
import {
	applyColorPreferenceVars,
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
} from '../colors/apply-color-prefs';
import {
	createTimedNoticeClock,
	freezeTimedNoticeClock,
	remainingTimedNoticeMs,
	runTimedNoticeClock,
	TIMED_NOTICE_DURATION_MS,
	TIMED_NOTICE_PROGRESS_HEIGHT,
	timedNoticeElapsedMs,
	timedNoticeProgress,
} from '../timed-notice';

const indexCss = readFileSync(
	new URL('../../index.css', import.meta.url),
	'utf8',
);

function braceBlock(source: string, header: string): string {
	const start = source.indexOf(header);
	if (start < 0) throw new Error(`missing ${header}`);
	const open = source.indexOf('{', start);
	let depth = 0;
	for (let index = open; index < source.length; index++) {
		const char = source[index];
		if (char === '{') depth += 1;
		else if (char === '}') {
			depth -= 1;
			if (depth === 0) return source.slice(start, index + 1);
		}
	}
	throw new Error(`unclosed ${header}`);
}

function noticeCss(): string {
	const start = indexCss.indexOf('.TimedNoticeProgress {');
	if (start < 0) throw new Error('missing .TimedNoticeProgress');
	return indexCss.slice(start);
}

function fakeRoot(): {
	root: HTMLElement;
	get: (name: string) => string | undefined;
} {
	const props = new Map<string, string>();
	const root = {
		style: {
			setProperty(name: string, value: string) {
				props.set(name, value);
			},
			removeProperty(name: string) {
				props.delete(name);
			},
		},
	} as unknown as HTMLElement;
	return { root, get: (name) => props.get(name) };
}

describe('timed notice duration', () => {
	test('defaults to 2.5 seconds', () => {
		expect(TIMED_NOTICE_DURATION_MS).toBe(2500);
		expect(TIMED_NOTICE_PROGRESS_HEIGHT).toBe('0.5rem');
	});

	test('fills from the left as the timer expires', () => {
		expect(timedNoticeProgress(0, 3000)).toBe(0);
		expect(timedNoticeProgress(1500, 3000)).toBe(0.5);
		expect(timedNoticeProgress(3000, 3000)).toBe(1);
		expect(timedNoticeProgress(9000, 3000)).toBe(1);
		expect(timedNoticeProgress(-10, 3000)).toBe(0);
		expect(timedNoticeProgress(10, 0)).toBe(1);
		expect(timedNoticeProgress(Number.NaN, 3000)).toBe(0);
	});

	test('reports the time left after a background gap', () => {
		expect(remainingTimedNoticeMs(0, 3000)).toBe(3000);
		expect(remainingTimedNoticeMs(1200, 3000)).toBe(1800);
		expect(remainingTimedNoticeMs(4000, 3000)).toBe(0);
		expect(remainingTimedNoticeMs(-5, 3000)).toBe(3000);
	});

	test('hover freezes elapsed time and resume continues from there', () => {
		const started = runTimedNoticeClock(createTimedNoticeClock(), 1000);
		expect(timedNoticeElapsedMs(started, 1400)).toBe(400);

		const paused = freezeTimedNoticeClock(started, 1400);
		expect(timedNoticeElapsedMs(paused, 9000)).toBe(400);
		expect(freezeTimedNoticeClock(paused, 9000)).toEqual(paused);

		const resumed = runTimedNoticeClock(paused, 2000);
		expect(timedNoticeElapsedMs(resumed, 2300)).toBe(700);
		expect(remainingTimedNoticeMs(700, 2500)).toBe(1800);
	});
});

describe('timed notice colors on iOS', () => {
	test('brand defaults in @theme are hex, with oklch only as a later upgrade', () => {
		const theme = braceBlock(indexCss, '@theme');
		expect(theme).toContain(`--color-primary: var(--color-brand-purple-deep);`);
		expect(theme).toContain(`--color-secondary: var(--color-brand-mint-deep);`);
		expect(theme).toContain(
			`--color-brand-purple-deep: ${BRAND_DOMINANT_HEX};`,
		);
		expect(theme).toContain(`--color-brand-mint-deep: ${BRAND_SECONDARY_HEX};`);
		const themeValues = theme.replace(/\/\*[\s\S]*?\*\//g, '');
		expect(themeValues).not.toMatch(
			/oklch\s*\(|color-mix\s*\(|light-dark\s*\(/,
		);

		const registered = indexCss.slice(
			indexCss.indexOf('@property --color-brand-purple {'),
			indexCss.indexOf('@supports (color: oklch'),
		);
		const upgrades = indexCss.slice(
			indexCss.indexOf('@supports (color: oklch'),
		);
		for (const [token, hex] of [
			['--color-brand-purple-deep', BRAND_DOMINANT_HEX],
			['--color-brand-mint-deep', BRAND_SECONDARY_HEX],
		] as const) {
			expect(registered).toContain(`@property ${token} {`);
			expect(registered).toContain(`initial-value: ${hex};`);
			expect(upgrades).toMatch(new RegExp(`${token}: oklch\\(`));
			expect(upgrades).not.toContain(`${token}: ${hex};`);
		}
	});

	test('selected crayons override the notice stops with hex, not oklch', () => {
		const { root, get } = fakeRoot();
		applyColorPreferenceVars(
			{ dominantId: 'violet-purple', secondaryId: 'forest-green' },
			root,
		);
		expect(get('--color-primary')).toMatch(/^#[0-9a-f]{6}$/);
		expect(get('--color-secondary')).toMatch(/^#[0-9a-f]{6}$/);
		expect(get('--color-primary')).not.toBe(get('--color-secondary'));

		applyColorPreferenceVars({ dominantId: null, secondaryId: null }, root);
		expect(get('--color-primary')).toBeUndefined();
		expect(get('--color-secondary')).toBeUndefined();
	});

	test('the progress rule stays paintable without color-mix or oklch', () => {
		const notice = noticeCss();
		expect(notice).toContain(`height: ${TIMED_NOTICE_PROGRESS_HEIGHT};`);
		expect(notice).toContain('background-color: var(--color-primary);');
		expect(notice).toContain(
			'-webkit-linear-gradient(\n\t\tleft,\n\t\tvar(--color-primary),\n\t\tvar(--color-secondary)\n\t);',
		);
		expect(notice).toContain(
			'linear-gradient(\n\t\tto right,\n\t\tvar(--color-primary),\n\t\tvar(--color-secondary)\n\t);',
		);
		expect(notice).toContain(
			`animation-duration: var(--timed-notice-duration, ${TIMED_NOTICE_DURATION_MS / 1000}s);`,
		);
		expect(notice).toContain('transform: scaleX(0);');
		expect(notice).toContain('transform: scaleX(1);');
		expect(notice).toContain('@media (prefers-reduced-motion: reduce)');
		expect(notice).toContain('animation-play-state: paused');
		expect(notice).not.toMatch(/\bwidth\s*:/);
		expect(notice).not.toMatch(/color-mix|oklch|light-dark/);

		const solid = notice.indexOf('background-color:');
		const prefixed = notice.indexOf('-webkit-linear-gradient');
		const modern = notice.search(/(?<!-)linear-gradient\(/);
		expect(solid).toBeGreaterThan(-1);
		expect(prefixed).toBeGreaterThan(solid);
		expect(modern).toBeGreaterThan(prefixed);
	});

	test('postcss keeps a webkit gradient and does not invent color-mix', async () => {
		const result = await postcss([iosColorFallback()]).process(noticeCss(), {
			from: 'timed-notice.css',
		});
		expect(result.css).toContain(
			'-webkit-linear-gradient(\n\t\tleft,\n\t\tvar(--color-primary),\n\t\tvar(--color-secondary)\n\t);',
		);
		expect(result.css).toContain('background-color: var(--color-primary);');
		expect(result.css).not.toMatch(/color-mix|oklch|light-dark/);
	});
});
