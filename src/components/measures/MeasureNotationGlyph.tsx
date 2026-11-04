import clsx from 'clsx';
import { MUSISYNC_GLYPH } from '@/lib/notation';
import type { MeasurePlaybackPhase } from './measure-phase-chrome';

type MeasureNotationGlyphProps = {
	glyph: string;
	active?: boolean;
	highlighting?: boolean;
	phase?: MeasurePlaybackPhase;
};

/** One MusiSync glyph token; tucks composed rest augmentation dots. */
export function MeasureNotationGlyph({
	glyph,
	active = false,
	highlighting = false,
	phase,
}: MeasureNotationGlyphProps) {
	const dotted = glyph.includes(MUSISYNC_GLYPH.augmentationDot);
	const activeTone = phase === 'listening' ? 'text-secondary' : 'text-primary';

	return (
		<span
			className={clsx(
				'MeasureNotationGlyph inline-block transition-colors duration-150',
				dotted && 'MeasureNotationGlyph--dotted',
				highlighting && (active ? activeTone : 'text-mid'),
			)}
			data-active={highlighting && active ? 'true' : undefined}
		>
			{glyph}
		</span>
	);
}
