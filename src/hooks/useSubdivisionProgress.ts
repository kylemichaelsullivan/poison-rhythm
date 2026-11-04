import { useEffect, useRef, useState } from 'react';
import { useMetronome, useMetronomeTempo, useSubdivision } from '@/contexts';
import { subdivisionPulseMs } from '@/lib/subdivision-playback';

/**
 * Fractional subdivision step for playhead consumers.
 * When active, glides `subdivisionIndex → subdivisionIndex+1` over one pulse;
 * when inactive, returns the discrete index.
 */
export function useSubdivisionProgress(active: boolean): number {
	const { subdivisionIndex } = useMetronome();
	const { tempo } = useMetronomeTempo();
	const { subdivisionLevel } = useSubdivision();
	const pulseMs = subdivisionPulseMs(tempo, subdivisionLevel);
	const beatStartRef = useRef(performance.now());
	const [step, setStep] = useState(subdivisionIndex);

	// Reset the glide origin whenever the beat index advances.
	// biome-ignore lint/correctness/useExhaustiveDependencies: subdivisionIndex triggers a beat-clock reset
	useEffect(() => {
		if (!active) return;
		beatStartRef.current = performance.now();
	}, [active, subdivisionIndex]);

	useEffect(() => {
		if (!active) {
			setStep(subdivisionIndex);
			return;
		}

		let rafId = 0;
		const tick = () => {
			const beatFraction = Math.min(
				(performance.now() - beatStartRef.current) / pulseMs,
				1,
			);
			setStep(subdivisionIndex + beatFraction);
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [active, pulseMs, subdivisionIndex]);

	return step;
}
