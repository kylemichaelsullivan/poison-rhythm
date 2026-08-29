import EyeIcon from '@/assets/svg/eye.svg?react';
import HeadphoneIcon from '@/assets/svg/headphone.svg?react';
import { Row } from '@/components/ui';
import {
	type FeedbackMode,
	feedbackModeFromToggles,
	feedbackTogglesFromMode,
} from '@/lib/settings-schema';
import { IconToggle } from './IconToggle';

type FeedbackTogglesProps = {
	value: FeedbackMode;
	onChange: (value: FeedbackMode) => void;
};

export function FeedbackToggles({ value, onChange }: FeedbackTogglesProps) {
	const { visual, audio } = feedbackTogglesFromMode(value);

	return (
		<Row gap='2' align='center' fullWidth>
			<IconToggle
				label='Visual Feedback'
				title={visual ? 'Disable Visual Feedback' : 'Enable Visual Feedback'}
				pressed={visual}
				pressedIcon={EyeIcon}
				unpressedIcon={EyeIcon}
				grow='auto'
				onPressedChange={(next) =>
					onChange(feedbackModeFromToggles(next, audio))
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
					onChange(feedbackModeFromToggles(visual, next))
				}
			/>
		</Row>
	);
}
