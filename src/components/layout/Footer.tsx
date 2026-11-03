import clsx from 'clsx';
import { appChromeBarFooterClassName } from '@/lib/control-classes';
import { Metronome, Settings } from './button';
import { Copyright } from './Copyright';

/**
 * Equal halves of the padded footer row on small screens: stretch the cell,
 * then widen only the direct CornerButton trigger. Do not use `[&_button]` —
 * Modal mounts in-tree and would stretch every control inside Metronome /
 * Settings. `justify-self-start/end` alone shrinks the cell to content, which
 * collapsed the icon-only Settings control below a square.
 *
 * Copyright is in-flow under the controls below `sm`, and absolutely centered
 * on the footer (viewport) from `sm` up so unequal Metronome / Settings widths
 * cannot shift it.
 */
const footerActionClassName =
	'min-w-0 max-sm:[&>button]:w-full! sm:[&>button]:w-auto';

export function Footer() {
	return (
		<footer
			className={clsx(
				'Footer relative w-full border-t-4 border-primary bg-secondary py-2 text-on-secondary',
				'grid grid-cols-2 items-center gap-x-3 gap-y-2',
				'pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]',
				'sm:gap-2',
				appChromeBarFooterClassName,
			)}
		>
			<div
				className={clsx(
					'order-1 justify-self-stretch sm:justify-self-start',
					footerActionClassName,
				)}
			>
				<Metronome />
			</div>
			<div
				className={clsx(
					'order-2 justify-self-stretch sm:justify-self-end',
					footerActionClassName,
				)}
			>
				<Settings />
			</div>
			<div
				className={clsx(
					'order-3 col-span-2 justify-self-center',
					'sm:pointer-events-none sm:absolute sm:inset-0 sm:order-none sm:col-auto sm:flex sm:items-center sm:justify-center',
				)}
			>
				<div className='sm:pointer-events-auto'>
					<Copyright />
				</div>
			</div>
		</footer>
	);
}
