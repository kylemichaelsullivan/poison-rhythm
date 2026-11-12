import clsx from 'clsx';
import { PlayModeBucketGlyph } from './PlayModeBucketGlyph';
import { PlayModePoisonGlyph } from './PlayModePoisonGlyph';
import type { GameModeHudBadge } from '@/lib/settings-schema';

type ModeBadgeProps = {
	badge: GameModeHudBadge;
};

/** Play-mode icon. Endless uses the same chrome with an infinity overlay. */
export function ModeBadge({ badge }: ModeBadgeProps) {
	return (
		<span
			className={clsx(
				'ModeBadge relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-surface text-black transition-[border-color] duration-200 ease-out',
			)}
			data-testid='mode-badge'
			data-mode-tone={badge.tone}
			data-endless={badge.endless ? 'true' : 'false'}
		>
			{badge.tone === 'bucket' ? (
				<PlayModeBucketGlyph active={false} size='sm' />
			) : (
				<PlayModePoisonGlyph size='sm' />
			)}
			{badge.endless ? (
				<span
					className='pointer-events-none absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-surface-muted text-2xs font-bold leading-none text-dark ring-1 ring-mid'
					aria-hidden
				>
					∞
				</span>
			) : null}
		</span>
	);
}
