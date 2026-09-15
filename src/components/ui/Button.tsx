import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';
import { focusVisibleRingClassName } from '@/lib/control-classes';

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
	primary:
		'rounded border-2 border-primary-border bg-primary px-3 py-1.5 text-sm text-on-primary shadow-primary-glow transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-raised',
	secondary:
		'rounded border border-mid bg-surface-muted px-3 py-1.5 text-sm text-black shadow-control transition-[colors,box-shadow] hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-soft',
	ghost:
		'rounded border border-transparent bg-transparent px-3 py-1.5 text-sm text-dark transition-colors hover:bg-primary/10 hover:text-primary',
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
				focusVisibleRingClassName,
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
