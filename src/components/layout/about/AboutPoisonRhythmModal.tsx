import { DifficultyControls } from '@/components/controls';
import { Modal } from '../Modal';
import { AboutBrandHeader } from './AboutBrandHeader';
import { useAboutPoisonRhythm } from './AboutPoisonRhythmContext';

/** App-level host for the title About modal. */
export function AboutPoisonRhythmModal() {
	const { open, closeAbout } = useAboutPoisonRhythm();

	return (
		<Modal
			open={open}
			size='md'
			ariaLabel='About Poison Rhythm'
			onClose={closeAbout}
		>
			<AboutBrandHeader version={__APP_VERSION__} />
			<div className='mt-2 w-full border-t border-primary/20 pt-4'>
				<DifficultyControls />
			</div>
		</Modal>
	);
}
