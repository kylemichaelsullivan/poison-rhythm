type DifficultyHelpLevelProps = {
	level: number;
	text: string;
};

export function DifficultyHelpLevel({ level, text }: DifficultyHelpLevelProps) {
	return (
		<li className='flex gap-2 sm:gap-3'>
			<span className='shrink-0 font-bold tabular-nums'>{level}</span>
			<span>{text}</span>
		</li>
	);
}
