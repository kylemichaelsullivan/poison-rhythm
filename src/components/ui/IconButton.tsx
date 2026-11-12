import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';

export type IconButtonVariant = 'info' | 'bare' | 'circle' | 'modalClose';

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
	info: 'flex size-11 shrink-0 items-center justify-center rounded-full border border-mid bg-surface-muted text-sm font-semibold leading-none text-dark',
	bare: 'inline-flex items-center rounded',
	circle: 'inline-flex items-center justify-center rounded-full',
	modalClose:
		'flex min-h-11 min-w-11 items-center justify-center text-xl font-semibold leading-none text-dark',
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
