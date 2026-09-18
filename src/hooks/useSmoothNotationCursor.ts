import { useEffect, useRef, useState } from 'react';
import { useMetronome, useSubdivision } from '@/contexts';
import {
	smoothSubdivisionPositionPercent,
	subdivisionPositionPercent,
	subdivisionPulseMs,
} from '@/lib/subdivision-playback';

/** Tempo-synced playhead position (0–100) that glides across the notation line. */
export function useSmoothNotationCursor(active: boolean): number {
	const { subdivisionIndex, tempo } = useMetronome();
	const { subdivisionLevel } = useSubdivision();
	const pulseMs = subdivisionPulseMs(tempo, subdivisionLevel);
	const beatStartRef = useRef(performance.now());
	const [leftPct, setLeftPct] = useState(() =>
		subdivisionPositionPercent(subdivisionIndex, subdivisionLevel),
	);

	// Reset the glide origin whenever the beat index advances.
	// biome-ignore lint/correctness/useExhaustiveDependencies: subdivisionIndex triggers a beat-clock reset
	useEffect(() => {
		if (!active) return;
		beatStartRef.current = performance.now();
	}, [active, subdivisionIndex]);

	useEffect(() => {
		if (!active) {
			setLeftPct(
				subdivisionPositionPercent(subdivisionIndex, subdivisionLevel),
			);
			return;
		}

		let rafId = 0;
		const tick = () => {
			const beatFraction = Math.min(
				(performance.now() - beatStartRef.current) / pulseMs,
				1,
			);
			const virtualStep = subdivisionIndex + beatFraction;
			setLeftPct(
				smoothSubdivisionPositionPercent(virtualStep, subdivisionLevel),
			);
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [active, pulseMs, subdivisionIndex, subdivisionLevel]);

	return leftPct;
}
