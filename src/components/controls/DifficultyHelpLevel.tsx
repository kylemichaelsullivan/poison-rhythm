import clsx from 'clsx';
import { focusVisibleRingClassName } from '@/lib/control-classes';

type DifficultyHelpLevelProps = {
	level: number;
	text: string;
	selected?: boolean;
	onSelect: (level: number) => void;
};

export function DifficultyHelpLevel({
	level,
	text,
	selected = false,
	onSelect,
}: DifficultyHelpLevelProps) {
	return (
		<li>
			<button
				type='button'
				aria-pressed={selected}
				aria-label={`Difficulty ${level}: ${text}`}
				title={`Set Difficulty to ${level}`}
				className={clsx(
					'flex w-full gap-2 rounded-md px-1.5 py-1 text-left transition-[box-shadow]',
					focusVisibleRingClassName,
					'hover:shadow-soft focus-visible:shadow-soft',
					selected ? 'font-bold text-black' : 'font-normal text-dark',
				)}
				onClick={() => onSelect(level)}
			>
				<span className='w-4 shrink-0 tabular-nums'>{level}</span>
				<span>{text}</span>
			</button>
		</li>
	);
}
