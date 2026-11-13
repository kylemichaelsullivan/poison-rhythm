import { useCallback, useRef } from 'react';
import PlusIcon from '@/assets/svg/plus.svg?react';
import RepeatIcon from '@/assets/svg/repeat.svg?react';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useMeasuresPlayPauseChrome } from '@/hooks/useMeasuresPlayPauseChrome';
import { useOutsideDismiss } from '@/hooks/useOutsideDismiss';
import { carouselNavButtonClassName } from '@/lib/control-classes';
import {
	CAROUSEL_END_MENU_LABEL,
	MEASURE_SET_ACTIONS_LEGEND,
	NEW_LABEL,
	NEW_ROUND_TITLE,
	REUSE_LABEL,
	REUSE_ROUND_TITLE,
} from '@/lib/ui-copy';
import { ControlButton } from './ControlButton';
import { MeasuresPlayPauseButton } from './MeasuresPlayPauseButton';

type CarouselEndMenuProps = {
	onReuse: () => void;
	onNew: () => void;
};

/** Last-measure actions: New, Reuse or Play. */
export function CarouselEndMenu({ onReuse, onNew }: CarouselEndMenuProps) {
	const { open, onClose, setOpen } = useDisclosure();
	const rootRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const { toggleMeasures } = useMeasuresPlayPauseChrome();

	const onEscapeDismiss = useCallback(() => {
		onClose();
		triggerRef.current?.focus();
	}, [onClose]);

	useOutsideDismiss({
		enabled: open,
		rootRef,
		onDismiss: onClose,
		onEscapeDismiss,
	});

	const runAndClose = (fn: () => void) => {
		onClose();
		fn();
	};

	return (
		<div className='CarouselEndMenu relative' ref={rootRef}>
			<button
				type='button'
				className={carouselNavButtonClassName()}
				title={CAROUSEL_END_MENU_LABEL}
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				aria-haspopup='menu'
				aria-label={CAROUSEL_END_MENU_LABEL}
				data-chrome-active={open || undefined}
				data-testid='carousel-end-menu'
				ref={triggerRef}
			>
				⋯
			</button>
			{open ? (
				<fieldset className='absolute z-20 flex flex-col items-center gap-2 rounded-lg border-2 border-secondary bg-white p-2 shadow-raised right-full mr-2 top-1/2 -translate-y-1/2 max-gutter:right-0 max-gutter:mr-0 max-gutter:top-auto max-gutter:bottom-full max-gutter:mb-2 max-gutter:translate-y-0'>
					<legend className='sr-only'>{MEASURE_SET_ACTIONS_LEGEND}</legend>
					<ControlButton
						variant='primary'
						label={NEW_LABEL}
						icon={PlusIcon}
						title={NEW_ROUND_TITLE}
						onClick={() => runAndClose(onNew)}
					/>
					<ControlButton
						label={REUSE_LABEL}
						icon={RepeatIcon}
						title={REUSE_ROUND_TITLE}
						onClick={() => runAndClose(onReuse)}
					/>
					<MeasuresPlayPauseButton
						onClick={() => runAndClose(toggleMeasures)}
					/>
				</fieldset>
			) : null}
		</div>
	);
}
