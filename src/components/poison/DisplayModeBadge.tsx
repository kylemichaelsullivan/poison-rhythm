import clsx from 'clsx';
import { displayModeBadgeLabel } from '@/lib/settings-labels';
import type { RhythmRenderMode } from '@/lib/settings-schema';

type DisplayModeBadgeProps = {
	renderMode: RhythmRenderMode;
};

export function DisplayModeBadge({ renderMode }: DisplayModeBadgeProps) {
	return (
		<span
			className={clsx(
				'DisplayModeBadge inline-flex items-center rounded border-2 border-secondary bg-surface px-2.5 py-1 text-sm font-bold tracking-wide text-black',
			)}
			data-testid='display-mode-badge'
			data-render-mode={renderMode}
		>
			{displayModeBadgeLabel(renderMode)}
		</span>
	);
}
