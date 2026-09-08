import clsx from 'clsx';
import { MUSISYNC_GLYPH } from '@/lib/notation';

type MeasureNotationGlyphProps = {
	glyph: string;
};

/** One MusiSync glyph token; tucks composed rest augmentation dots. */
export function MeasureNotationGlyph({ glyph }: MeasureNotationGlyphProps) {
	const dotted = glyph.includes(MUSISYNC_GLYPH.augmentationDot);

	return (
		<span
			className={clsx(
				'MeasureNotationGlyph inline-block',
				dotted && 'MeasureNotationGlyph--dotted',
			)}
		>
			{glyph}
		</span>
	);
}
