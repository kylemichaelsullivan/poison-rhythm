export const BPM_MIN = 40;
export const BPM_MAX = 300;
export const BPM_INPUT_STEP = 1;
export const BPM_BUTTON_STEP = 5;
export const BPM_DEFAULT = 120;
export const TAP_RESET_MS = 1000;
export const TAP_SAMPLE_COUNT = 3;
export const BEAT_FLASH_MS = 100;
export const COUNT_IN_BEATS = 4;
/** Lead time before the first scheduled click so resume/warmup cannot crush the opening interval. */
export const AUDIO_SCHEDULE_LEAD_SEC = 0.08;
/** How far ahead of the audio clock to schedule clicks and hits. */
export const SCHEDULE_AHEAD_SEC = 0.2;
/** Look-ahead scheduler poll interval (Chris Wilson’s two-clock pattern). */
export const LOOKAHEAD_INTERVAL_MS = 25;
