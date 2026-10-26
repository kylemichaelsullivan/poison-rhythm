import clsx from 'clsx';
import {
	buttonLiftBorderClassName,
	buttonLiftClassName,
} from '@/lib/control-classes';
import type { ReactNode, Ref } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
	children: ReactNode;
	onClick: () => void;
	variant?: ButtonVariant;
	title?: string;
	disabled?: boolean;
	/** Marks this control as the preferred initial focus target inside a Modal. */
	modalInitialFocus?: boolean;
	ref?: Ref<HTMLButtonElement>;
};

const variantClassName: Record<ButtonVariant, string> = {
	primary: clsx(
		buttonLiftClassName,
		'rounded border-2 border-primary-border bg-primary px-3 py-1.5 text-sm text-on-primary transition-[box-shadow] duration-200 ease-out',
	),
	secondary: clsx(
		buttonLiftBorderClassName,
		'rounded border border-mid bg-surface-muted px-3 py-1.5 text-sm text-black transition-[border-color,box-shadow] duration-200 ease-out',
	),
	ghost: clsx(
		buttonLiftBorderClassName,
		'rounded border border-transparent bg-transparent px-3 py-1.5 text-sm text-dark transition-[border-color,box-shadow] duration-200 ease-out',
	),
};

export function Button({
	children,
	onClick,
	variant = 'secondary',
	title,
	disabled = false,
	modalInitialFocus = false,
	ref,
}: ButtonProps) {
	return (
		<button
			type='button'
			className={clsx(
				'Button',
				variantClassName[variant],
				disabled && 'cursor-not-allowed opacity-50',
			)}
			title={title}
			disabled={disabled}
			data-modal-initial-focus={modalInitialFocus ? 'true' : undefined}
			onClick={onClick}
			ref={ref}
		>
			{children}
		</button>
	);
}
