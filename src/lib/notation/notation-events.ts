import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { RhythmMeasure, RichRhythmMeasure, StickingHand } from '@/types';
import { assignBeamGroups } from './beam-groups';
import type { NotationDuration } from './musisync-glyphs';
import { spellOnsetSegments } from './spell-onsets';
import { spellRests } from './spell-rests';

export type NotationEvent = {
	startCell: number;
	durationCells: number;
	kind: 'note' | 'rest';
	duration: NotationDuration;
	tieContinuation?: boolean;
	beamGroupId?: number;
	accent?: boolean;
	sticking?: StickingHand;
};

/**
 * Spell a measure into contemporary 4/4 notation events
 * (duration-filled notes, beat-split ties, consolidated rests, beam groups).
 */
export function measureToNotationEvents(
	measure: RhythmMeasure,
	richMeasure: RichRhythmMeasure | undefined,
	level: SubdivisionLevel,
): NotationEvent[] {
	const noteSegments = spellOnsetSegments(measure, level);
	const beamByIndex = assignBeamGroups(noteSegments);
	const restSegments = spellRests(noteSegments);

	const noteEvents: NotationEvent[] = noteSegments.map((segment, index) => {
		const isOnset = !segment.tieContinuation;
		const rich = richMeasure?.[segment.onsetCell];
		return {
			startCell: segment.startCell,
			durationCells: segment.durationCells,
			kind: 'note' as const,
			duration: segment.duration,
			tieContinuation: segment.tieContinuation || undefined,
			beamGroupId: beamByIndex.get(index),
			accent: isOnset && rich?.accent ? true : undefined,
			sticking: isOnset ? rich?.sticking : undefined,
		};
	});

	const restEvents: NotationEvent[] = restSegments.map((segment) => ({
		startCell: segment.startCell,
		durationCells: segment.durationCells,
		kind: 'rest' as const,
		duration: segment.duration,
	}));

	return [...noteEvents, ...restEvents].sort(
		(a, b) =>
			a.startCell - b.startCell || kindOrder(a.kind) - kindOrder(b.kind),
	);
}

function kindOrder(kind: 'note' | 'rest'): number {
	return kind === 'note' ? 0 : 1;
}
