import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useGame, useMetronome, useSubdivision } from '@/contexts';
import { COUNT_IN_BEATS } from '@/lib/metronome-defaults';
import {
	countInHighwayProgress,
	HIGHWAY_PX_PER_MEASURE,
	highwayProgress,
	highwayTrackTransform,
} from '@/lib/scroll-animation';
import type { ScrollDirection } from '@/lib/settings-schema';

type TrackRefs = {
	trackRef: RefObject<HTMLDivElement | null>;
	rootRef: RefObject<HTMLDivElement | null>;
};

/**
 * Drives the highway track transform from a continuous tempo clock.
 * Writes to the DOM in rAF (no per-frame React state) so gems do not flash.
 * Resyncs stay monotonic — never jump backward when UI events arrive late.
 */
export function useScrollHighwayTrack(
	{ trackRef, rootRef }: TrackRefs,
	active: boolean,
	direction: Exclude<ScrollDirection, 'none'>,
): void {
	const { currentIndex } = useGame();
	const {
		subdivisionIndex,
		tempo,
		isCountingIn,
		countInBeat,
		isMeasuresRunning,
		measureCycle,
	} = useMetronome();
	const { subdivisionLevel } = useSubdivision();

	const animating = active && isMeasuresRunning;
	const measureMs = (60 / Math.max(tempo, 1)) * 1000 * 4;

	const anchorProgressRef = useRef(0);
	const anchorTimeRef = useRef(performance.now());
	const measureIndexRef = useRef(currentIndex);
	const prevSubRef = useRef(subdivisionIndex);
	const directionRef = useRef(direction);
	const measureMsRef = useRef(measureMs);
	const animatingRef = useRef(animating);

	directionRef.current = direction;
	measureMsRef.current = measureMs;
	animatingRef.current = animating;

	useEffect(() => {
		if (isCountingIn) {
			measureIndexRef.current = currentIndex;
			prevSubRef.current = subdivisionIndex;
			return;
		}
		if (subdivisionIndex < prevSubRef.current && currentIndex < measureCycle) {
			measureIndexRef.current = measureCycle;
		} else {
			measureIndexRef.current = currentIndex;
		}
		prevSubRef.current = subdivisionIndex;
	}, [subdivisionIndex, currentIndex, measureCycle, isCountingIn]);

	// Resync to the audible step; keep progress monotonic.
	// biome-ignore lint/correctness/useExhaustiveDependencies: beat identity is the resync signal
	useEffect(() => {
		const target = isCountingIn
			? countInHighwayProgress(countInBeat, 0, COUNT_IN_BEATS)
			: highwayProgress(
					measureIndexRef.current,
					subdivisionIndex,
					subdivisionLevel,
					0,
				);
		const now = performance.now();
		const predicted =
			anchorProgressRef.current +
			(now - anchorTimeRef.current) / measureMsRef.current;
		const next = animating ? Math.max(predicted, target) : target;
		anchorProgressRef.current = next;
		anchorTimeRef.current = now;
		applyFrame(trackRef, rootRef, directionRef.current, next);
	}, [
		animating,
		isCountingIn,
		countInBeat,
		subdivisionIndex,
		currentIndex,
		measureCycle,
		subdivisionLevel,
		trackRef,
		rootRef,
	]);

	useEffect(() => {
		if (!animating) {
			applyFrame(
				trackRef,
				rootRef,
				directionRef.current,
				anchorProgressRef.current,
			);
			return;
		}

		let rafId = 0;
		const tick = () => {
			if (!animatingRef.current) return;
			const elapsed = performance.now() - anchorTimeRef.current;
			const progress =
				anchorProgressRef.current + elapsed / measureMsRef.current;
			applyFrame(trackRef, rootRef, directionRef.current, progress);
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [animating, trackRef, rootRef]);
}

function applyFrame(
	trackRef: RefObject<HTMLDivElement | null>,
	rootRef: RefObject<HTMLDivElement | null>,
	direction: Exclude<ScrollDirection, 'none'>,
	progress: number,
): void {
	const track = trackRef.current;
	if (track) {
		track.style.transform = highwayTrackTransform(
			direction,
			progress,
			HIGHWAY_PX_PER_MEASURE,
		);
	}
	const root = rootRef.current;
	if (root) {
		root.dataset.progress = progress.toFixed(3);
	}
}
