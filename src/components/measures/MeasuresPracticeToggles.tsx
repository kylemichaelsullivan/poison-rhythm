import EarIcon from '@/assets/svg/ear.svg?react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import { IconToggle } from '@/components/layout/settings';
import { useSetting } from '@/components/layout/settings/useSetting';
import { Row } from '@/components/ui';

/** Measures header: Show Next Measure (eye) and Listen Before You Play (ear). */
export function MeasuresPracticeToggles() {
	const [showNext, setShowNext] = useSetting('showNextMeasure');
	const [demoBeforePlay, setDemoBeforePlay] = useSetting('demoBeforePlay');

	return (
		<Row gap='2' align='center'>
			<IconToggle
				label={showNext ? 'Show Next Measure: On' : 'Show Next Measure: Off'}
				title={
					showNext ? 'Click to Hide Next Measure' : 'Click to Show Next Measure'
				}
				pressed={showNext}
				pressedIcon={EyeIcon}
				unpressedIcon={EyeIcon}
				variant='header'
				grow={false}
				onPressedChange={setShowNext}
			/>
			<IconToggle
				label={
					demoBeforePlay
						? 'Listen Before You Play: On'
						: 'Listen Before You Play: Off'
				}
				title={
					demoBeforePlay
						? 'Click to Disable Listen Before You Play'
						: 'Click to Enable Listen Before You Play'
				}
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
