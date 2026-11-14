import { DifficultyControls, PlayModeControls } from '@/components/controls';
import { Stack } from '@/components/ui';
import { Modal } from '../Modal';
import { AboutBrandHeader } from './AboutBrandHeader';
import { useAboutPoisonRhythm } from './AboutPoisonRhythmContext';

/** App-level host for the title About modal (brand + Mode + Difficulty). */
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
			<div className='mt-4 w-full'>
				<Stack gap='4'>
					<PlayModeControls />
					<DifficultyControls />
				</Stack>
			</div>
		</Modal>
	);
}
