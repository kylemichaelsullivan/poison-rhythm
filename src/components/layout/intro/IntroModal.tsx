import { useCallback, useEffect, useState } from 'react';
import { Stack } from '@/components/ui';
import {
	INTRO_PLAY_HALO_AFTER_MS,
	INTRO_TUTORIAL_STEPS,
} from '@/lib/intro-tutorial';
import { Modal } from '../Modal';
import { IntroSkipToggle } from './IntroSkipToggle';
import { IntroTutorialNav } from './IntroTutorialNav';
import { IntroTutorialStep } from './IntroTutorialStep';

type IntroModalProps = {
	open: boolean;
	onClose: (skipFuture: boolean) => void;
};

const LAST_STEP = INTRO_TUTORIAL_STEPS.length - 1;

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** First-visit Simon Says tutorial, then optional skip on this device. */
export function IntroModal({ open, onClose }: IntroModalProps) {
	const [skipFuture, setSkipFuture] = useState(true);
	const [stepIndex, setStepIndex] = useState(0);
	const [playHalo, setPlayHalo] = useState(false);
	const onLastStep = stepIndex >= LAST_STEP;

	useEffect(() => {
		if (!open) {
			setStepIndex(0);
			setSkipFuture(true);
			setPlayHalo(false);
		}
	}, [open]);

	useEffect(() => {
		if (!open || !onLastStep) {
			setPlayHalo(false);
			return;
		}

		if (prefersReducedMotion()) {
			setPlayHalo(true);
			return;
		}

		setPlayHalo(false);
		const timer = window.setTimeout(() => {
			setPlayHalo(true);
		}, INTRO_PLAY_HALO_AFTER_MS);

		return () => {
			window.clearTimeout(timer);
		};
	}, [open, onLastStep]);

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

	useEffect(() => {
		if (!open) return;

		// Arrow keys only — never touch Enter/Space; those activate the focused CTA.
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

			e.preventDefault();
			e.stopPropagation();

			if (e.key === 'ArrowLeft') {
				goBack();
				return;
			}
			if (onLastStep) {
				// Right Arrow dismisses only after fail copy + Let’s Play halo.
				if (playHalo) dismiss();
				return;
			}
			goNext();
		}

		function handleKeyUp(e: KeyboardEvent) {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
			e.preventDefault();
			e.stopPropagation();
		}

		window.addEventListener('keydown', handleKeyDown, true);
		window.addEventListener('keyup', handleKeyUp, true);
		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
			window.removeEventListener('keyup', handleKeyUp, true);
		};
	}, [open, goBack, goNext, onLastStep, playHalo, dismiss]);

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
					playHalo={playHalo}
					onBack={goBack}
					onNext={goNext}
					onPlay={dismiss}
					onSelectStep={goToStep}
				/>
			</Stack>
		</Modal>
	);
}
