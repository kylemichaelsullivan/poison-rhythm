import clsx from 'clsx';
import type { ContrastGrade } from '@/lib/colors';
import { focusVisibleRingClassName } from '@/lib/control-classes';
import {
	type HierarchyBorderRank,
	type HierarchyBorderTone,
	hierarchyBorderClass,
	hierarchyRankForContrastGrade,
} from '@/lib/hierarchy-border';
import { ContrastGradeBadge } from './ContrastGradeBadge';

/** How strongly this swatch marks a current Dominant/Secondary pick. */
export type CrayonSwatchEmphasis = 'active' | 'partner' | 'none';

type CrayonSwatchProps = {
	name: string;
	hex: string;
	/** Active role’s pick (strong) or the other role’s pick (softer). */
	emphasis: CrayonSwatchEmphasis;
	grade: ContrastGrade;
	ratio: number;
	/** Role this pick would fill (Dominant or Secondary). */
	roleLabel: string;
	/** Role already using this crayon when emphasis is partner. */
	partnerRoleLabel?: string;
	onSelect: () => void;
};

function borderForEmphasis(
	emphasis: CrayonSwatchEmphasis,
	grade: ContrastGrade,
): { rank: HierarchyBorderRank; tone: HierarchyBorderTone } {
	if (emphasis === 'active') {
		return { rank: 'active', tone: 'ink' };
	}
	if (emphasis === 'partner') {
		return { rank: 'emphasis', tone: 'ink' };
	}
	const rank = hierarchyRankForContrastGrade(grade, false);
	const tone: HierarchyBorderTone =
		rank === 'provisional'
			? 'ink'
			: grade === 'AAA' || grade === 'AA'
				? 'ink'
				: 'mid';
	return { rank, tone };
}

export function CrayonSwatch({
	name,
	hex,
	emphasis,
	grade,
	ratio,
	roleLabel,
	partnerRoleLabel,
	onSelect,
}: CrayonSwatchProps) {
	const { rank, tone } = borderForEmphasis(emphasis, grade);
	const discourages = grade === 'Fail' && emphasis === 'none';
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
				'CrayonSwatch relative aspect-square w-full rounded-sm transition-[box-shadow,transform,border-color,opacity]',
				focusVisibleRingClassName,
				hierarchyBorderClass(rank, tone),
				isActive && 'z-20 scale-105 shadow-raised',
				isPartner && 'z-10 scale-[1.03] shadow-soft',
				emphasis === 'none' && 'shadow-soft hover:border-black',
				discourages && 'opacity-70',
			)}
			style={{ backgroundColor: hex }}
			title={`${name} — pair becomes WCAG ${grade} if ${roleLabel} (${ratio.toFixed(1)}:1)`}
			aria-label={`${name}, pair becomes WCAG ${grade} if chosen as ${roleLabel}, ${ratio.toFixed(1)} to 1${statusHint}`}
			aria-pressed={isActive}
			onClick={onSelect}
			data-contrast-grade={grade}
			data-swatch-emphasis={emphasis}
			data-testid={`crayon-swatch-${name.toLowerCase().replace(/\s+/g, '-')}`}
		>
			<ContrastGradeBadge grade={grade} />
		</button>
	);
}
