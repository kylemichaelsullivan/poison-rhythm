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
		<div className='flex flex-col'>
			<Section title='Poison Rhythm'>
				<IntroTutorialMeasure
					measure={quarterNoteMeasure(INTRO_POISON_BEATS)}
				/>
			</Section>
			<p className='pt-5 pb-1 text-center text-sm font-semibold leading-5 text-black'>
				{step.prompt}
			</p>
			<Section title='Measure'>
				<IntroTutorialMeasure measure={quarterNoteMeasure(step.beats)}>
					{step.isPoison ? <IntroTutorialFailOverlay /> : null}
				</IntroTutorialMeasure>
			</Section>
		</div>
	);
}
