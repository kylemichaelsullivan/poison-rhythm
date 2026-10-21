import clsx from 'clsx';
import type { RhythmRenderMode } from '@/lib/settings-schema';

type DisplayModeBadgeProps = {
	renderMode: RhythmRenderMode;
};

const RENDER_LABEL: Record<RhythmRenderMode, string> = {
	grid: 'GRID',
	notation: 'NOTATION',
};

export function DisplayModeBadge({ renderMode }: DisplayModeBadgeProps) {
	return (
		<span
			className={clsx(
				'DisplayModeBadge inline-flex items-center rounded border-2 border-secondary bg-surface px-2.5 py-1 text-sm font-bold tracking-wide text-black transition-colors',
				'group-hover:bg-primary group-hover:text-on-primary group-focus-visible:bg-primary group-focus-visible:text-on-primary',
			)}
			data-testid='display-mode-badge'
			data-render-mode={renderMode}
		>
			{RENDER_LABEL[renderMode]}
		</span>
	);
}
