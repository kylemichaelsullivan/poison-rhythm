import clsx from 'clsx';
import {
	buttonLiftBorderClassName,
	buttonLiftClassName,
} from '@/lib/control-classes';
import type { ReactNode, Ref } from 'react';

export type IconButtonVariant = 'info' | 'bare' | 'modalClose';

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
		buttonLiftBorderClassName,
		'flex size-11 shrink-0 items-center justify-center rounded-full border border-mid bg-surface-muted text-sm font-semibold leading-none text-dark transition-[border-color,box-shadow] duration-200 ease-out',
	),
	bare: clsx(
		buttonLiftClassName,
		'group inline-flex items-center rounded transition-[box-shadow] duration-200 ease-out',
	),
	modalClose: clsx(
		buttonLiftClassName,
		'flex min-h-11 min-w-11 items-center justify-center text-xl font-semibold leading-none text-dark transition-[box-shadow] duration-200 ease-out',
	),
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
