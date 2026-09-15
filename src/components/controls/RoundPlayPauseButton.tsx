import clsx from 'clsx';
import type { Ref } from 'react';
import PauseIcon from '@/assets/svg/pause.svg?react';
import PlayIcon from '@/assets/svg/play.svg?react';
import { Icon } from '@/components/layout/Icon';
import {
	focusVisibleRingClassName,
	forcedFocusRingClassName,
	roundPlayPauseButtonClassName,
} from '@/lib/control-classes';

type RoundPlayPauseButtonProps = {
	isPlaying: boolean;
	onClick: () => void;
	/** Accessible name; defaults to Play/Pause. */
	label?: string;
	/** Tooltip hint; defaults to the label. */
	title?: string;
	/**
	 * When set, replaces the play/pause icon with this digit (count-in beat).
	 * Accessible name stays Play/Pause so the control still reads as a toggle.
	 */
	countBeat?: number | null;
	className?: string;
	disabled?: boolean;
	/**
	 * When provided, a disabled button stays focusable (via aria-disabled)
	 * and clicks call this instead of onClick.
	 */
	onDisabledClick?: () => void;
	ref?: Ref<HTMLButtonElement>;
};

export function RoundPlayPauseButton({
	isPlaying,
	onClick,
	label,
	title,
	countBeat = null,
	className,
	disabled = false,
	onDisabledClick,
	ref,
}: RoundPlayPauseButtonProps) {
	const accessibleName = label ?? (isPlaying ? 'Pause' : 'Play');
	const isSoftDisabled = disabled && onDisabledClick !== undefined;
	const showCount = countBeat != null;

	return (
		<button
			type='button'
			className={clsx(
				roundPlayPauseButtonClassName,
				focusVisibleRingClassName,
				forcedFocusRingClassName,
				disabled && 'cursor-not-allowed',
				className,
			)}
			title={title ?? accessibleName}
			disabled={disabled && !isSoftDisabled}
			onClick={disabled ? onDisabledClick : onClick}
			aria-disabled={disabled || undefined}
			aria-label={accessibleName}
			data-count-beat={showCount ? String(countBeat) : undefined}
			ref={ref}
		>
			{showCount ? (
				<span
					aria-hidden='true'
					className='text-xl font-bold leading-none tabular-nums'
				>
					{countBeat}
				</span>
			) : (
				<Icon svg={isPlaying ? PauseIcon : PlayIcon} size='md' />
			)}
		</button>
	);
}
