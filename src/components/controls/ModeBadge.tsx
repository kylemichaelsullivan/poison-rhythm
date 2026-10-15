import clsx from 'clsx';
import { sectionTitleClassName } from '@/components/layout/SectionTitle';
import type { GameModeHudBadge } from '@/lib/settings-schema';
import { PlayModeBucketGlyph } from './PlayModeBucketGlyph';
import { PlayModePoisonGlyph } from './PlayModePoisonGlyph';

type ModeBadgeProps = {
	badge: GameModeHudBadge;
};

/** Play-mode icon. Endless uses the same chrome with an infinity overlay. */
export function ModeBadge({ badge }: ModeBadgeProps) {
	return (
		<span
			className='ModeBadge inline-flex items-center gap-2'
			data-testid='mode-badge'
			data-mode-tone={badge.tone}
			data-endless={badge.endless ? 'true' : 'false'}
		>
			<span
				className={clsx(
					'relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-surface text-black shadow-control transition-[colors,box-shadow]',
					'group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-soft',
					'group-focus-visible:border-primary',
				)}
			>
				{badge.tone === 'bucket' ? (
					<PlayModeBucketGlyph active={false} size='sm' />
				) : (
					<PlayModePoisonGlyph size='sm' />
				)}
				{badge.endless ? (
					<span
						className='pointer-events-none absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold leading-none text-dark ring-1 ring-mid'
						aria-hidden
					>
						∞
					</span>
				) : null}
			</span>
			<span className={clsx(sectionTitleClassName, 'whitespace-nowrap')}>
				{badge.label}
			</span>
		</span>
	);
}
