import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import { GameControls, PlayControls } from '@/components/controls';
import { MeasuresSection } from '@/components/measures';
import { PoisonSection } from '@/components/poison';
import { useTheme } from '@/contexts';
import { focusWithForcedRing } from '@/lib/control-classes';
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
	const playButtonRef = useRef<HTMLButtonElement>(null);

	const focusNewPoisonButton = useCallback(() => {
		focusWithForcedRing(newPoisonButtonRef.current);
	}, []);

	const focusPlayButton = useCallback(() => {
		focusWithForcedRing(playButtonRef.current);
	}, []);

	const handleNewPoison = useCallback(() => {
		onNewPoison();
		focusPlayButton();
	}, [onNewPoison, focusPlayButton]);

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
				onNewPoison={handleNewPoison}
				onReusePoison={onReusePoison}
				onReuseDisabledClick={focusNewPoisonButton}
				onEmptyClick={focusNewPoisonButton}
				newButtonRef={newPoisonButtonRef}
			/>

			<MeasuresSection
				measures={measures}
				onEmptyClick={focusNewPoisonButton}
			/>

			<PlayControls
				disabled={measures.length === 0}
				onDisabledClick={focusNewPoisonButton}
				playButtonRef={playButtonRef}
			/>
		</main>
	);
}
