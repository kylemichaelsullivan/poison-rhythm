import clsx from 'clsx';
import { GameControls } from '@/components/controls';
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
	return (
		<main
			className={clsx(
				'Body flex flex-col flex-auto items-center gap-6 w-full max-w-4xl',
				subdivisionLevel === 'quarters' && 'grid-quarters',
				subdivisionLevel === 'eighths' && 'grid-eighths',
			)}
		>
			<GameControls
				onNewPoison={onNewPoison}
				onReusePoison={onReusePoison}
				reuseDisabled={poisonRhythm === null}
			/>

			<PoisonSection poisonRhythm={poisonRhythm} />

			<MeasuresSection measures={measures} />
		</main>
	);
}
