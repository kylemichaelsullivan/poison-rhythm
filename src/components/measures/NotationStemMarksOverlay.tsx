import { MEASURE_LENGTH } from '@/types';
import type { ReactNode } from 'react';
import type { NotationLayoutSlot, NotationStep } from '@/lib/notation';

type NotationStemMarksOverlayProps = {
	steps: NotationStep[];
	layout: ReadonlyMap<number, NotationLayoutSlot>;
	show: boolean;
	className: string;
	markClassName: string;
	predicate: (step: NotationStep) => boolean;
	renderMark: (step: NotationStep) => ReactNode;
};

/**
 * Absolute layer of stem-aligned marks (accent / sticking). Public overlays
 * stay thin wrappers that pass predicate + mark child.
 */
export function NotationStemMarksOverlay({
	steps,
	layout,
	show,
	className,
	markClassName,
	predicate,
	renderMark,
}: NotationStemMarksOverlayProps) {
	if (!show) {
		return null;
	}

	const unit = 100 / MEASURE_LENGTH;

	return (
		<div className={className} aria-hidden>
			{steps.map((step) => {
				if (!predicate(step)) return null;
				const slot = layout.get(step.stepIndex);
				if (!slot) return null;
				return (
					<span
						key={step.stepIndex}
						className={markClassName}
						style={{
							left: `${slot.stemX * unit}%`,
							transform: 'translateX(-50%)',
						}}
					>
						{renderMark(step)}
					</span>
				);
			})}
		</div>
	);
}
