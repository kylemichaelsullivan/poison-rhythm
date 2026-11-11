import clsx from 'clsx';
import { controlButtonBaseClassName } from '@/lib/control-classes';
import { ShowNotesTriggerGlyph } from './ShowNotesTriggerGlyph';
import type { NotationDuration } from '@/lib/notation';

type ShowNotesTriggerProps = {
	duration: Extract<NotationDuration, 'quarter' | 'eighth' | 'sixteenth'>;
	open: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onFocus: () => void;
	onBlur: (relatedTarget: EventTarget | null) => void;
	onClick: () => void;
};

export function ShowNotesTrigger({
	duration,
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
				'relative flex min-h-11 min-w-11 w-11 h-11 items-center justify-center overflow-hidden p-0 text-black',
				open && 'ring-2 ring-primary',
			)}
			title='Choose Which Note Subdivisions to Show'
			data-notation-ready='true'
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocus={onFocus}
			onBlur={(e) => onBlur(e.relatedTarget)}
			onClick={onClick}
			aria-expanded={open}
			aria-haspopup='dialog'
			aria-label='Choose Which Note Subdivisions to Show'
		>
			<ShowNotesTriggerGlyph duration={duration} />
		</button>
	);
}
