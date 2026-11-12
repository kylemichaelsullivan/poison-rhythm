import { ModeBadgeTrigger } from '@/components/controls';
import { useSettings } from '@/contexts';
import { resolveGameModeHudBadge } from '@/lib/settings-schema';
import { AboutPoisonRhythmButton, useAboutPoisonRhythm } from './about';

export function AppTitle() {
	const { settings } = useSettings();
	const modeBadge = resolveGameModeHudBadge(settings);
	const { openAbout } = useAboutPoisonRhythm();

	return (
		<div className='AppTitle flex min-w-0 items-center justify-center gap-2 justify-self-center overflow-visible'>
			<h1 className='min-w-0 text-center'>
				<AboutPoisonRhythmButton variant='title' />
			</h1>
			<ModeBadgeTrigger
				badge={modeBadge}
				label='Mode and Difficulty'
				title='Mode and Difficulty'
				onClick={openAbout}
			/>
		</div>
	);
}
