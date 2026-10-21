import clsx from 'clsx';
import { appChromeBarFooterClassName } from '@/lib/control-classes';
import { Metronome, Settings } from './button';
import { Copyright } from './Copyright';

/**
 * Equal halves of the padded footer row; widen only the direct CornerButton
 * trigger. Do not use `[&_button]` — Modal mounts in-tree and would stretch
 * every control inside Metronome / Settings.
 */
const footerActionClassName =
	'min-w-0 max-sm:[&>button]:w-full! max-sm:[&>button]:min-w-0 sm:[&>button]:w-auto';

export function Footer() {
	return (
		<footer
			className={clsx(
				'Footer w-full border-t-4 border-primary bg-secondary py-2 text-on-secondary',
				'grid grid-cols-2 items-center gap-x-3 gap-y-2',
				'pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]',
				'sm:flex sm:justify-between sm:gap-2',
				appChromeBarFooterClassName,
			)}
		>
			<div className={clsx('order-1', footerActionClassName)}>
				<Metronome />
			</div>
			<div className='order-3 col-span-2 flex justify-center sm:order-2 sm:col-auto sm:w-auto'>
				<Copyright />
			</div>
			<div className={clsx('order-2 sm:order-3', footerActionClassName)}>
				<Settings />
			</div>
		</footer>
	);
}
