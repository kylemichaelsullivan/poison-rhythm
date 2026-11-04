import type { CSSProperties } from 'react';

type CarouselPlayDelayProgressProps = {
	durationMs: number;
};

/** Bottom-edge fill while the first-measure Play countdown is armed. */
export function CarouselPlayDelayProgress({
	durationMs,
}: CarouselPlayDelayProgressProps) {
	return (
		<div
			className='CarouselPlayDelayProgress pointer-events-none absolute inset-x-0 bottom-0'
			style={
				{
					'--carousel-play-delay': `${durationMs}ms`,
				} as CSSProperties
			}
			role='progressbar'
			aria-label='Starting play'
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuetext='Starting play'
			data-testid='carousel-play-delay-progress'
			data-duration-ms={durationMs}
		/>
	);
}
