import { Section } from '@/components/layout';
import { useDifficulty } from '@/contexts/DifficultyContext';
import { ControlButtons } from './ControlButtons';
import { DifficultySlider } from './DifficultySlider';

type GameControlsProps = {
	onNewPoison: () => void;
	onReusePoison: () => void;
	reuseDisabled?: boolean;
};

export function GameControls({
	onNewPoison,
	onReusePoison,
	reuseDisabled = false,
}: GameControlsProps) {
	const { difficulty, setDifficulty } = useDifficulty();

	return (
		<Section title='Controls'>
			<DifficultySlider value={difficulty} onChange={setDifficulty} />
			<ControlButtons
				onNewPoison={onNewPoison}
				onReusePoison={onReusePoison}
				reuseDisabled={reuseDisabled}
			/>
		</Section>
	);
}
