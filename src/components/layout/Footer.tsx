import clsx from 'clsx';
import { appChromeBarClassName } from '@/lib/control-classes';
import { Metronome, Settings } from './button';
import { Copyright } from './Copyright';

export function Footer() {
	return (
		<footer
			className={clsx(
				'Footer border-t-2 border-primary/30',
				appChromeBarClassName,
			)}
		>
			<Metronome />
			<Copyright />
			<Settings />
		</footer>
	);
}
