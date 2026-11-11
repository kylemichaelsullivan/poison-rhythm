import { secondaryBeamCount } from './notation-duration';

export type BeamNoteLayout = {
	startCell: number;
	durationCells: number;
};

export type BeamSegment = {
	/** 1 = primary (eighth) beam, 2 = secondary (sixteenth) beam. */
	level: 1 | 2;
	/** Stem x in layout units (0–16). */
	x1: number;
	x2: number;
};

export type BeamedStep = BeamNoteLayout & {
	beamGroupId?: number;
	kind: 'note' | 'rest';
	stepIndex?: number;
};

/**
 * Fallback stem x when no relative layout is supplied: center of the
 * absolute duration span on the 16-cell grid.
 */
export function stemXForNote(note: BeamNoteLayout): number {
	return note.startCell + note.durationCells / 2;
}

/** Stem x positions for a beamed group (same order as `notes`). */
export function stemXsForGroup(
	notes: ReadonlyArray<BeamNoteLayout>,
	stemXs?: ReadonlyArray<number>,
): number[] {
	if (stemXs && stemXs.length === notes.length) return [...stemXs];
	return notes.map((note) => stemXForNote(note));
}

/**
 * Compute horizontal beam segments for one beamed group.
 * Primary spans the whole group; secondary covers contiguous sixteenths,
 * with a ~⅓-gap partial when a lone sixteenth sits beside a longer note.
 */
export function beamSegmentsForGroup(
	notes: ReadonlyArray<BeamNoteLayout>,
	stemXs?: ReadonlyArray<number>,
): BeamSegment[] {
	if (notes.length < 2) return [];

	const xs = stemXsForGroup(notes, stemXs);
	const firstX = xs[0];
	const lastX = xs[xs.length - 1];
	if (firstX === undefined || lastX === undefined) return [];

	const segments: BeamSegment[] = [{ level: 1, x1: firstX, x2: lastX }];

	const needsSecondary = notes.map(
		(note) => secondaryBeamCount(note.durationCells) >= 1,
	);

	let i = 0;
	while (i < notes.length) {
		if (!needsSecondary[i]) {
			i += 1;
			continue;
		}
		let j = i + 1;
		while (j < notes.length && needsSecondary[j]) {
			j += 1;
		}

		const runStart = i;
		const runEnd = j - 1;
		const startX = xs[runStart];
		const endX = xs[runEnd];
		if (startX === undefined || endX === undefined) {
			i = j;
			continue;
		}

		if (runStart === runEnd) {
			const left = xs[runStart - 1];
			const right = xs[runStart + 1];
			if (left !== undefined) {
				segments.push({
					level: 2,
					x1: startX - (startX - left) / 3,
					x2: startX,
				});
			} else if (right !== undefined) {
				segments.push({
					level: 2,
					x1: startX,
					x2: startX + (right - startX) / 3,
				});
			}
		} else {
			segments.push({ level: 2, x1: startX, x2: endX });
		}

		i = j;
	}

	return segments;
}

/** Group notation steps that share a beamGroupId (notes only). */
export function groupBeamedNotes<T extends BeamedStep>(
	steps: ReadonlyArray<T>,
): Map<number, T[]> {
	const groups = new Map<number, T[]>();
	for (const step of steps) {
		if (step.kind !== 'note' || step.beamGroupId === undefined) continue;
		const list = groups.get(step.beamGroupId) ?? [];
		list.push(step);
		groups.set(step.beamGroupId, list);
	}
	return groups;
}
