import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import PlayIcon from '@/assets/svg/play.svg?react';
import { Icon } from '@/components/layout/Icon';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useOutsideDismiss } from '@/hooks/useOutsideDismiss';
import { useTimedDismiss } from '@/hooks/useTimedDismiss';
import { carouselNavButtonClassName } from '@/lib/control-classes';
import { dataBool } from '@/lib/data-attr';
import { CAROUSEL_PLAY_DELAY_MS } from '@/lib/timed-notice';
import { carouselStartPlayLabel } from '@/lib/ui-copy';
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
	useOutsideDismiss({
		enabled: armed,
		rootRef: buttonRef,
		onDismiss: cancel,
	});

	const label = carouselStartPlayLabel(armed);
	const onClick = () => {
		if (armed) {
			cancel();
			return;
		}
		arm();
	};

	return (
		<button
			type='button'
			className={clsx(
				carouselNavButtonClassName(armed ? false : 'quiet'),
				'CarouselStartPlayButton relative overflow-hidden',
			)}
			disabled={isPlaying}
			title={label}
			aria-label={label}
			aria-pressed={armed}
			data-testid='carousel-start-play'
			data-armed={dataBool(armed)}
			ref={buttonRef}
			onClick={onClick}
		>
			{armed ? (
				<CarouselPlayDelayProgress durationMs={CAROUSEL_PLAY_DELAY_MS} />
			) : null}
			<Icon svg={PlayIcon} />
		</button>
	);
}
