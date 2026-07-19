import clsx from 'clsx';
import PauseIcon from '@/assets/svg/pause.svg?react';
import PlayIcon from '@/assets/svg/play.svg?react';
import { Icon } from '@/components/layout/Icon';
import {
	focusVisibleRingClassName,
	roundPlayPauseButtonClassName,
} from '@/lib/control-classes';

type RoundPlayPauseButtonProps = {
	isPlaying: boolean;
	onClick: () => void;
	/** Accessible name; defaults to Play/Pause. */
	label?: string;
	/** Tooltip hint; defaults to the label. */
	title?: string;
	className?: string;
	disabled?: boolean;
	/**
	 * When provided, a disabled button stays focusable (via aria-disabled)
	 * and clicks call this instead of onClick.
	 */
	onDisabledClick?: () => void;
};

export function RoundPlayPauseButton({
	isPlaying,
	onClick,
	label,
	title,
	className,
	disabled = false,
	onDisabledClick,
}: RoundPlayPauseButtonProps) {
	const accessibleName = label ?? (isPlaying ? 'Pause' : 'Play');
	const isSoftDisabled = disabled && onDisabledClick !== undefined;

	return (
		<button
			type='button'
			className={clsx(
				roundPlayPauseButtonClassName,
				focusVisibleRingClassName,
				disabled && 'cursor-not-allowed',
				className,
			)}
			title={title ?? accessibleName}
			disabled={disabled && !isSoftDisabled}
			onClick={disabled ? onDisabledClick : onClick}
			aria-disabled={disabled || undefined}
			aria-label={accessibleName}
		>
			<Icon svg={isPlaying ? PauseIcon : PlayIcon} size='md' />
		</button>
	);
}
