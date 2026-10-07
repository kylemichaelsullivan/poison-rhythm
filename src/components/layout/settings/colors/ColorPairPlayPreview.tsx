import { pickOnColor } from '@/lib/colors';

type ColorPairPlayPreviewProps = {
	dominantHex: string;
	secondaryHex: string;
};

/** Decorative Play Preview strip using the current color pair. */
export function ColorPairPlayPreview({
	dominantHex,
	secondaryHex,
}: ColorPairPlayPreviewProps) {
	const onPrimary = pickOnColor(dominantHex);

	return (
		<div
			className='ColorPairPlayPreview flex items-center justify-between gap-3 rounded-lg border-2 px-3 py-2.5 shadow-soft'
			style={{
				backgroundColor: dominantHex,
				borderColor: secondaryHex,
				color: onPrimary,
			}}
			aria-hidden='true'
		>
			<span className='text-sm font-semibold'>Play Preview</span>
			<span
				className='rounded border px-2 py-0.5 text-xs font-medium'
				style={{ borderColor: secondaryHex, color: onPrimary }}
			>
				Secondary Border
			</span>
		</div>
	);
}
