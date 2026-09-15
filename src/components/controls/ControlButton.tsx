import clsx from 'clsx';
import type { Ref } from 'react';
import { Icon, type SvgIconComponent } from '@/components/layout/Icon';
import {
	focusVisibleRingClassName,
	forcedFocusRingClassName,
} from '@/lib/control-classes';

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
	const base = 'border rounded font-medium px-4 py-2 transition';
	const styles = disabled
		? 'border-mid bg-surface-muted text-mid cursor-not-allowed'
		: variant === 'primary'
			? 'border-2 border-primary-border bg-primary text-on-primary shadow-primary-glow hover:opacity-90'
			: 'border border-mid bg-surface-muted text-black shadow-control hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-soft';

	return (
		<button
			type='button'
			className={clsx(
				'ControlButton',
				base,
				styles,
				focusVisibleRingClassName,
				forcedFocusRingClassName,
			)}
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
