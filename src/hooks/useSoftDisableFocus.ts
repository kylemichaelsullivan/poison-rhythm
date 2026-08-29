import type { RefObject } from 'react';
import { useCallback, useRef } from 'react';
import { focusWithForcedRing } from '@/lib/control-classes';

type UseSoftDisableFocusResult = {
	playButtonRef: RefObject<HTMLButtonElement | null>;
	focusPlayButton: () => void;
	handleNewPoison: () => void;
};

/**
 * Soft-disable focus guidance: New/Reuse when empty should steer focus to Play.
 */
export function useSoftDisableFocus(
	onNewRound: () => void,
): UseSoftDisableFocusResult {
	const playButtonRef = useRef<HTMLButtonElement>(null);

	const focusPlayButton = useCallback(() => {
		focusWithForcedRing(playButtonRef.current);
	}, []);

	const handleNewPoison = useCallback(() => {
		onNewRound();
		focusPlayButton();
	}, [onNewRound, focusPlayButton]);

	return { playButtonRef, focusPlayButton, handleNewPoison };
}
