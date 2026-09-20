import { AboutPoisonRhythmButton } from './about';

export function Copyright() {
	const currentYear = new Date().getFullYear();

	return (
		<span className='Copyright min-w-0 shrink truncate text-center select-none text-sm max-[360px]:text-xs'>
			&copy; {currentYear} <AboutPoisonRhythmButton />
		</span>
	);
}
