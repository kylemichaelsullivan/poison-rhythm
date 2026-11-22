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

export const ACCOUNT_LABEL = 'Account';
export const PROFILES_GROUP_TITLE = 'Profiles';
export const TEMPO_LIMITS_GROUP_TITLE = 'Tempo Limits';
export const NEW_PROFILE_LABEL = 'New Profile';
export const PROFILE_NAME_LABEL = 'Profile Name';
export const TEMPO_MIN_LABEL = 'Minimum Tempo';
export const TEMPO_MAX_LABEL = 'Maximum Tempo';
export const RENAME_PROFILE_LABEL = 'Rename';
export const DELETE_PROFILE_LABEL = 'Delete';
export const SWITCH_PROFILE_LABEL = 'Switch';
export const ACTIVE_PROFILE_LABEL = 'Active';
export const DEFAULT_PROFILE_LABEL = 'Default';
export const MOVE_PROFILE_UP_LABEL = 'Move Profile Up';
export const MOVE_PROFILE_DOWN_LABEL = 'Move Profile Down';
export const PROFILE_DRAG_HANDLE_LABEL = 'Drag to Reorder';
export const PROFILE_REORDER_HINT =
	'Drag the handle or use the arrows to reorder.';

export function switchToProfileLabel(name: string): string {
	return `Switch to ${name}`;
}

export function editProfileLabel(name: string): string {
	return `Edit ${name}`;
}

export function profileSwitchToastMessage(name: string): string {
	return `Profile: ${name}`;
}

export function profileCreatedToastMessage(name: string): string {
	return `Created Profile: ${name}`;
}

export function profileMovedAnnouncement(
	name: string,
	position: number,
	total: number,
): string {
	return `${name} moved to position ${position} of ${total}.`;
}

export function profileDragHandleLabel(name: string): string {
	return `${PROFILE_DRAG_HANDLE_LABEL}: ${name}`;
}

export function moveProfileUpLabel(name: string): string {
	return `Move ${name} Up`;
}

export function moveProfileDownLabel(name: string): string {
	return `Move ${name} Down`;
}
