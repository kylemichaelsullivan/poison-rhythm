import { DIFFICULTY_LEVELS, formatDifficultyHelpText } from '@/lib';
import { DifficultyHelpLevel } from './DifficultyHelpLevel';

export function DifficultyHelpList() {
	return (
		<ul className='flex flex-col gap-3 text-dark text-sm'>
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
