import clsx from 'clsx';
import { Icon } from '@/components/layout/Icon';
import {
	buttonLiftBorderClassName,
	buttonLiftClassName,
	forcedFocusRingClassName,
} from '@/lib/control-classes';
import type { Ref } from 'react';
import type { SvgIconComponent } from '@/components/layout/Icon';

type ControlButtonProps = {
	label: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary';
	disabled?: boolean;
	title?: string;
	/** Rendered in place of the label, which becomes the accessible name. */
	icon?: SvgIconComponent;
	/**
	 * When provided, a disabled button stays focusable (via aria-disabled)
	 * and clicks call this instead of onClick.
	 */
	onDisabledClick?: () => void;
	ref?: Ref<HTMLButtonElement>;
};

export function ControlButton({
	label,
	onClick,
	variant = 'secondary',
	disabled = false,
	title,
	icon,
	onDisabledClick,
	ref,
}: ControlButtonProps) {
	const isSoftDisabled = disabled && onDisabledClick !== undefined;
	const base = 'border rounded font-medium px-4 py-2';
	const styles = disabled
		? 'border-mid bg-surface-muted text-mid cursor-not-allowed'
		: variant === 'primary'
			? clsx(
					buttonLiftClassName,
					'border-2 border-primary-border bg-primary text-on-primary transition-[box-shadow] duration-200 ease-out',
				)
			: clsx(
					buttonLiftBorderClassName,
					'border-2 border-secondary bg-surface text-black transition-[border-color,box-shadow] duration-200 ease-out',
				);

	return (
		<button
			type='button'
			className={clsx('ControlButton', base, styles, forcedFocusRingClassName)}
			title={title}
			disabled={disabled && !isSoftDisabled}
			onClick={disabled ? onDisabledClick : onClick}
			aria-disabled={disabled || undefined}
			aria-label={icon ? label : undefined}
			ref={ref}
		>
			{icon ? <Icon svg={icon} size='md' /> : label}
		</button>
	);
}
