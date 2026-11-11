import { baseDuration, isDottedDuration } from '@/lib/notation';
import { MUSISYNC_PATHS, VIEW } from '@/lib/notation/musisync-paths';
import type { NotationDuration } from '@/lib/notation';
import type { MusiSyncPathKey } from '@/lib/notation/musisync-paths';

type NoteGlyphProps = {
	duration: NotationDuration;
	/** When true, omit flags (beams are drawn by NotationBeamLayer). */
	beamed?: boolean;
	className?: string;
};

function pathKeyFor(
	duration: NotationDuration,
	beamed: boolean,
): MusiSyncPathKey {
	const base = baseDuration(duration);
	const dotted = isDottedDuration(duration);

	// Beamed notes share a filled head + stem (quarter outline), no flags.
	if (beamed) {
		return 'quarterNote';
	}

	if (dotted) {
		switch (base) {
			case 'half':
				return 'dottedHalfNote';
			case 'quarter':
				return 'dottedQuarterNote';
			case 'eighth':
				return 'dottedEighthNote';
			default:
				break;
		}
	}

	switch (base) {
		case 'whole':
			return 'wholeNote';
		case 'half':
			return 'halfNote';
		case 'quarter':
			return 'quarterNote';
		case 'eighth':
			return 'eighthNote';
		case 'sixteenth':
			return 'sixteenthNote';
		default:
			return 'quarterNote';
	}
}

/** MusiSync outline notehead + stem/flags (OFL), scaled to the notation track. */
export function NoteGlyph({
	duration,
	beamed = false,
	className,
}: NoteGlyphProps) {
	const key = pathKeyFor(duration, beamed);
	// Beamed notes use the flagless quarter outline; dotted sixteenths have no
	// dedicated MusiSync glyph. Compose the augmentation dot in both cases.
	const composeDot =
		isDottedDuration(duration) &&
		(beamed || baseDuration(duration) === 'sixteenth');

	return (
		<svg
			className={className}
			viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
			aria-hidden
			focusable='false'
		>
			<title>Note</title>
			<path d={MUSISYNC_PATHS[key]} fill='currentColor' />
			{composeDot ? (
				<path d={MUSISYNC_PATHS.augmentationDot} fill='currentColor' />
			) : null}
		</svg>
	);
}
