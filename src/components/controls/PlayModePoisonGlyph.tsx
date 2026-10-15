import clsx from 'clsx';

type PlayModePoisonGlyphSize = 'sm' | 'md';

type PlayModePoisonGlyphProps = {
	muted?: boolean;
	size?: PlayModePoisonGlyphSize;
};

const sizeClassName: Record<PlayModePoisonGlyphSize, string> = {
	sm: 'h-6 w-6',
	md: 'h-8 w-8',
};

/** Poison favicon glyph for play mode cards. */
export function PlayModePoisonGlyph({
	muted = false,
	size = 'md',
}: PlayModePoisonGlyphProps) {
	return (
		<img
			src='/favicon-32x32.png'
			alt=''
			decoding='async'
			draggable={false}
			className={clsx(
				'PlayModeIcon__glyph PlayModeIcon__glyph--poison block',
				sizeClassName[size],
				muted && 'PlayModeIcon__glyph--muted',
			)}
		/>
	);
}
