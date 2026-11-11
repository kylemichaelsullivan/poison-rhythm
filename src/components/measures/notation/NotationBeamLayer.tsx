import { beamSegmentsForGroup, groupBeamedNotes } from '@/lib/notation';
import {
	BEAM_SECONDARY_GAP,
	BEAM_THICKNESS,
	STEM_TOP_Y,
	VIEW,
} from '@/lib/notation/musisync-paths';
import { MEASURE_LENGTH } from '@/types';
import type { NotationLayoutSlot, NotationStep } from '@/lib/notation';

type NotationBeamLayerProps = {
	steps: ReadonlyArray<NotationStep>;
	layout: ReadonlyMap<number, NotationLayoutSlot>;
};

/**
 * Rectangular primary/secondary beams (MusiSync-like thickness).
 * Always ink — never inherits playhead accent. Stem xs come from relative layout.
 */
export function NotationBeamLayer({ steps, layout }: NotationBeamLayerProps) {
	const groups = groupBeamedNotes(steps);
	if (groups.size === 0) return null;

	const segments = [...groups.values()].flatMap((notes) => {
		const stemXs = notes.map(
			(note) => layout.get(note.stepIndex)?.stemX ?? note.startCell + 0.5,
		);
		return beamSegmentsForGroup(notes, stemXs);
	});
	if (segments.length === 0) return null;

	return (
		<svg
			className='NotationBeamLayer pointer-events-none absolute inset-0 h-full w-full text-black'
			viewBox={`0 0 ${MEASURE_LENGTH} ${VIEW.h}`}
			preserveAspectRatio='none'
			aria-hidden
			focusable='false'
		>
			<title>Beams</title>
			{segments.map((segment) => {
				const top =
					segment.level === 1 ? STEM_TOP_Y : STEM_TOP_Y + BEAM_SECONDARY_GAP;
				const x = Math.min(segment.x1, segment.x2);
				const width = Math.abs(segment.x2 - segment.x1);
				const key = `${segment.level}-${segment.x1}-${segment.x2}`;
				return (
					<rect
						key={key}
						x={x}
						y={top}
						width={Math.max(width, 0.05)}
						height={BEAM_THICKNESS}
						fill='currentColor'
					/>
				);
			})}
		</svg>
	);
}
