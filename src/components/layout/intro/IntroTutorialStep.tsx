import { Stack } from '@/components/ui';
import { INTRO_POISON_BEATS, quarterNoteMeasure } from '@/lib/intro-tutorial';
import { Section } from '../Section';
import { IntroTutorialFailOverlay } from './IntroTutorialFailOverlay';
import { IntroTutorialMeasure } from './IntroTutorialMeasure';
import type { IntroTutorialStepData } from '@/lib/intro-tutorial';

type IntroTutorialStepProps = {
	step: IntroTutorialStepData;
};

/** Poison reference on every slide, then the current measure. */
export function IntroTutorialStep({ step }: IntroTutorialStepProps) {
	return (
		<Stack gap='4'>
			<Section title='Poison Rhythm'>
				<IntroTutorialMeasure
					measure={quarterNoteMeasure(INTRO_POISON_BEATS)}
				/>
			</Section>
			<p
				className='text-center text-sm font-semibold leading-5 text-black'
				aria-live='polite'
			>
				{step.prompt}
			</p>
			<Section title='Measure'>
				<IntroTutorialMeasure measure={quarterNoteMeasure(step.beats)}>
					{step.isPoison ? <IntroTutorialFailOverlay /> : null}
				</IntroTutorialMeasure>
			</Section>
		</Stack>
	);
}
