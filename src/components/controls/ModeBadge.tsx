import clsx from 'clsx';
import type { GameModeHudBadge } from '@/lib/settings-schema';

/** Solid fg/bg for WCAG AAA contrast; tone is carried by the border. */
const TONE_CLASS: Record<GameModeHudBadge['tone'], string> = {
	endless:
		'border-primary-border bg-primary/15 text-primary shadow-soft group-hover:border-primary group-focus-visible:border-primary',
	bucket:
		'border-primary/40 bg-primary/10 text-dark shadow-soft group-hover:border-primary group-focus-visible:border-primary',
	classic:
		'border-mid bg-chrome text-dark shadow-control group-hover:border-primary group-focus-visible:border-primary',
};

type ModeBadgeProps = {
	badge: GameModeHudBadge;
};

export function ModeBadge({ badge }: ModeBadgeProps) {
	return (
		<span
			className={clsx(
				'ModeBadge inline-flex items-center rounded border px-2.5 py-1 text-sm font-bold tracking-wide transition-colors',
				TONE_CLASS[badge.tone],
			)}
			data-testid='mode-badge'
			data-mode-tone={badge.tone}
		>
			{badge.label}
		</span>
	);
}
