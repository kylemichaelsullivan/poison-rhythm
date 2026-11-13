import clsx from 'clsx';
import { dataFlag } from '@/lib/data-attr';
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
 * One SVG note/rest placed by relative-duration layout. Notes use a
 * height-locked MusiSync pocket centered on the stem (not a 1-cell squeeze);
 * rests fill their advance width.
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
					left: `calc(${slot.stemX * unit}% - var(--notation-glyph-width) / 2)`,
					width: 'var(--notation-glyph-width)',
				};

	return (
		<span
			className={clsx(
				'MeasureNotationGlyph absolute top-0 inline-flex h-full items-center justify-center transition-colors duration-150',
				highlighting && (active ? activeTone : 'text-black'),
			)}
			style={style}
			data-active={dataFlag(Boolean(highlighting && active))}
			data-kind={step.kind}
			data-duration={step.duration}
			data-start-cell={step.startCell}
			data-duration-cells={step.durationCells}
			data-stem-x={slot.stemX}
		>
			{step.kind === 'rest' ? (
				<RestGlyph duration={step.duration} className='h-full w-auto' />
			) : (
				<NoteGlyph
					duration={step.duration}
					beamed={beamed}
					className='h-full w-auto'
				/>
			)}
		</span>
	);
}
