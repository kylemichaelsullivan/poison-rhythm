import { useRef } from 'react';
import { useMetronome } from '@/contexts/MetronomeContext';
import { applyTapTempo } from '@/lib/metronome-tap-tempo';

export function useTapTempo() {
	const { setTempo, startMetronome } = useMetronome();
	const tapTimesRef = useRef<number[]>([]);

	function onTap() {
		const nextTaps = [...tapTimesRef.current, Date.now()];
		startMetronome();
		tapTimesRef.current = applyTapTempo(nextTaps, setTempo);
	}

	return { onTap };
}
