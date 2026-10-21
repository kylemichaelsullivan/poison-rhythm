import EyeIcon from '@/assets/svg/eye.svg?react';
import HeadphoneIcon from '@/assets/svg/headphone.svg?react';
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
				title={visual ? 'Disable Visual Feedback' : 'Enable Visual Feedback'}
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
				title={audio ? 'Disable Audio Feedback' : 'Enable Audio Feedback'}
				pressed={audio}
				pressedIcon={HeadphoneIcon}
				unpressedIcon={HeadphoneIcon}
				grow='auto'
				onPressedChange={(next) =>
					set('feedbackMode', feedbackModeFromToggles(visual, next))
				}
			/>
		</div>
	);
}
