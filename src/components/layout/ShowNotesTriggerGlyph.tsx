import { MUSISYNC_PATHS } from '@/lib/notation/musisync-paths';
import type { NotationDuration } from '@/lib/notation';
import type { MusiSyncPathKey } from '@/lib/notation/musisync-paths';

type ShowNotesTriggerGlyphProps = {
	duration: Extract<NotationDuration, 'quarter' | 'eighth' | 'sixteenth'>;
};

const DURATION_PATH: Record<
	ShowNotesTriggerGlyphProps['duration'],
	MusiSyncPathKey
> = {
	quarter: 'quarterNote',
	eighth: 'eighthNote',
	sixteenth: 'sixteenthNote',
};

/**
 * Square viewBoxes cropped to each path’s ink bbox (plus chrome padding) so
 * stems/flags get equal padding. The shared 48×72 staff viewBox leaves
 * noteheads low-left of center; bbox framing matches the old canvas trigger.
 */
const TRIGGER_VIEWBOX: Record<ShowNotesTriggerGlyphProps['duration'], string> =
	{
		quarter: '-26.98 -5.65 85.3 85.3',
		eighth: '-19.66 -5.62 85.16 85.16',
		sixteenth: '-19.73 -5.62 85.16 85.16',
	};

/** Compact MusiSync-outline note for the header ShowNotes control. */
export function ShowNotesTriggerGlyph({
	duration,
}: ShowNotesTriggerGlyphProps) {
	const key = DURATION_PATH[duration];

	return (
		<span
			className='pointer-events-none flex size-11 items-center justify-center text-black'
			aria-hidden
			data-notation-glyph={duration}
		>
			<svg
				className='block size-11'
				viewBox={TRIGGER_VIEWBOX[duration]}
				aria-hidden
				focusable='false'
			>
				<title>Note</title>
				<path d={MUSISYNC_PATHS[key]} fill='currentColor' />
			</svg>
		</span>
	);
}
