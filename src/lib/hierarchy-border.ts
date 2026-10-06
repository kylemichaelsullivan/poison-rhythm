/**
 * Shared border hierarchy — weight + style signal order; tone is secondary.
 *
 * | Rank          | Style                         | Typical use                                      |
 * |---------------|-------------------------------|--------------------------------------------------|
 * | `active`      | `border-2` solid              | Selected control, Playing measure, grade A/B     |
 * | `emphasis`    | `border-2` solid (softer)     | Idle measure shell, grade C, strong unselected   |
 * | `structure`   | `border` solid                | Nested beat groups, quiet unselected swatches    |
 * | `provisional` | `border-2` dashed             | Count-in / Listening, grade F, muted / incomplete|
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

/** Map a WCAG letter grade to swatch border rank (encourages A/B). */
export function hierarchyRankForContrastGrade(
	grade: 'A' | 'B' | 'C' | 'F',
	selected: boolean,
): HierarchyBorderRank {
	if (grade === 'F') {
		return 'provisional';
	}
	if (selected) {
		return grade === 'C' ? 'emphasis' : 'active';
	}
	if (grade === 'A' || grade === 'B') {
		return 'emphasis';
	}
	return 'structure';
}
