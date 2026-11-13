/** Cross-cutting UI chrome copy shared by controls, empty start and toasts. */

export const NEW_LABEL = 'New';
export const REUSE_LABEL = 'Reuse';
export const NEW_ROUND_TITLE = 'New Poison Rhythm, New Measures';
export const REUSE_ROUND_TITLE = 'New Measures, Same Poison Rhythm';
export const GENERATE_ROUND_TITLE = 'Click to Generate a Round';
export const GENERATE_ROUND_SHORT = 'Click to Generate';

export const PLAY_LABEL = 'Play';
export const PAUSE_LABEL = 'Pause';
export const PLAY_MEASURES = 'Play Measures';
export const PAUSE_PLAYBACK = 'Pause Playback';
export const CANCEL_DELAYED_PLAY = 'Cancel Delayed Play';
export const CAROUSEL_END_MENU_LABEL = 'New, Reuse or Play Measures';
export const MEASURE_SET_ACTIONS_LEGEND = 'Measure Set Actions';

export const NOTE_SUBDIVISIONS_LABEL = 'Note Subdivisions';
export const BEATS_PER_MINUTE = 'Beats per Minute';

export const POISON_HIDE_DURING_PLAYBACK_TITLE =
	'Click to Hide Poison During Playback';
export const POISON_ALWAYS_SHOW_TITLE = 'Click to Always Show Poison Rhythm';
export const POISON_SHOW_QUESTION = 'Show Poison?';

export function setTempoTitle(tempo: number): string {
	return `Set Tempo (${tempo} BPM)`;
}

export function noteSubdivisionsTitle(tickLabel: string): string {
	return `${NOTE_SUBDIVISIONS_LABEL} (${tickLabel})`;
}

/** `Name: On` / `Name: Off` for toggles and practice toasts. */
export function statusOnOffLabel(name: string, on: boolean): string {
	return `${name}: ${on ? 'On' : 'Off'}`;
}

/** `Click to ${action}` or `Click to ${action} ${subject}`. */
export function clickToTitle(action: string, subject?: string): string {
	return subject ? `Click to ${action} ${subject}` : `Click to ${action}`;
}

export function muteActionLabel(muted: boolean): string {
	return muted ? 'Unmute' : 'Mute';
}

export function enableActionLabel(enabled: boolean): string {
	return enabled ? 'Disable' : 'Enable';
}

export function showHideActionLabel(shown: boolean): string {
	return shown ? 'Hide' : 'Show';
}

export function poisonVisibilityTitle(visible: boolean): string {
	return visible ? POISON_HIDE_DURING_PLAYBACK_TITLE : POISON_ALWAYS_SHOW_TITLE;
}

export function measuresPlayPauseTitle(isRunning: boolean): string {
	return isRunning ? PAUSE_PLAYBACK : PLAY_MEASURES;
}

export function measuresPlayPauseLabel(isRunning: boolean): string {
	return isRunning ? PAUSE_LABEL : PLAY_LABEL;
}

export function carouselStartPlayLabel(armed: boolean): string {
	return armed ? CANCEL_DELAYED_PLAY : PLAY_MEASURES;
}
