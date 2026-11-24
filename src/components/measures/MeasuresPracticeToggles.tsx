import EyeIcon from '@/assets/svg/eye.svg?react';
import PreviewIcon from '@/assets/svg/look.svg?react';
import { StatusIconToggle } from '@/components/layout/settings/StatusIconToggle';
import { useSetting } from '@/components/layout/settings/useSetting';
import { Row } from '@/components/ui';
import { PRACTICE_TOGGLE_LABELS } from '@/lib/settings-labels';

/** Measures header: Show Next Measure (eye) and Preview Before (preview). */
export function MeasuresPracticeToggles() {
	const [showNext, setShowNext] = useSetting('showNextMeasure');
	const [demoBeforePlay, setDemoBeforePlay] = useSetting('demoBeforePlay');

	return (
		<Row gap='2' align='center'>
			<StatusIconToggle
				name={PRACTICE_TOGGLE_LABELS.showNextMeasure}
				titleSubject='Next Measure'
				strategy='showHide'
				pressed={showNext}
				pressedIcon={EyeIcon}
				unpressedIcon={EyeIcon}
				variant='header'
				grow={false}
				onPressedChange={setShowNext}
			/>
			<StatusIconToggle
				name={PRACTICE_TOGGLE_LABELS.demoBeforePlay}
				strategy='enableDisable'
				pressed={demoBeforePlay}
				pressedIcon={PreviewIcon}
				unpressedIcon={PreviewIcon}
				variant='header'
				grow={false}
				onPressedChange={setDemoBeforePlay}
			/>
		</Row>
	);
}
