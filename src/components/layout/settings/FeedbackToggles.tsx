import EarIcon from '@/assets/svg/ear.svg?react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import {
	feedbackModeFromToggles,
	feedbackTogglesFromMode,
} from '@/lib/settings-schema';
import { StatusIconToggle } from './StatusIconToggle';
import { useUpdateSetting } from './useUpdateSetting';

/** Visual / audio feedback gates — binds to global game settings. */
export function FeedbackToggles() {
	const { settings, set } = useUpdateSetting();
	const { visual, audio } = feedbackTogglesFromMode(settings.feedbackMode);

	return (
		<div className='FeedbackToggles flex w-full flex-wrap items-center gap-2'>
			<StatusIconToggle
				name='Visual Feedback'
				strategy='enableDisable'
				labelMode='plain'
				pressed={visual}
				pressedIcon={EyeIcon}
				unpressedIcon={EyeIcon}
				grow='auto'
				onPressedChange={(next) =>
					set('feedbackMode', feedbackModeFromToggles(next, audio))
				}
			/>
			<StatusIconToggle
				name='Audio Feedback'
				strategy='enableDisable'
				labelMode='plain'
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
