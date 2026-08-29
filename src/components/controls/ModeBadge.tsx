import clsx from 'clsx';
import type { GameModeHudBadge } from '@/lib/settings-schema';

/** Solid fg/bg for WCAG AAA contrast; tone is carried by the border. */
const TONE_CLASS: Record<GameModeHudBadge['tone'], string> = {
	endless: 'border-primary bg-chrome text-black',
	bucket: 'border-mid bg-chrome text-black',
	classic: 'border-mid bg-chrome text-black',
};

type ModeBadgeProps = {
	badge: GameModeHudBadge;
};

export function ModeBadge({ badge }: ModeBadgeProps) {
	return (
		<span
			className={clsx(
				'ModeBadge inline-flex items-center rounded border px-2.5 py-1 text-sm font-bold tracking-wide',
				TONE_CLASS[badge.tone],
			)}
			data-testid='mode-badge'
			data-mode-tone={badge.tone}
		>
			{badge.label}
		</span>
	);
}
