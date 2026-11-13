import clsx from 'clsx';
import { primaryFillChromeClassName } from '@/lib/control-classes';
import { dataFlag } from '@/lib/data-attr';
import type { ReactNode, Ref } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
	children: ReactNode;
	onClick: () => void;
	variant?: ButtonVariant;
	title?: string;
	disabled?: boolean;
	/** Fill available row space (`true` → flex-1, `'auto'` → flex-auto). */
	grow?: boolean | 'auto';
	/** Marks this control as the preferred initial focus target inside a Modal. */
	modalInitialFocus?: boolean;
	ref?: Ref<HTMLButtonElement>;
};

const variantClassName: Record<ButtonVariant, string> = {
	primary: clsx(
		primaryFillChromeClassName,
		'rounded border border-primary-border bg-primary px-3 py-1.5 text-sm text-on-primary',
	),
	secondary:
		'rounded border border-mid bg-surface-muted px-3 py-1.5 text-sm text-black',
	ghost:
		'rounded border border-transparent bg-transparent px-3 py-1.5 text-sm text-dark',
};

export function Button({
	children,
	onClick,
	variant = 'secondary',
	title,
	disabled = false,
	grow = false,
	modalInitialFocus = false,
	ref,
}: ButtonProps) {
	return (
		<button
			type='button'
			className={clsx(
				'Button',
				variantClassName[variant],
				grow === true && 'flex-1 whitespace-nowrap',
				grow === 'auto' && 'flex-auto whitespace-nowrap',
				disabled && 'cursor-not-allowed opacity-50',
			)}
			title={title}
			disabled={disabled}
			data-chrome-active={dataFlag(variant === 'primary')}
			data-modal-initial-focus={dataFlag(Boolean(modalInitialFocus))}
			onClick={onClick}
			ref={ref}
		>
			{children}
		</button>
	);
}
