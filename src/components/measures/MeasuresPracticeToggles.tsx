import EarIcon from '@/assets/svg/ear.svg?react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import { StatusIconToggle } from '@/components/layout/settings/StatusIconToggle';
import { useSetting } from '@/components/layout/settings/useSetting';
import { Row } from '@/components/ui';
import { PRACTICE_TOGGLE_LABELS } from '@/lib/settings-labels';

/** Measures header: Show Next Measure (eye) and Listen Before You Play (ear). */
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
				pressedIcon={EarIcon}
				unpressedIcon={EarIcon}
				variant='header'
				grow={false}
				onPressedChange={setDemoBeforePlay}
			/>
		</Row>
	);
}
