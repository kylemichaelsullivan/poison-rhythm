import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import PlusIcon from '@/assets/svg/plus.svg?react';
import RepeatIcon from '@/assets/svg/repeat.svg?react';
import { useMetronome } from '@/contexts';
import { useDisclosure } from '@/hooks/useDisclosure';
import { carouselNavButtonClassName } from '@/lib/control-classes';
import { ControlButton } from './ControlButton';
import { RoundPlayPauseButton } from './RoundPlayPauseButton';

type CarouselEndMenuProps = {
	onReuse: () => void;
	onNew: () => void;
};

/** Last-measure actions: New, Reuse, or Play. */
export function CarouselEndMenu({ onReuse, onNew }: CarouselEndMenuProps) {
	const { open, onClose, setOpen } = useDisclosure();
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const {
		isMeasuresRunning,
		isCountingIn,
		countInBeat,
		isLit,
		toggleMeasures,
	} = useMetronome();

	useEffect(() => {
		if (!open) return;

		const onPointerDown = (event: PointerEvent) => {
			if (rootRef.current?.contains(event.target as Node)) return;
			onClose();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			event.preventDefault();
			onClose();
			triggerRef.current?.focus();
		};

		document.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [open, onClose]);

	return (
		<div className='CarouselEndMenu relative' ref={rootRef}>
			<button
				type='button'
				className={carouselNavButtonClassName()}
				title='New, Reuse, or Play'
				aria-label='New, Reuse, or Play'
				aria-haspopup='menu'
				aria-expanded={open}
				data-testid='carousel-end-menu'
				onClick={() => setOpen(!open)}
				ref={triggerRef}
			>
				⋯
			</button>
			{open ? (
				<fieldset className='absolute z-20 flex flex-col items-center gap-2 rounded-lg border-2 border-secondary bg-white p-2 shadow-raised right-full mr-2 top-1/2 -translate-y-1/2 max-gutter:right-0 max-gutter:mr-0 max-gutter:top-auto max-gutter:bottom-full max-gutter:mb-2 max-gutter:translate-y-0'>
					<legend className='sr-only'>Measure Set Actions</legend>
					<ControlButton
						variant='primary'
						label='New'
						icon={PlusIcon}
						title='New Poison Rhythm, New Measures'
						onClick={() => {
							onClose();
							onNew();
						}}
					/>
					<ControlButton
						label='Reuse'
						icon={RepeatIcon}
						title='New Measures, Same Poison Rhythm'
						onClick={() => {
							onClose();
							onReuse();
						}}
					/>
					<RoundPlayPauseButton
						className={clsx(
							'transition-[box-shadow] duration-100',
							(isCountingIn || isMeasuresRunning) &&
								isLit &&
								'ring-2 ring-primary',
						)}
						isPlaying={isMeasuresRunning && !isCountingIn}
						label={isMeasuresRunning ? 'Pause' : 'Play'}
						countBeat={isCountingIn ? countInBeat : null}
						onClick={() => {
							onClose();
							toggleMeasures();
						}}
					/>
				</fieldset>
			) : null}
		</div>
	);
}
