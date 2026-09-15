import clsx from 'clsx';
import type { RhythmRenderMode } from '@/lib/settings-schema';

type DisplayModeBadgeProps = {
	renderMode: RhythmRenderMode;
	scrollEnabled: boolean;
};

const RENDER_LABEL: Record<RhythmRenderMode, string> = {
	grid: 'GRID',
	notation: 'NOTATION',
};

export function DisplayModeBadge({
	renderMode,
	scrollEnabled,
}: DisplayModeBadgeProps) {
	const label = scrollEnabled
		? `${RENDER_LABEL[renderMode]} · SCROLL`
		: RENDER_LABEL[renderMode];

	return (
		<span
			className={clsx(
				'DisplayModeBadge inline-flex items-center rounded border px-2.5 py-1 text-sm font-bold tracking-wide transition-colors',
				scrollEnabled
					? 'border-primary-border bg-primary/15 text-primary shadow-soft group-hover:border-primary group-focus-visible:border-primary'
					: 'border-mid bg-chrome text-dark shadow-control group-hover:border-primary group-focus-visible:border-primary',
			)}
			data-testid='display-mode-badge'
			data-render-mode={renderMode}
			data-scroll={scrollEnabled ? 'on' : 'off'}
		>
			{label}
		</span>
	);
}
