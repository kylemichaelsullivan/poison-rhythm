/**
 * Shared border hierarchy — weight + style signal order; tone is secondary.
 *
 * | Rank          | Style                         | Typical use                                      |
 * |---------------|-------------------------------|--------------------------------------------------|
 * | `active`      | `border-2` solid              | Selected control, Playing measure, AAA/AA        |
 * | `emphasis`    | `border-2` solid (softer)     | Idle measure shell, UI grade, strong unselected  |
 * | `structure`   | `border` solid                | Nested beat groups, quiet unselected swatches    |
 * | `provisional` | `border-2` dashed             | Count-in / Listening, Fail grade, muted          |
 *
 * Keep `border-2` vs `border` consistent within a layer so layout does not jump.
 * Jazz Mode (and any future note chrome) should import these helpers rather than
 * inventing a parallel dashed/solid language.
 */

import clsx from 'clsx';

export type HierarchyBorderRank =
	| 'active'
	| 'emphasis'
	| 'structure'
	| 'provisional';

export type HierarchyBorderTone =
	| 'ink'
	| 'primary'
	| 'secondary'
	| 'mid'
	| 'primary-soft'
	| 'secondary-soft';

const TONE_SOLID: Record<HierarchyBorderTone, string> = {
	ink: 'border-black',
	primary: 'border-primary',
	secondary: 'border-secondary',
	mid: 'border-mid',
	'primary-soft': 'border-primary/30',
	'secondary-soft': 'border-secondary/40',
};

/** Border width + style for a hierarchy rank (no color). */
export function hierarchyBorderWeightClass(rank: HierarchyBorderRank): string {
	switch (rank) {
		case 'active':
		case 'emphasis':
			return 'border-2 border-solid';
		case 'structure':
			return 'border border-solid';
		case 'provisional':
			return 'border-2 border-dashed';
	}
}

/** Full border utility: rank weight/style + tone color. */
export function hierarchyBorderClass(
	rank: HierarchyBorderRank,
	tone: HierarchyBorderTone = 'ink',
): string {
	return clsx(hierarchyBorderWeightClass(rank), TONE_SOLID[tone]);
}

/** Map a WCAG contrast label to swatch border rank (encourages AAA/AA). */
export function hierarchyRankForContrastGrade(
	grade: 'AAA' | 'AA' | 'UI' | 'Fail',
	selected: boolean,
): HierarchyBorderRank {
	if (grade === 'Fail') {
		return 'provisional';
	}
	if (selected) {
		return grade === 'UI' ? 'emphasis' : 'active';
	}
	if (grade === 'AAA' || grade === 'AA') {
		return 'emphasis';
	}
	return 'structure';
}
