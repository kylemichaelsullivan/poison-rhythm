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
	for (const [index, segment] of segments.entries()) {
		if (segment.tieContinuation || segment.durationCells >= QUARTER_CELLS) {
			continue;
		}
		beamable.push({ index, segment });
	}

	let runStart = 0;
	while (runStart < beamable.length) {
		const first = beamable[runStart];
		if (!first) {
			break;
		}
		const beat = Math.floor(first.segment.startCell / QUARTER_CELLS);
		let runEnd = runStart + 1;

		while (runEnd < beamable.length) {
			const prev = beamable[runEnd - 1];
			const next = beamable[runEnd];
			if (!prev || !next) {
				break;
			}
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
				const item = beamable[i];
				if (item) {
					beamByIndex.set(item.index, id);
				}
			}
		}

		runStart = runEnd;
	}

	return beamByIndex;
}
