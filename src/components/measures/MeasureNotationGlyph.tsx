import clsx from 'clsx';
import { MUSISYNC_GLYPH } from '@/lib/notation';

type MeasureNotationGlyphProps = {
	glyph: string;
};

/** One MusiSync glyph token; keeps augmentation dots tucked against noteheads. */
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
