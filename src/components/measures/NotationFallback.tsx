import clsx from 'clsx';
import {
	type MeasurePlaybackPhase,
	measureShellClass,
} from './measure-phase-chrome';

type NotationFallbackProps = {
	hidden?: boolean;
	phase?: MeasurePlaybackPhase;
};

/** Notation-shaped shell shown while the lazy notation chunk loads. */
export function NotationFallback({
	hidden = false,
	phase,
}: NotationFallbackProps) {
	return (
		<output
			className={clsx(
				'MeasureNotation relative flex w-full items-center justify-center px-3 py-4',
				measureShellClass(phase),
				hidden && 'opacity-0',
			)}
			aria-live='polite'
			aria-busy='true'
		>
			<span className='text-sm text-muted'>Loading Rhythm…</span>
		</output>
	);
}
