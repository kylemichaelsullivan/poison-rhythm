import clsx from 'clsx';
import { controlButtonBaseClassName } from '@/lib/control-classes';

type ShowNotesTriggerProps = {
	label: string;
	open: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onFocus: () => void;
	onBlur: (relatedTarget: EventTarget | null) => void;
	onClick: () => void;
};

export function ShowNotesTrigger({
	label,
	open,
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	onClick,
}: ShowNotesTriggerProps) {
	return (
		<button
			type='button'
			className={clsx(
				controlButtonBaseClassName,
				'flex min-h-11 min-w-11 w-11 h-11 items-center justify-center overflow-hidden px-0.5 text-center text-xs leading-tight sm:text-sm',
				open && 'ring-2 ring-primary',
			)}
			title='Note Subdivisions'
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocus={onFocus}
			onBlur={(e) => onBlur(e.relatedTarget)}
			onClick={onClick}
			aria-expanded={open}
			aria-haspopup='dialog'
			aria-label='Choose Which Note Subdivisions to Show'
		>
			{label}
		</button>
	);
}
