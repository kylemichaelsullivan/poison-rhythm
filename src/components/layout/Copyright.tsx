import { AboutPoisonRhythmButton } from './about';

export function Copyright() {
	const currentYear = new Date().getFullYear();

	return (
		<span className='Copyright select-none'>
			&copy; {currentYear} <AboutPoisonRhythmButton />
		</span>
	);
}
