import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';
import { focusVisibleRingClassName } from '@/lib/control-classes';

export type IconButtonVariant = 'info' | 'bare';

type IconButtonProps = {
	children: ReactNode;
	onClick: () => void;
	label: string;
	variant?: IconButtonVariant;
	title?: string;
	disabled?: boolean;
	popup?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
	ref?: Ref<HTMLButtonElement>;
};

const variantClassName: Record<IconButtonVariant, string> = {
	info: clsx(
		'flex size-6 shrink-0 items-center justify-center rounded-full border border-mid bg-surface-muted text-sm font-semibold leading-none text-dark shadow-control transition-[colors,box-shadow]',
		'hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-soft',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
	),
	bare: clsx('group rounded transition-colors', focusVisibleRingClassName),
};

export function IconButton({
	children,
	onClick,
	label,
	variant = 'bare',
	title,
	disabled = false,
	popup,
	ref,
}: IconButtonProps) {
	return (
		<button
			type='button'
			className={clsx(
				'IconButton',
				variantClassName[variant],
				disabled && 'cursor-not-allowed opacity-50',
			)}
			title={title ?? label}
			aria-label={label}
			aria-haspopup={popup}
			disabled={disabled}
			onClick={onClick}
			ref={ref}
		>
			{children}
		</button>
	);
}
