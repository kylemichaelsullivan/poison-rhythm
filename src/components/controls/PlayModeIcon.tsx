import clsx from 'clsx';
import type { GameMode } from '@/lib/settings-schema';
import { PlayModeBucketGlyph } from './PlayModeBucketGlyph';
import { PlayModePoisonGlyph } from './PlayModePoisonGlyph';

type PlayModeIconProps = {
	mode: GameMode;
	selected?: boolean;
};

/** Mode glyph shell for play mode cards (Poison favicon or bucket). */
export function PlayModeIcon({ mode, selected = false }: PlayModeIconProps) {
	return (
		<span
			className={clsx(
				'PlayModeIcon flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-[background-color,box-shadow] duration-200',
				selected
					? mode === 'bucketTrainer'
						? 'PlayModeIcon--selected PlayModeIcon--bucket'
						: 'PlayModeIcon--selected PlayModeIcon--poison'
					: 'text-dark',
			)}
			aria-hidden
		>
			{mode === 'bucketTrainer' ? (
				<PlayModeBucketGlyph active={selected} muted={!selected} />
			) : (
				<PlayModePoisonGlyph muted={!selected} />
			)}
		</span>
	);
}
