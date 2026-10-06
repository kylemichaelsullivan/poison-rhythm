import clsx from 'clsx';
import type { ContrastGrade } from '@/lib/colors';
import { focusVisibleRingClassName } from '@/lib/control-classes';
import {
	hierarchyBorderClass,
	hierarchyRankForContrastGrade,
} from '@/lib/hierarchy-border';

type CrayonSwatchProps = {
	name: string;
	hex: string;
	selected: boolean;
	grade: ContrastGrade;
	ratio: number;
	/** Other role name for accessible labeling (e.g. Secondary). */
	partnerLabel: string;
	onSelect: () => void;
};

/** Compact WCAG letter chip — ink chrome so crayon fill cannot wash it out. */
function GradeBadge({ grade }: { grade: ContrastGrade }) {
	const encourage = grade === 'A' || grade === 'B';
	return (
		<span
			className={clsx(
				'pointer-events-none absolute top-0.5 right-0.5 z-10 flex size-4 items-center justify-center rounded-[2px] text-[0.55rem] font-bold leading-none',
				encourage
					? 'bg-black text-white'
					: grade === 'C'
						? 'bg-chrome text-black border border-black'
						: 'bg-chrome text-mid border border-dashed border-black',
			)}
			aria-hidden='true'
		>
			{grade}
		</span>
	);
}

export function CrayonSwatch({
	name,
	hex,
	selected,
	grade,
	ratio,
	partnerLabel,
	onSelect,
}: CrayonSwatchProps) {
	const rank = hierarchyRankForContrastGrade(grade, selected);
	const tone =
		rank === 'provisional'
			? 'ink'
			: selected
				? 'ink'
				: grade === 'A' || grade === 'B'
					? 'ink'
					: 'mid';
	const discourages = grade === 'F';

	return (
		<button
			type='button'
			className={clsx(
				'CrayonSwatch relative aspect-square w-full rounded-sm transition-[box-shadow,transform,border-color,opacity]',
				focusVisibleRingClassName,
				hierarchyBorderClass(rank, tone),
				selected && 'shadow-raised scale-105 z-10',
				!selected && 'shadow-soft hover:border-black',
				discourages && !selected && 'opacity-70',
			)}
			style={{ backgroundColor: hex }}
			title={`${name} — ${grade} vs ${partnerLabel} (${ratio.toFixed(1)}:1)`}
			aria-label={`${name}, contrast grade ${grade} versus ${partnerLabel}, ${ratio.toFixed(1)} to 1`}
			aria-pressed={selected}
			onClick={onSelect}
			data-contrast-grade={grade}
			data-testid={`crayon-swatch-${name.toLowerCase().replace(/\s+/g, '-')}`}
		>
			<GradeBadge grade={grade} />
		</button>
	);
}
