import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';
import PlayIcon from '@/assets/svg/play.svg?react';
import { Icon } from '@/components/layout/Icon';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useTimedDismiss } from '@/hooks/useTimedDismiss';
import { carouselNavButtonClassName } from '@/lib/control-classes';
import { CAROUSEL_PLAY_DELAY_MS } from '@/lib/timed-notice';
import { CarouselPlayDelayProgress } from './CarouselPlayDelayProgress';

type CarouselStartPlayButtonProps = {
	onStart: () => void;
	isPlaying?: boolean;
};

/**
 * First-measure Play: empty at rest, play glyph on hover/focus or while
 * armed, empty again once this control starts the main Play button.
 */
export function CarouselStartPlayButton({
	onStart,
	isPlaying = false,
}: CarouselStartPlayButtonProps) {
	const { open: armed, onOpen: arm, onClose: cancel } = useDisclosure();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const fire = useCallback(() => {
		cancel();
		onStart();
	}, [cancel, onStart]);

	useTimedDismiss(armed, CAROUSEL_PLAY_DELAY_MS, fire);

	useEffect(() => {
		if (!armed) return;

		const onPointerDown = (event: PointerEvent) => {
			if (buttonRef.current?.contains(event.target as Node)) return;
			cancel();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			const target = event.target;
			if (target instanceof HTMLElement) {
				if (target.closest('.Modal') || target.closest('input, textarea')) {
					return;
				}
			}
			event.preventDefault();
			cancel();
		};

		document.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [armed, cancel]);

	return (
		<button
			type='button'
			className={clsx(
				carouselNavButtonClassName(armed ? false : 'quiet'),
				'CarouselStartPlayButton relative overflow-hidden',
			)}
			disabled={isPlaying}
			aria-label={armed ? 'Cancel Play' : 'Play After a Moment'}
			aria-pressed={armed}
			data-testid='carousel-start-play'
			data-armed={armed ? 'true' : 'false'}
			ref={buttonRef}
			onClick={() => {
				if (armed) {
					cancel();
					return;
				}
				arm();
			}}
		>
			{armed ? (
				<CarouselPlayDelayProgress durationMs={CAROUSEL_PLAY_DELAY_MS} />
			) : null}
			<Icon svg={PlayIcon} />
		</button>
	);
}
