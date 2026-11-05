import { useEffect, useRef } from 'react';
import { useMetronome, useMetronomeTempo } from '@/contexts';
import {
	HIGHWAY_IDLE_PROGRESS,
	HIGHWAY_PX_PER_MEASURE,
	highwayAudioNowWhileHeld,
	highwayAudioProgress,
	highwayMeasureSec,
	highwayTrackTransform,
} from '@/lib/scroll-animation';
import type { RefObject } from 'react';
import type { ScrollDirection } from '@/lib/settings-schema';

type TrackRefs = {
	trackRef: RefObject<HTMLDivElement | null>;
	rootRef: RefObject<HTMLDivElement | null>;
};

/**
 * Drives the highway track transform from the AudioContext timeline used by
 * scheduleHit, so gems cross the judgment line when hits sound.
 * Count-in scrolls immediately across one lead-in measure (−1 → 0); idle rests
 * at −1 so that space is already visible. Writes to the DOM in rAF.
 */
export function useScrollHighwayTrack(
	{ trackRef, rootRef }: TrackRefs,
	active: boolean,
	direction: Exclude<ScrollDirection, 'none'>,
): void {
	const { isMeasuresRunning, highwayClock } = useMetronome();
	const { tempo } = useMetronomeTempo();

	const scrolling = active && isMeasuresRunning;
	const measureSec = highwayMeasureSec(tempo);

	const directionRef = useRef(direction);
	const measureSecRef = useRef(measureSec);
	const scrollingRef = useRef(scrolling);
	const highwayClockRef = useRef(highwayClock);

	directionRef.current = direction;
	measureSecRef.current = measureSec;
	scrollingRef.current = scrolling;
	highwayClockRef.current = highwayClock;

	useEffect(() => {
		const sampleProgress = (): number => {
			if (!scrollingRef.current) return HIGHWAY_IDLE_PROGRESS;
			const clock = highwayClockRef.current;
			const originAt = clock.getOriginAt();
			if (originAt === null) return HIGHWAY_IDLE_PROGRESS;
			const audioNow = highwayAudioNowWhileHeld(
				clock.getAudioNow(),
				clock.getHoldStartedAt(),
			);
			return highwayAudioProgress(
				audioNow,
				originAt,
				measureSecRef.current,
				clock.getHeldSec(),
			);
		};

		applyFrame(trackRef, rootRef, directionRef.current, sampleProgress());

		if (!scrolling) {
			return;
		}

		let rafId = 0;
		const tick = () => {
			if (!scrollingRef.current) return;
			applyFrame(trackRef, rootRef, directionRef.current, sampleProgress());
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [scrolling, trackRef, rootRef]);
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
