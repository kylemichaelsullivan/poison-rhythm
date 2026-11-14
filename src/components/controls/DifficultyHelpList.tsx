import { usePendingDifficulty, useSubdivision } from '@/contexts';
import { DIFFICULTY_LEVELS, formatDifficultyHelpText } from '@/lib';
import { DifficultyHelpLevel } from './DifficultyHelpLevel';

export function DifficultyHelpList() {
	const { subdivisionLevel } = useSubdivision();
	const { sliderValue, onDifficultyChange } = usePendingDifficulty();

	return (
		<ul className='flex flex-col gap-1 text-sm'>
			{DIFFICULTY_LEVELS.map((_, index) => {
				const level = index + 1;
				return (
					<DifficultyHelpLevel
						key={level}
						level={level}
						selected={level === sliderValue}
						text={formatDifficultyHelpText(level, subdivisionLevel)}
						onSelect={onDifficultyChange}
					/>
				);
			})}
		</ul>
	);
}
