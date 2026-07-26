import { useState } from 'react';
import { Modal, Section } from '@/components/layout';
import { useDifficulty } from '@/contexts';
import { DIFFICULTY_LEVELS, formatDifficultyHelpText } from '@/lib';
import { DifficultySlider } from '.';

export function GameControls() {
	const { difficulty, setDifficulty } = useDifficulty();
	const [helpOpen, setHelpOpen] = useState(false);

	return (
		<>
			<Section
				title='Difficulty'
				headerAction={
					<button
						type='button'
						className='flex justify-center items-center rounded-full border border-mid bg-surface-muted size-6 text-sm font-semibold leading-none text-black transition-colors hover:border-primary hover:bg-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
						title='Explain Difficulties'
						aria-label='Explain Difficulty Levels'
						onClick={() => setHelpOpen(true)}
					>
						i
					</button>
				}
			>
				<DifficultySlider value={difficulty} onChange={setDifficulty} />
			</Section>
			<Modal
				open={helpOpen}
				title='Difficulty Levels'
				onClose={() => setHelpOpen(false)}
			>
				<ul className='flex flex-col gap-3 text-dark text-sm'>
					{DIFFICULTY_LEVELS.map((entry, index) => {
						const level = index + 1;
						return (
							<li key={level} className='flex gap-3'>
								<span className='font-bold tabular-nums'>{level}</span>
								<span>{formatDifficultyHelpText(entry)}</span>
							</li>
						);
					})}
				</ul>
			</Modal>
		</>
	);
}
