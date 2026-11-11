import { baseDuration, isDottedDuration } from '@/lib/notation';
import { MUSISYNC_PATHS, VIEW } from '@/lib/notation/musisync-paths';
import type { NotationDuration } from '@/lib/notation';
import type { MusiSyncPathKey } from '@/lib/notation/musisync-paths';

type RestGlyphProps = {
	duration: NotationDuration;
	className?: string;
};

function pathKeyFor(duration: NotationDuration): MusiSyncPathKey {
	switch (baseDuration(duration)) {
		case 'whole':
			return 'wholeRest';
		case 'half':
			return 'halfRest';
		case 'quarter':
			return 'quarterRest';
		case 'eighth':
			return 'eighthRest';
		case 'sixteenth':
			return 'sixteenthRest';
		default:
			return 'quarterRest';
	}
}

/** MusiSync outline rests (OFL); dotted rests compose rest + augmentation dot. */
export function RestGlyph({ duration, className }: RestGlyphProps) {
	const key = pathKeyFor(duration);
	const dotted = isDottedDuration(duration);

	return (
		<svg
			className={className}
			viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
			aria-hidden
			focusable='false'
		>
			<title>Rest</title>
			<path d={MUSISYNC_PATHS[key]} fill='currentColor' />
			{dotted ? (
				<path d={MUSISYNC_PATHS.restAugmentationDot} fill='currentColor' />
			) : null}
		</svg>
	);
}
