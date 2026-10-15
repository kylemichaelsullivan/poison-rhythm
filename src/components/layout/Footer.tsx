import clsx from 'clsx';
import {
	appChromeBarClassName,
	appChromeBarFooterClassName,
} from '@/lib/control-classes';
import { Metronome, Settings } from './button';
import { Copyright } from './Copyright';

export function Footer() {
	return (
		<footer
			className={clsx(
				'Footer border-t-4 border-primary bg-secondary text-on-secondary',
				appChromeBarClassName,
				appChromeBarFooterClassName,
			)}
		>
			<Metronome />
			<Copyright />
			<Settings />
		</footer>
	);
}
