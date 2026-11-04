import { AboutPoisonRhythmButton } from './about';

export function Copyright() {
	const currentYear = new Date().getFullYear();

	return (
		<span className='Copyright min-w-0 shrink overflow-visible text-center text-sm max-phone:text-xs'>
			<AboutPoisonRhythmButton>
				&copy; {currentYear} Poison Rhythm
			</AboutPoisonRhythmButton>
		</span>
	);
}
