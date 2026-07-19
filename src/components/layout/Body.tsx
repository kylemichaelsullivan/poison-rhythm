import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import { GameControls, PlayControls } from '@/components/controls';
import { MeasuresSection } from '@/components/measures';
import { PoisonSection } from '@/components/poison';
import { useTheme } from '@/contexts';
import type { RhythmMeasure } from '@/types';

type BodyProps = {
	poisonRhythm: RhythmMeasure | null;
	measures: RhythmMeasure[];
	onNewPoison: () => void;
	onReusePoison: () => void;
};

export function Body({
	poisonRhythm,
	measures,
	onNewPoison,
	onReusePoison,
}: BodyProps) {
	const { subdivisionLevel } = useTheme();
	const newPoisonButtonRef = useRef<HTMLButtonElement>(null);
	const focusNewPoisonButton = useCallback(() => {
		const button = newPoisonButtonRef.current;
		if (!button) {
			return;
		}
		// Programmatic focus after a mouse click doesn’t match :focus-visible,
		// so force the ring until the button loses focus.
		button.dataset.forceFocusRing = 'true';
		button.addEventListener(
			'blur',
			() => {
				delete button.dataset.forceFocusRing;
			},
			{ once: true },
		);
		button.focus();
	}, []);

	return (
		<main
			className={clsx(
				'Body flex flex-col flex-auto items-center gap-6 w-full max-w-4xl',
				subdivisionLevel === 'quarters' && 'grid-quarters',
				subdivisionLevel === 'eighths' && 'grid-eighths',
			)}
		>
			<GameControls />

			<PoisonSection
				poisonRhythm={poisonRhythm}
				onNewPoison={onNewPoison}
				onReusePoison={onReusePoison}
				onReuseDisabledClick={focusNewPoisonButton}
				newButtonRef={newPoisonButtonRef}
			/>

			<MeasuresSection measures={measures} />

			<PlayControls
				disabled={measures.length === 0}
				onDisabledClick={focusNewPoisonButton}
			/>
		</main>
	);
}
