import { useRef } from 'react';
import { useMetronome, useMetronomeTempo } from '@/contexts';
import { applyTapTempo } from '@/lib/metronome-tap-tempo';

export function useTapTempo() {
	const { setTempo } = useMetronomeTempo();
	const { startMetronome } = useMetronome();
	const tapTimesRef = useRef<number[]>([]);

	function onTap() {
		const nextTaps = [...tapTimesRef.current, Date.now()];
		startMetronome();
		tapTimesRef.current = applyTapTempo(nextTaps, setTempo);
	}

	return { onTap };
}
