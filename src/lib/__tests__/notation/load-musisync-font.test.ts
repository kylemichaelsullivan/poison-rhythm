import { describe, expect, test } from 'bun:test';
import { MUSISYNC_BEAMED } from '@/lib/notation/beam-glyphs';
import {
	isMusiSyncFontReady,
	MUSISYNC_ALL_GLYPHS,
	MUSISYNC_FONT_STACK,
	MUSISYNC_SUBDIVISION_FONT_SPEC,
	MUSISYNC_SUBDIVISION_NOTE_GLYPHS,
} from '@/lib/notation/load-musisync-font';
import { MUSISYNC_GLYPH } from '@/lib/notation/musisync-glyphs';

describe('load-musisync-font', () => {
	test('all-glyphs string includes every duration and beamed key', () => {
		for (const glyph of Object.values(MUSISYNC_GLYPH)) {
			expect(MUSISYNC_ALL_GLYPHS.includes(glyph)).toBe(true);
		}
		for (const glyph of Object.values(MUSISYNC_BEAMED)) {
			expect(MUSISYNC_ALL_GLYPHS.includes(glyph)).toBe(true);
		}
		expect(MUSISYNC_SUBDIVISION_NOTE_GLYPHS).toBe(
			`${MUSISYNC_GLYPH.quarterNote}${MUSISYNC_GLYPH.eighthNote}${MUSISYNC_GLYPH.sixteenthNote}`,
		);
	});

	test('font spec uses the same generic fallback as .MusiSync', () => {
		expect(MUSISYNC_FONT_STACK).toBe('"MusiSync", ui-monospace, monospace');
		expect(MUSISYNC_SUBDIVISION_FONT_SPEC).toBe(`34px ${MUSISYNC_FONT_STACK}`);
	});

	test('readiness is false without a document canvas (never trusts letter keys)', () => {
		expect(isMusiSyncFontReady()).toBe(false);
	});
});
