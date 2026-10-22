import clsx from 'clsx';
import {
	type ContrastRating,
	type ThemeContrastScores,
	worseContrastRating,
} from '@/lib/colors';
import {
	interactiveInsetChromeClassName,
	selectionOutlineActiveClassName,
	selectionOutlinePartnerClassName,
} from '@/lib/control-classes';
import {
	type HierarchyBorderRank,
	type HierarchyBorderTone,
	hierarchyBorderClass,
	hierarchyRankForContrastGrade,
} from '@/lib/hierarchy-border';
import { ContrastGradeBadge } from './ContrastGradeBadge';
import { SelectionCheckMark } from './SelectionCheckMark';

/** How strongly this swatch marks a current Dominant/Secondary pick. */
export type CrayonSwatchEmphasis = 'active' | 'partner' | 'none';

type CrayonSwatchProps = {
	name: string;
	hex: string;
	/** Active role’s pick (strong) or the other role’s pick (softer). */
	emphasis: CrayonSwatchEmphasis;
	/** Light and Dark grades if this crayon is chosen for the active role. */
	scores: ThemeContrastScores;
	/** Role this pick would fill (Dominant or Secondary). */
	roleLabel: string;
	/** Role already using this crayon when emphasis is partner. */
	partnerRoleLabel?: string;
	onSelect: () => void;
};

function borderForEmphasis(
	emphasis: CrayonSwatchEmphasis,
	grade: ContrastRating['grade'],
): { rank: HierarchyBorderRank; tone: HierarchyBorderTone } {
	if (emphasis === 'active') {
		return { rank: 'active', tone: 'ink' };
	}
	if (emphasis === 'partner') {
		return { rank: 'emphasis', tone: 'ink' };
	}
	// Unselected: mid tone only so grade dashes don’t read as “picked”.
	const rank = hierarchyRankForContrastGrade(grade, false);
	return { rank, tone: 'mid' };
}

export function CrayonSwatch({
	name,
	hex,
	emphasis,
	scores,
	roleLabel,
	partnerRoleLabel,
	onSelect,
}: CrayonSwatchProps) {
	const limiting = worseContrastRating(scores.light, scores.dark);
	const { rank, tone } = borderForEmphasis(emphasis, limiting.grade);
	// Keep border-2 for every cell so grade/selection never shifts the tray.
	const borderRank = rank === 'structure' ? 'emphasis' : rank;
	const discourages = limiting.grade === 'F' && emphasis === 'none';
	const isActive = emphasis === 'active';
	const isPartner = emphasis === 'partner';

	const statusHint = isActive
		? `, current ${roleLabel}`
		: isPartner && partnerRoleLabel
			? `, current ${partnerRoleLabel}`
			: '';

	return (
		<button
			type='button'
			className={clsx(
				'CrayonSwatch relative aspect-square w-full rounded-sm transition-[box-shadow,border-color,opacity,outline-color]',
				interactiveInsetChromeClassName,
				hierarchyBorderClass(borderRank, tone),
				isActive && ['z-20', selectionOutlineActiveClassName],
				isPartner && ['z-10', selectionOutlinePartnerClassName],
				discourages && 'opacity-70',
			)}
			style={{ backgroundColor: hex }}
			title={`${name} — Light ${scores.light.grade} (${scores.light.ratio.toFixed(1)}:1), Dark ${scores.dark.grade} (${scores.dark.ratio.toFixed(1)}:1) if ${roleLabel}`}
			aria-label={`${name}, if chosen as ${roleLabel}: Light Mode ${scores.light.grade}, ${scores.light.ratio.toFixed(1)} to 1; Dark Mode ${scores.dark.grade}, ${scores.dark.ratio.toFixed(1)} to 1${statusHint}`}
			aria-pressed={isActive}
			onClick={onSelect}
			data-chrome-active={isActive || undefined}
			data-contrast-grade={limiting.grade}
			data-contrast-grade-light={scores.light.grade}
			data-contrast-grade-dark={scores.dark.grade}
			data-swatch-emphasis={emphasis}
			data-testid={`crayon-swatch-${name.toLowerCase().replace(/\s+/g, '-')}`}
		>
			<span className='pointer-events-none absolute top-0.5 right-0.5 z-10 flex flex-col gap-0.5'>
				<ContrastGradeBadge grade={scores.light.grade} mode='light' />
				<ContrastGradeBadge grade={scores.dark.grade} mode='dark' />
			</span>
			{isActive ? <SelectionCheckMark /> : null}
			{isPartner ? <SelectionCheckMark muted /> : null}
		</button>
	);
}
