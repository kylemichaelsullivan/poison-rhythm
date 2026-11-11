import clsx from 'clsx';
import { MEASURE_LENGTH } from '@/types';
import { NoteGlyph } from './notation/NoteGlyph';
import { RestGlyph } from './notation/RestGlyph';
import type { NotationLayoutSlot, NotationStep } from '@/lib/notation';
import type { MeasurePlaybackPhase } from './measure-phase-chrome';

type MeasureNotationGlyphProps = {
	step: NotationStep;
	slot: NotationLayoutSlot;
	active?: boolean;
	highlighting?: boolean;
	phase?: MeasurePlaybackPhase;
};

/**
 * One SVG note/rest placed by relative-duration layout. Notes sit in a
 * compact pocket at the stem; rests fill their advance width.
 */
export function MeasureNotationGlyph({
	step,
	slot,
	active = false,
	highlighting = false,
	phase,
}: MeasureNotationGlyphProps) {
	const activeTone = phase === 'listening' ? 'text-secondary' : 'text-primary';
	const beamed = step.kind === 'note' && step.beamGroupId !== undefined;
	const unit = 100 / MEASURE_LENGTH;

	const style =
		step.kind === 'rest'
			? {
					left: `${slot.x * unit}%`,
					width: `${Math.max(slot.width, 1) * unit}%`,
				}
			: {
					left: `${(slot.stemX - 0.5) * unit}%`,
					width: `${unit}%`,
				};

	return (
		<span
			className={clsx(
				'MeasureNotationGlyph absolute top-0 inline-flex h-full items-center justify-center transition-colors duration-150',
				highlighting && (active ? activeTone : 'text-black'),
			)}
			style={style}
			data-active={highlighting && active ? 'true' : undefined}
			data-kind={step.kind}
			data-duration={step.duration}
			data-start-cell={step.startCell}
			data-duration-cells={step.durationCells}
			data-stem-x={slot.stemX}
		>
			{step.kind === 'rest' ? (
				<RestGlyph
					duration={step.duration}
					className='h-full w-auto max-w-full'
				/>
			) : (
				<NoteGlyph
					duration={step.duration}
					beamed={beamed}
					className='h-full w-auto max-w-full'
				/>
			)}
		</span>
	);
}
