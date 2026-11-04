import EarIcon from '@/assets/svg/ear.svg?react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import {
	feedbackModeFromToggles,
	feedbackTogglesFromMode,
} from '@/lib/settings-schema';
import { IconToggle } from './IconToggle';
import { useUpdateSetting } from './useUpdateSetting';

/** Visual / audio feedback gates — binds to global game settings. */
export function FeedbackToggles() {
	const { settings, set } = useUpdateSetting();
	const { visual, audio } = feedbackTogglesFromMode(settings.feedbackMode);

	return (
		<div className='FeedbackToggles flex w-full flex-wrap items-center gap-2'>
			<IconToggle
				label='Visual Feedback'
				title={
					visual
						? 'Click to Disable Visual Feedback'
						: 'Click to Enable Visual Feedback'
				}
				pressed={visual}
				pressedIcon={EyeIcon}
				unpressedIcon={EyeIcon}
				grow='auto'
				onPressedChange={(next) =>
					set('feedbackMode', feedbackModeFromToggles(next, audio))
				}
			/>
			<IconToggle
				label='Audio Feedback'
				title={
					audio
						? 'Click to Disable Audio Feedback'
						: 'Click to Enable Audio Feedback'
				}
				pressed={audio}
				pressedIcon={EarIcon}
				unpressedIcon={EarIcon}
				grow='auto'
				onPressedChange={(next) =>
					set('feedbackMode', feedbackModeFromToggles(visual, next))
				}
			/>
		</div>
	);
}
