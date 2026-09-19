import { describe, expect, test } from 'bun:test';
import {
	DEFAULT_SETTINGS,
	feedbackModeFromToggles,
	feedbackTogglesFromMode,
	parseGameSettings,
	sanitizeGameSettings,
	serializeGameSettings,
} from '@/lib/settings-schema';

describe('settings-schema', () => {
	test('feedback toggles round-trip through feedbackMode', () => {
		expect(feedbackModeFromToggles(false, false)).toBe('none');
		expect(feedbackModeFromToggles(true, false)).toBe('visual');
		expect(feedbackModeFromToggles(false, true)).toBe('audio');
		expect(feedbackModeFromToggles(true, true)).toBe('both');
		expect(feedbackTogglesFromMode('both')).toEqual({
			visual: true,
			audio: true,
		});
		expect(feedbackTogglesFromMode('none')).toEqual({
			visual: false,
			audio: false,
		});
	});
	test('sanitize forces phraseLength to 1', () => {
		const result = sanitizeGameSettings({ phraseLength: 4 });
		expect(result.phraseLength).toBe(1);
	});

	test('DEFAULT_SETTINGS passes validation', () => {
		expect(sanitizeGameSettings({})).toEqual(DEFAULT_SETTINGS);
	});

	test('parseGameSettings returns defaults for null', () => {
		expect(parseGameSettings(null)).toEqual(DEFAULT_SETTINGS);
	});

	test('parseGameSettings returns defaults for invalid JSON', () => {
		expect(parseGameSettings('not json')).toEqual(DEFAULT_SETTINGS);
	});

	test('parseGameSettings strips removed complexity fields from stored JSON', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			density: 'dense',
			syncopation: 'heavy',
			subdivision: '1/16',
		});
		expect(parseGameSettings(legacy)).toEqual(DEFAULT_SETTINGS);
	});

	test('muteOnStudentPass cleared when demoBeforePlay is off', () => {
		const result = sanitizeGameSettings({
			demoBeforePlay: false,
			muteOnStudentPass: true,
		});
		expect(result.muteOnStudentPass).toBe(false);
	});

	test('muteOnStudentPass preserved when demoBeforePlay is on', () => {
		const result = sanitizeGameSettings({
			demoBeforePlay: true,
			muteOnStudentPass: true,
		});
		expect(result.muteOnStudentPass).toBe(true);
	});

	test('serialize and parse round-trip', () => {
		const custom = sanitizeGameSettings({
			endless: true,
			endlessInitialBatch: 12,
		});
		const serialized = serializeGameSettings(custom);
		const parsed = parseGameSettings(serialized);
		expect(parsed).toEqual(custom);
	});

	test('migrates legacy endless gameMode to endless checkbox', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			gameMode: 'endless',
		});
		const parsed = parseGameSettings(legacy);
		expect(parsed.gameMode).toBe('default');
		expect(parsed.endless).toBe(true);
	});

	test('migrates legacy memory gameMode to default with hidden poison', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			gameMode: 'memory',
			poisonMode: 'visible',
		});
		const parsed = parseGameSettings(legacy);
		expect(parsed.gameMode).toBe('default');
		expect(parsed.poisonMode).toBe('hidden');
	});

	test('migrates legacy mirror gameMode to default with hidden poison', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			gameMode: 'mirror',
		});
		const parsed = parseGameSettings(legacy);
		expect(parsed.gameMode).toBe('default');
		expect(parsed.poisonMode).toBe('hidden');
	});

	test('migrates legacy poisonGauntlet gameMode to default', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			gameMode: 'poisonGauntlet',
		});
		expect(parseGameSettings(legacy).gameMode).toBe('default');
	});

	test('migrates legacy persistent poison mode to visible', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			poisonMode: 'persistent',
		});
		expect(parseGameSettings(legacy).poisonMode).toBe('visible');
	});

	test('sanitize forces rests off', () => {
		const result = sanitizeGameSettings({ rests: 'on' });
		expect(result.rests).toBe('off');
	});

	test('keeps rhythmRenderMode scroll and fills a default direction', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			rhythmRenderMode: 'scroll',
			scrollDirection: 'none',
			demoBeforePlay: true,
			muteOnStudentPass: true,
		});
		const parsed = parseGameSettings(legacy);
		expect(parsed.rhythmRenderMode).toBe('scroll');
		expect(parsed.scrollDirection).toBe('down');
		expect(parsed.demoBeforePlay).toBe(true);
		expect(parsed.muteOnStudentPass).toBe(true);
	});

	test('migrates orthogonal scrollDirection overlay into scroll mode', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			rhythmRenderMode: 'notation',
			scrollDirection: 'left',
		});
		const parsed = parseGameSettings(legacy);
		expect(parsed.rhythmRenderMode).toBe('scroll');
		expect(parsed.scrollDirection).toBe('left');
	});

	test('parseGameSettings preserves demoBeforePlay when other keys are partial', () => {
		const partial = JSON.stringify({
			demoBeforePlay: true,
			muteOnStudentPass: true,
		});
		const parsed = parseGameSettings(partial);
		expect(parsed.demoBeforePlay).toBe(true);
		expect(parsed.muteOnStudentPass).toBe(true);
		expect(parsed.players).toBe(DEFAULT_SETTINGS.players);
	});

	test('strips legacy focusMode from stored JSON', () => {
		const legacy = JSON.stringify({
			...DEFAULT_SETTINGS,
			focusMode: 'sticking',
		});
		const parsed = parseGameSettings(legacy);
		expect(parsed).toEqual(DEFAULT_SETTINGS);
		expect('focusMode' in parsed).toBe(false);
	});

	test('bucket drumming preserves endless preference', () => {
		const result = sanitizeGameSettings({
			gameMode: 'bucketTrainer',
			endless: false,
		});
		expect(result.endless).toBe(false);
	});
});
