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
						? 'PlayModeIcon--selected PlayModeIcon--bucket bg-[color-mix(in_oklch,var(--color-brand-gradient-a)_14%,var(--color-surface))] shadow-[0_0_0_1px_color-mix(in_oklch,var(--color-brand-gradient-a)_28%,transparent)]'
						: 'PlayModeIcon--selected PlayModeIcon--poison bg-[color-mix(in_oklch,var(--color-brand-gradient-b)_18%,var(--color-surface))] shadow-[0_0_0_1px_color-mix(in_oklch,var(--color-brand-gradient-b)_30%,transparent)]'
					: 'bg-white/70 text-dark',
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
