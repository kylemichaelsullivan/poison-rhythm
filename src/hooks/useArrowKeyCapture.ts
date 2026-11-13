import { useEffect } from 'react';

type UseArrowKeyCaptureOptions = {
	onLeft: () => void;
	onRight: () => void;
	/** When false, skips keyup preventDefault (ShowNotes only stops propagation). */
	preventDefaultOnKeyUp?: boolean;
};

/**
 * Capture-phase Arrow Left/Right handlers while `enabled`. Stops propagation
 * so metronome tempo shortcuts do not fire underneath popovers/modals.
 */
export function useArrowKeyCapture(
	enabled: boolean,
	{ onLeft, onRight, preventDefaultOnKeyUp = false }: UseArrowKeyCaptureOptions,
) {
	useEffect(() => {
		if (!enabled) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
			e.preventDefault();
			e.stopPropagation();
			if (e.key === 'ArrowLeft') {
				onLeft();
				return;
			}
			onRight();
		}

		function handleKeyUp(e: KeyboardEvent) {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
			if (preventDefaultOnKeyUp) e.preventDefault();
			e.stopPropagation();
		}

		window.addEventListener('keydown', handleKeyDown, true);
		window.addEventListener('keyup', handleKeyUp, true);
		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
			window.removeEventListener('keyup', handleKeyUp, true);
		};
	}, [enabled, onLeft, onRight, preventDefaultOnKeyUp]);
}
