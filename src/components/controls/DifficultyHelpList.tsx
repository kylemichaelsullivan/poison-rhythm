import { DIFFICULTY_LEVELS, formatDifficultyHelpText } from '@/lib';
import { DifficultyHelpLevel } from './DifficultyHelpLevel';

export function DifficultyHelpList() {
	return (
		<ul className='flex flex-col gap-2 text-dark text-sm sm:gap-3'>
			{DIFFICULTY_LEVELS.map((entry, index) => {
				const level = index + 1;
				return (
					<DifficultyHelpLevel
						key={level}
						level={level}
						text={formatDifficultyHelpText(entry)}
					/>
				);
			})}
		</ul>
	);
}
