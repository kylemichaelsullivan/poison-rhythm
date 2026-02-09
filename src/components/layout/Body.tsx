import { GameControls } from '@/components/controls';
import { MeasuresSection } from '@/components/measures';
import { PoisonSection } from '@/components/poison';
import type { RhythmMeasure } from '@/types/rhythm';

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
	return (
		<main className='Body flex flex-col flex-auto items-center gap-6 w-full max-w-4xl'>
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
