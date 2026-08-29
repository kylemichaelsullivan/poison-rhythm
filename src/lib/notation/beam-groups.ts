import type { NoteSegment } from './spell-onsets';

const QUARTER_CELLS = 4;

/**
 * Assign beamGroupId to contiguous runs of beamable onset notes within the
 * same quarter-beat. Gaps (rests between attacks) start a new run.
 * Quarters/halves/wholes and tie continuations are unbeamable.
 */
export function assignBeamGroups(segments: NoteSegment[]): Map<number, number> {
	const beamByIndex = new Map<number, number>();
	let nextId = 0;

	const beamable: { index: number; segment: NoteSegment }[] = [];
	for (let i = 0; i < segments.length; i += 1) {
		const segment = segments[i]!;
		if (segment.tieContinuation || segment.durationCells >= QUARTER_CELLS) {
			continue;
		}
		beamable.push({ index: i, segment });
	}

	let runStart = 0;
	while (runStart < beamable.length) {
		const first = beamable[runStart]!;
		const beat = Math.floor(first.segment.startCell / QUARTER_CELLS);
		let runEnd = runStart + 1;

		while (runEnd < beamable.length) {
			const prev = beamable[runEnd - 1]!;
			const next = beamable[runEnd]!;
			const nextBeat = Math.floor(next.segment.startCell / QUARTER_CELLS);
			const contiguous =
				next.segment.startCell ===
				prev.segment.startCell + prev.segment.durationCells;
			if (nextBeat !== beat || !contiguous) {
				break;
			}
			runEnd += 1;
		}

		const runLength = runEnd - runStart;
		if (runLength >= 2) {
			const id = nextId;
			nextId += 1;
			for (let i = runStart; i < runEnd; i += 1) {
				beamByIndex.set(beamable[i]!.index, id);
			}
		}

		runStart = runEnd;
	}

	return beamByIndex;
}
