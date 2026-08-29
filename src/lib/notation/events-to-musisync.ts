import { beamNotesForDisplay, type NotationGlyphToken } from './beam-notes';
import type { NotationEvent } from './notation-events';

export type { NotationGlyphToken };

/**
 * Collapse beam groups into MusiSync precomposed beamed glyphs where possible.
 * Prefers {@link beamNotesForDisplay} for conventional presentation.
 */
export function eventsToGlyphTokens(
	events: NotationEvent[],
): NotationGlyphToken[] {
	return beamNotesForDisplay(events);
}

/** Map spelled notation events to a MusiSync glyph string (with beaming). */
export function eventsToMusiSyncString(events: NotationEvent[]): string {
	return eventsToGlyphTokens(events)
		.map((token) => token.glyph)
		.join('');
}
