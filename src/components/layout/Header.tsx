import clsx from 'clsx';
import { appChromeBarClassName } from '@/lib/control-classes';
import { AppTitle, ShowNotes } from '.';
import { ActionButton } from './button';

export function Header() {
	return (
		<header
			className={clsx(
				'Header border-b-2 border-primary/35',
				appChromeBarClassName,
			)}
		>
			<ShowNotes />
			<AppTitle />
			<ActionButton />
		</header>
	);
}
