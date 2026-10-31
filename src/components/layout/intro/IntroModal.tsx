import { useCallback, useEffect, useState } from 'react';
import { Stack } from '@/components/ui';
import { INTRO_TUTORIAL_STEPS } from '@/lib/intro-tutorial';
import { Modal } from '../Modal';
import { IntroSkipToggle } from './IntroSkipToggle';
import { IntroTutorialNav } from './IntroTutorialNav';
import { IntroTutorialStep } from './IntroTutorialStep';

type IntroModalProps = {
	open: boolean;
	onClose: (skipFuture: boolean) => void;
};

const LAST_STEP = INTRO_TUTORIAL_STEPS.length - 1;

/** First-visit Simon Says tutorial, then optional skip on this device. */
export function IntroModal({ open, onClose }: IntroModalProps) {
	const [skipFuture, setSkipFuture] = useState(true);
	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		if (!open) {
			setStepIndex(0);
			setSkipFuture(true);
		}
	}, [open]);

	const dismiss = useCallback(() => {
		onClose(skipFuture);
	}, [onClose, skipFuture]);

	const goBack = useCallback(() => {
		setStepIndex((current) => Math.max(0, current - 1));
	}, []);

	const goNext = useCallback(() => {
		setStepIndex((current) => Math.min(LAST_STEP, current + 1));
	}, []);

	const goToStep = useCallback((index: number) => {
		setStepIndex(Math.min(LAST_STEP, Math.max(0, index)));
	}, []);

	const step = INTRO_TUTORIAL_STEPS[stepIndex] ?? INTRO_TUTORIAL_STEPS[0];

	return (
		<Modal
			open={open}
			size='md'
			title='Welcome to Poison Rhythm'
			onClose={dismiss}
		>
			<Stack gap='3'>
				<IntroTutorialStep step={step} />
				<IntroSkipToggle checked={skipFuture} onChange={setSkipFuture} />
				<IntroTutorialNav
					stepIndex={stepIndex}
					stepCount={INTRO_TUTORIAL_STEPS.length}
					onBack={goBack}
					onNext={goNext}
					onPlay={dismiss}
					onSelectStep={goToStep}
				/>
			</Stack>
		</Modal>
	);
}
