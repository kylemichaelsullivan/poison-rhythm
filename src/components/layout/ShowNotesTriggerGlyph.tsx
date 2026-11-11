import { MUSISYNC_PATHS, VIEW } from '@/lib/notation/musisync-paths';
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
				className='h-9 w-9'
				viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
				aria-hidden
				focusable='false'
			>
				<title>Note</title>
				<path d={MUSISYNC_PATHS[key]} fill='currentColor' />
			</svg>
		</span>
	);
}
