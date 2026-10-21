import clsx from 'clsx';

type ColorPairPlayPreviewProps = {
	dominantHex: string;
	secondaryHex: string;
};

type PreviewCell = {
	hit: boolean;
	/** Playback step ring — shown on one hit and one rest. */
	highlighted?: boolean;
};

/** Idle measure pattern — hits use Dominant; Secondary frames the grid. */
const PREVIEW_BEATS: readonly (readonly PreviewCell[])[] = [
	[
		{ hit: true, highlighted: true },
		{ hit: false },
		{ hit: true },
		{ hit: true },
	],
	[
		{ hit: false, highlighted: true },
		{ hit: true },
		{ hit: false },
		{ hit: true },
	],
	[{ hit: true }, { hit: true }, { hit: false }, { hit: false }],
	[{ hit: true }, { hit: false }, { hit: false }, { hit: true }],
];

/**
 * Decorative mini-grid using the current color pair.
 * Mirrors MeasureCellGrid: secondary shell/beat borders, dominant hit fills,
 * muted rests, and a secondary ring on one hit and one rest (active step).
 */
export function ColorPairPlayPreview({
	dominantHex,
	secondaryHex,
}: ColorPairPlayPreviewProps) {
	return (
		<div
			className='ColorPairPlayPreview grid w-full grid-cols-2 gap-2 rounded-lg border-2 border-solid bg-surface p-2 sm:grid-cols-4 sm:gap-2.5'
			style={{ borderColor: secondaryHex }}
			aria-hidden='true'
			data-testid='color-pair-play-preview'
		>
			{PREVIEW_BEATS.map((cells, beat) => (
				<div
					key={`preview-beat-${beat + 1}`}
					className='MeasureBeatGroup grid grid-cols-4 gap-px overflow-hidden rounded-md border border-solid bg-surface p-px'
					style={{ borderColor: secondaryHex }}
					data-beat={beat + 1}
				>
					{cells.map((cell, offset) => (
						<div
							key={`preview-cell-${beat + 1}-${offset + 1}`}
							className={clsx(
								'relative aspect-square rounded-[3px]',
								cell.hit ? undefined : 'bg-surface-muted',
							)}
							style={{
								...(cell.hit ? { backgroundColor: dominantHex } : {}),
								...(cell.highlighted
									? { boxShadow: `inset 0 0 0 2px ${secondaryHex}` }
									: {}),
							}}
							title={
								cell.highlighted
									? cell.hit
										? 'Hit (current)'
										: 'Rest (current)'
									: cell.hit
										? 'Hit'
										: 'Rest'
							}
							data-highlighted={cell.highlighted ? 'true' : undefined}
						/>
					))}
				</div>
			))}
		</div>
	);
}
