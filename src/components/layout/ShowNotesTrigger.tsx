import clsx from 'clsx';
import { useTheme } from '@/contexts';
import { useMusiSyncFont } from '@/hooks/useMusiSyncFont';
import { controlButtonBaseClassName } from '@/lib/control-classes';
import { ShowNotesTriggerGlyph } from './ShowNotesTriggerGlyph';

type ShowNotesTriggerProps = {
	glyph: string;
	open: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onFocus: () => void;
	onBlur: (relatedTarget: EventTarget | null) => void;
	onClick: () => void;
};

export function ShowNotesTrigger({
	glyph,
	open,
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	onClick,
}: ShowNotesTriggerProps) {
	const { ready: fontReady, ensureLoaded } = useMusiSyncFont();
	const { effectiveTheme } = useTheme();

	return (
		<button
			type='button'
			className={clsx(
				controlButtonBaseClassName,
				'relative flex min-h-11 min-w-11 w-11 h-11 items-center justify-center overflow-hidden p-0 text-black',
				open && 'ring-2 ring-primary',
			)}
			title='Note Subdivisions'
			onMouseEnter={() => {
				// Worst case: finish loading subdivision glyphs on hover.
				ensureLoaded();
				onMouseEnter();
			}}
			onMouseLeave={onMouseLeave}
			onFocus={() => {
				ensureLoaded();
				onFocus();
			}}
			onBlur={(e) => onBlur(e.relatedTarget)}
			onClick={onClick}
			aria-expanded={open}
			aria-haspopup='dialog'
			aria-label='Choose Which Note Subdivisions to Show'
		>
			<ShowNotesTriggerGlyph
				glyph={glyph}
				ready={fontReady}
				effectiveTheme={effectiveTheme}
			/>
		</button>
	);
}
